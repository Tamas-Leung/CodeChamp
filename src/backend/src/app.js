import express, { json, urlencoded } from 'express';
import cors from 'cors';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import judge from './routes/judge.js';
import problems from './routes/problems.js';

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

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console, no-undef
  console.info(`App listening on port ${PORT}`);
});
