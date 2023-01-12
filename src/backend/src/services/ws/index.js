import { hri } from 'human-readable-ids';
import { decodeToken } from '../auth/token.js';

export const Events = {
  CREATE: 'create',
  JOIN: 'join',
  END: 'end',
  NEXT_ROUND: 'nextRound',
  PLAYERS_UPDATE: 'playersUpdate',
  FIND_GAME: 'findGame',
};

export default class WebSocketManager {
  clients = {}

  games = {}

  addClient(ws, token) {
    const decodedToken = decodeToken(token);
    this.clients[decodedToken.email] = {
      ws: ws,
      id: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
      game: null,
      lastCompletedRound: 0,
    }
  }

  deleteClient(ws) {
    delete clients[Object.values(this.clients).find((client) => client.ws == ws).id]
  }

  createGame(ws, token) {
    this.addClient(ws, token);
    const decodedToken = decodeToken(token);
    const gameID = hri.random();
    const client = this.clients[decodedToken.email]
    this.games[gameID] = { clients: [client], round: 0, problemsPlayed: [] };
    client.game = gameID;
    ws.send(JSON.stringify({ method: Events.CREATE, gameID }));
    this.sendUpdatedPlayers(this.games[gameID]);
  }

  joinGame(ws, token, gameID) {
    this.addClient(ws, token);
    const decodedToken = decodeToken(token);
    const client = this.clients[decodedToken.email]
    const game = this.games[gameID];
    //Prevent clients from same email
    const clientIndex = game.clients.findIndex((findClient) => findClient.id == client.id)
    if (clientIndex >= 0) { 
      //Replace client if new client with same 
      game.clients[clientIndex] = client
      //TODO: Send event to front end of old client to kick them out
    } else {
      game.clients.push(client);
    } 
      
    this.clients[decodedToken.email].game = gameID;
    this.sendUpdatedPlayers(game);
  }

  endGame(gameID) {
    const game = this.games[gameID];
    game.clients.forEach((client) => {
      const won = client.lastCompletedRound == game.round;
      client.ws.send(JSON.stringify({ method: Events.END, endData: {won: won} }));
    });
  }

  gameNextRound(gameID) {
    const game = this.games[gameID];

    // Remove players who did not finish, ignore first round
    if (game.round > 0) {
      const clientsThatLost = game.clients.filter((client) => (
        client.lastCompletedRound < game.round
      ))
      clientsThatLost.forEach((client) => {
        game.clients = game.clients.filter((oldClient) => oldClient.id != client.id);
        client.ws.send(JSON.stringify({ method: Events.END,  endData: {won: false} }))
        client.game = null;
        client.lastCompletedRound = 0;
      })
    }
    
    game.round += 1;

    const players = this.getPlayersDataToSend(game);
    
    let newProblem = '63794a6952d8441c74627f63'

    //TEMPORARY HARDCODE TO FORCE A DIFFERENT PROBLEM ON 2nd round
    if (game.problemsPlayed.includes(newProblem)) {
      newProblem = "63747e5dfffe067b61c7e67e"
    }
    
    game.problemsPlayed.push(newProblem);

    game.clients.forEach((client) => {
      client.ws.send(JSON.stringify({ method: Events.PLAYERS_UPDATE, players }));
      client.ws.send(
        JSON.stringify({
          method: Events.NEXT_ROUND,
          round: game.round,
          problemID: newProblem,
        })
      );
    });
  }

  playerCompleteRound(token) {
    const decodedToken = decodeToken(token);
    const player = this.clients[decodedToken.email];
    const game = this.games[player.game];
  
    //Prevent passing this round
    if (player.lastCompletedRound < game.round) {
      player.lastCompletedRound += 1;
    }

    //Calculate number of people completed
    const numberOfCompletedPlayers = game.clients.filter((client) => 
      client.lastCompletedRound >= game.round
    ).length

    const numberOfPlayersEligibleForNextRound = Math.floor(game.clients.length/2)

    //Check if eligible for next round or not
    if (numberOfCompletedPlayers >= numberOfPlayersEligibleForNextRound) {
      if (numberOfPlayersEligibleForNextRound == 1){
        this.endGame(player.game)
      } else {
        this.gameNextRound(player.game)
      }
      return
    }


    const players = this.getPlayersDataToSend(game);

    game.clients.forEach((client) => {
      client.ws.send(JSON.stringify({ method: Events.PLAYERS_UPDATE, players }));
    });
  }

  sendUpdatedPlayers(game) {
    const players = this.getPlayersDataToSend(game);
    game.clients.forEach((client) => {
      client.ws.send(JSON.stringify({ method: Events.JOIN, players }));
    });
  }

  getPlayersDataToSend(game) {
    const players = game.clients.map((client) => {
      return {
        id: client.id,
        name: client.name,
        picture: client.picture,
        finishedCurrentRound: client.lastCompletedRound == game.round || false
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
}
