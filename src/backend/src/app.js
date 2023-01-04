import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import judge from './routes/judge.js';
import problems from './routes/problems.js';
import WebSocketManager, { Events } from './services/ws/index.js';
import auth from './routes/auth.js';

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

app.use('/judge', judge);
app.use('/problems', problems);
app.use('/auth', auth);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console, no-undef
  console.info(`App listening on port ${PORT}`);
});

// https://github.com/ably-labs/websockets-cursor-sharing/blob/main/api/index.js
const wss = new WebSocketServer({ port: 7070 });
const wsm = new WebSocketManager();

wss.on('connection', (ws) => {
  ws.on('message', (messageAsString) => {
    const message = JSON.parse(messageAsString);

    if (message.method === Events.CREATE) wsm.createGame(ws, message.token);
    if (message.method === Events.JOIN)
      wsm.joinGame(ws, message.token, message.gameID);
    if (message.method === Events.NEXT_ROUND)
      wsm.gameNextRound(message.token, message.gameID);
    if (message.method === Events.FIND_GAME) wsm.findGame(ws, message.token);
  });
});

wss.on('close', (ws) => {
  wsm.deleteClient(ws);
});
