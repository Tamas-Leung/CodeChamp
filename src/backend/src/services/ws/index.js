import { v4 } from 'uuid';
import { decodeToken } from '../auth/token.js';

export const Events = {
  CREATE: 'create',
  JOIN: 'join',
  END: 'end',
  NEXT_ROUND: 'nextRound',
  PLAYERS_UPDATE: 'playersUpdate',
};

export default class WebSocketManager {
  clients = new Map();

  games = new Map();

  addClient(ws, token) {
    const decodedToken = decodeToken(token)
    this.clients.set(ws, { id: decodedToken.email, name: decodedToken.name, picture: decodedToken.picture, game: null, lastCompletedRound: 0 });
  }

  deleteClient(ws) {
    this.clients.delete(ws);
  }

  createGame(ws, token) {
    this.addClient(ws, token)
    const gameID = v4();
    this.games.set(gameID, { clients: [ws], round: 0 });
    this.clients.get(ws).game = gameID;
    ws.send(JSON.stringify({ method: Events.CREATE, gameID }));
    this.sendUpdatedPlayers(this.games.get(gameID));
  }

  joinGame(ws, token, gameID) {
    this.addClient(ws, token)
    const game = this.games.get(gameID);
    game.clients.push(ws);
    this.clients.get(ws).game = gameID;
    this.sendUpdatedPlayers(game);
  }

  endGame(gameID) {
    const game = this.games.get(gameID);
    game.clients.forEach((client) => {
      client.send(JSON.stringify({ method: Events.END }));
    });
  }

  gameNextRound(token, gameID) {
    const game = this.games.get(gameID);
    game.round += 1;

    game.clients.forEach((client) => {
      client.send(
        JSON.stringify({
          method: Events.NEXT_ROUND,
          round: game.round,
          problemID: '63794a6952d8441c74627f63', // hard coded for now
        })
      );
    });
  }

  playerCompleteRound(ws) {
    const player = this.clients.get(ws);
    const game = this.games.get(player.game);
    player.lastCompletedRound += 1;

    const players = this.getPlayersDataToSend(game);
    game.clients.forEach((client) => {
      client.send(JSON.stringify({ method: Events.PLAYERS_UPDATE, players }));
    });
  }

  sendUpdatedPlayers(game) {
    const players = this.getPlayersDataToSend(game);
    game.clients.forEach((client) => {
      client.send(JSON.stringify({ method: Events.JOIN, players }));
    });
  }

  getPlayersDataToSend(game) {
    const players = game.clients.map((client_id) => {
      const client = this.clients.get(client_id);
      return {
        id: client.id,
        name: client.name,
        picture: client.picture
      }
    });
    return players
  }
}

const getTokenFromSocket = (ws) => {
  return url.parse(request.url, true).query.token
}