export const Events = {
  CREATE: 'create',
  JOIN: 'join',
};

export default class WebSocketManager {
  clients = new Map();
  games = new Map();

  addClient(ws, metadata) {
    this.clients.set(ws, metadata);
  }

  createGame(ws) {
    const gameID = this.uuidv4();
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

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}
