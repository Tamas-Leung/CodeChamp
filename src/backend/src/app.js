import express, { json, urlencoded } from 'express';

import judge from './routes/judge.js';
import problems from './routes/problems.js';


const app = express();
const PORT = 3000;

app.use(json()); // http://expressjs.com/en/api.html#express.json
app.use(urlencoded({ extended: false })); // http://expressjs.com/en/5x/api.html#express.urlencoded

app.use('/judge', judge);
app.use('/problems', problems);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console, no-undef
  console.info(`App listening on port ${PORT}`);
});
