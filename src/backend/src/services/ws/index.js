import { v4 } from 'uuid';

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

  addClient(ws) {
    this.clients.set(ws, { id: v4(), game: null, lastCompletedRound: 0 });
  }

  deleteClient(ws) {
    this.clients.delete(ws);
  }

  createGame(ws) {
    const gameID = v4();
    this.games.set(gameID, { clients: [ws], round: 0 });
    this.clients.get(ws).game = gameID;
    ws.send(JSON.stringify({ method: Events.CREATE, gameID }));
    this.sendUpdatedPlayers(this.games.get(gameID));
  }

  joinGame(ws, gameID) {
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

  gameNextRound(gameID) {
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

    const players = game.clients.map((client) => this.clients.get(client)); // Player data to send
    game.clients.forEach((client) => {
      client.send(JSON.stringify({ method: Events.PLAYERS_UPDATE, players }));
    });
  }

  sendUpdatedPlayers(game) {
    const players = game.clients.map((client) => this.clients.get(client).id); // Player data to send
    game.clients.forEach((client) => {
      client.send(JSON.stringify({ method: Events.JOIN, players }));
    });
  }
}
