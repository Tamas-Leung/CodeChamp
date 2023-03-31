/*
 * CodeChamp Copyright (C) 2023 Tamas Leung, Anton Kanugalawattage, Zhiming Zhao, Youssef Rizkalla, Dipendra Subedi
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import judge from './routes/judge.js';
import problems from './routes/problems.js';
import WebSocketManager, { Events } from './services/ws/index.js';
import auth from './routes/auth.js';
import matchs from './routes/matchs.js';

import { Schemas } from './database/mongoose.js';

const options = {
  // failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Code Champ API',
      version: '1.0.0',
      description: 'REST API for Code Champ',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'problems',
      },
      {
        name: 'auth',
      },
      {
        name: 'judge',
      },
    ],
    components: {
      schemas: Schemas,
    },
  },
  apis: ['./src/routes/*.js'],
};

const openapiSpecification = swaggerJsdoc(options);

const app = express();
app.use(
  cors({
    origin: '*',
  })
);
const PORT = 3000;

app.use(json()); // http://expressjs.com/en/api.html#express.json
app.use(urlencoded({ extended: false })); // http://expressjs.com/en/5x/api.html#express.urlencoded

// https://github.com/ably-labs/websockets-cursor-sharing/blob/main/api/index.js
const wss = new WebSocketServer({ port: 7070 });
const wsm = new WebSocketManager();

app.use('/judge', judge(wsm));
app.use('/problems', problems);
app.use('/auth', auth);
app.use('/matchs', matchs);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console, no-undef
  console.info(`App listening on port ${PORT}`);
});

wss.on('connection', (ws) => {
  ws.on('message', (messageAsString) => {
    const message = JSON.parse(messageAsString);

    if (message.method === Events.CREATE) wsm.createGame(ws, message.token);
    if (message.method === Events.JOIN)
      wsm.joinGame(ws, message.token, message.gameID);
    if (message.method === Events.NEXT_ROUND) wsm.gameNextRound(message.gameID);
    if (message.method === Events.FIND_GAME) wsm.findGame(ws);
    if (message.method === Events.LEAVE_GAME) wsm.leaveGame(ws, message.token);
    if (message.method === Events.RECONNECT)
      wsm.reconnectToGame(ws, message.token);
  });
});

wss.on('close', (ws) => {
  wsm.deleteClient(ws);
});
