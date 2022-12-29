export const Events = {
  CREATE: 'create',
  JOIN: 'join',
};

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default class WebSocketManager {
  clients = new Map();

  games = new Map();

  addClient(ws, metadata) {
    this.clients.set(ws, metadata);
  }

  deleteClient(ws) {
    this.clients.delete(ws);
  }

  createGame(ws) {
    const gameID = uuidv4();
    this.games.set(gameID, { clients: [ws] });
    ws.send(JSON.stringify({ method: Events.CREATE, gameID }));
  }

  joinGame(ws, gameID) {
    const game = this.games.get(gameID);
    game.clients.push(ws);

    const players = game.clients.map((client) => this.clients.get(client).id); // Player data to send
    game.clients.forEach((client) => {
      client.send(JSON.stringify({ method: Events.JOIN, players }));
    });
  }
}
