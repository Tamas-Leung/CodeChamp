import { hri } from 'human-readable-ids';
import { decodeToken } from '../auth/token.js';
import { insertMatch } from '../matchs/index.js';
import { getRandomProblemId } from '../problems/index.js';

export const Events = {
  CREATE: 'create',
  JOIN: 'join',
  END: 'end',
  NEXT_ROUND: 'nextRound',
  PLAYERS_UPDATE: 'playersUpdate',
  FIND_GAME: 'findGame',
  DISCONNECT: 'disconnect',
  LEAVE_GAME: 'leaveGame',
  RECONNECT: 'reconnect',
};

export default class WebSocketManager {
  clients = new Map();

  games = new Map();

  addClient(ws, token) {
    const decodedToken = decodeToken(token);
    this.disconnectClient(ws, token);

    this.clients.set(decodedToken.email, {
      ws,
      id: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
      game: null,
      lastCompletedRound: 0,
    });
  }

  deleteClient(ws) {
    this.clients.delete(
      Object.values(this.clients).find((client) => client.ws === ws).id
    );
  }

  createGame(ws, token) {
    this.addClient(ws, token);
    const decodedToken = decodeToken(token);
    const gameID = hri.random();
    const client = this.clients.get(decodedToken.email);
    this.games.set(gameID, {
      clientIds: [decodedToken.email],
      round: 0,
      problemsPlayed: [],
    });
    client.game = gameID;
    ws.send(JSON.stringify({ method: Events.CREATE, gameID }));
    this.sendUpdatedPlayers(this.games.get(gameID));
  }

  joinGame(ws, token, gameID) {
    this.addClient(ws, token);
    const decodedToken = decodeToken(token);
    const client = this.clients.get(decodedToken.email);
    const game = this.games.get(gameID);

    // Prevent crash on game not existing
    if (!game) return;

    // Prevent clients from same email
    const clientIndex = game.clientIds.findIndex(
      (findClientId) => findClientId === client.id
    );
    if (clientIndex >= 0) {
      // Replace client if new client with same
      game.clientIds[clientIndex] = client.id;
      // TODO: Send event to front end of old client to kick them out
    } else {
      game.clientIds.push(client.id);
    }

    this.clients.get(decodedToken.email).game = gameID;
    this.sendUpdatedPlayers(game);
  }

  disconnectClient(ws, token) {
    const { email } = decodeToken(token);
    if (this.clients.has(email) && this.clients.get(email).ws !== ws) {
      this.clients.get(email).ws.send(
        JSON.stringify({
          method: Events.DISCONNECT,
          message:
            'Another user from the same email has connected, Disconnected from lobby',
        })
      );
      this.leaveGame(ws, token);
    }
  }

  reconnectToGame(ws, token) {
    const decodedToken = decodeToken(token);
    this.disconnectClient(ws, decodeToken);

    let gameID = null;
    let currentGame = null;

    this.games.forEach((game, key) => {
      if (game.clientIds.includes(decodedToken.email)) {
        gameID = key;
        currentGame = game;
      }
    });

    if (!this.clients.has(decodedToken.email) || gameID == null) {
      ws.send(
        JSON.stringify({
          method: Events.DISCONNECT,
          message: 'Not in any game, Disconnected from lobby',
        })
      );
      return;
    }

    const originalClient = this.clients.get(decodedToken.email);

    this.clients.set(decodedToken.email, {
      ws,
      id: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
      game: gameID,
      lastCompletedRound: originalClient.lastCompletedRound,
    });
    ws.send(
      JSON.stringify({
        method: Events.RECONNECT,
        problemID:
          currentGame.problemsPlayed[currentGame.problemsPlayed.length - 1],
        round: currentGame.round,
        endTime: currentGame.endTime,
      })
    );
    this.sendUpdatedPlayers(this.games.get(gameID));
  }

  endGame(gameID) {
    const game = this.games.get(gameID);
    game.clientIds.forEach((clientId) => {
      const client = this.clients.get(clientId);

      const won = client.lastCompletedRound === game.round;
      client.ws.send(JSON.stringify({ method: Events.END, endData: { won } }));
      insertMatch(gameID, clientId, won, game.problemsPlayed);
    });
  }

  async gameNextRound(gameID) {
    const game = this.games.get(gameID);

    this.removePlayersNotFinished(gameID);

    game.round += 1;

    const players = this.getPlayersDataToSend(game);

    const newProblem = await getRandomProblemId(game.problemsPlayed);

    game.problemsPlayed.push(newProblem);

    const totalTime = 15 * 60 * 1000; // 15 minutes currently

    const endTime = Date.now() + totalTime;
    setTimeout(() => {
      this.checkTimer(gameID, game.round);
    }, totalTime);
    game.endTime = endTime;

    game.clientIds.forEach((clientId) => {
      const client = this.clients.get(clientId);
      client.ws.send(
        JSON.stringify({ method: Events.PLAYERS_UPDATE, players })
      );
      client.ws.send(
        JSON.stringify({
          method: Events.NEXT_ROUND,
          round: game.round,
          problemID: newProblem,
          endTime,
        })
      );
    });
  }

  checkTimer(gameID, roundNumber) {
    const game = this.games.get(gameID);
    if (game.round === roundNumber) {
      this.removePlayersNotFinished(gameID);
    }
  }

  removePlayersNotFinished(gameID) {
    const game = this.games.get(gameID);
    // Remove players who did not finish, ignore first round
    if (game.round > 0) {
      const clientIdsThatLost = game.clientIds.filter((clientId) => {
        const client = this.clients.get(clientId);
        return client.lastCompletedRound < game.round;
      });
      clientIdsThatLost.forEach((clientId) => {
        const client = this.clients.get(clientId);
        game.clientIds = game.clientIds.filter(
          (oldClientId) => oldClientId !== client.id
        );
        client.ws.send(
          JSON.stringify({ method: Events.END, endData: { won: false } })
        );
        client.game = null;
        client.lastCompletedRound = 0;
        insertMatch(gameID, clientId, false, game.problemsPlayed);
      });
    }

    if (game.clientIds <= 1) {
      this.endGame(gameID);
    }
  }

  playerCompleteRound(token) {
    const decodedToken = decodeToken(token);
    const player = this.clients.get(decodedToken.email);
    const game = this.games.get(player.game);

    // Prevent passing this round
    if (player.lastCompletedRound < game.round) {
      player.lastCompletedRound += 1;
    }

    // Calculate number of people completed
    const numberOfCompletedPlayers = game.clientIds.filter((clientId) => {
      const client = this.clients.get(clientId);
      return client.lastCompletedRound >= game.round;
    }).length;

    const numberOfPlayersEligibleForNextRound = Math.floor(
      game.clientIds.length / 2
    );

    // Check if eligible for next round or not
    if (numberOfCompletedPlayers >= numberOfPlayersEligibleForNextRound) {
      if (numberOfPlayersEligibleForNextRound === 1) {
        this.endGame(player.game);
      } else {
        this.gameNextRound(player.game);
      }
      return;
    }

    const players = this.getPlayersDataToSend(game);

    game.clientIds.forEach((clientId) => {
      const client = this.clients.get(clientId);
      client.ws.send(
        JSON.stringify({ method: Events.PLAYERS_UPDATE, players })
      );
    });
  }

  sendUpdatedPlayers(game) {
    const players = this.getPlayersDataToSend(game);
    game.clientIds.forEach((clientId) => {
      const client = this.clients.get(clientId);
      client.ws.send(JSON.stringify({ method: Events.JOIN, players }));
    });
  }

  getPlayersDataToSend(game) {
    const players = game.clientIds.map((clientId) => {
      const client = this.clients.get(clientId);
      return {
        id: client.id,
        name: client.name,
        picture: client.picture,
        finishedCurrentRound: client.lastCompletedRound === game.round || false,
      };
    });
    return players;
  }

  findGame(ws) {
    // Find a game that hasn't started yet
    const gamesInLobby = [];
    this.games.forEach((value, key) => {
      if (value.round === 0) {
        gamesInLobby.push(key);
      }
    });

    const rand = Math.floor(Math.random() * gamesInLobby.length);

    ws.send(
      JSON.stringify({
        method: Events.FIND_GAME,
        gameID: gamesInLobby.length > 0 ? gamesInLobby[rand] : '',
      })
    );
  }

  leaveGame(ws, token) {
    const decodedToken = decodeToken(token);
    this.games.forEach((value) => {
      /* eslint-disable no-param-reassign */
      value.clientIds = value.clientIds.filter(
        (clientId) => clientId !== decodedToken.email
      );
      this.sendUpdatedPlayers(value);
    });
    const client = this.clients.get(decodedToken.email);
    client.gameID = null;
  }
}
