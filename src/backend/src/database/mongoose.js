import { connect, model } from 'mongoose';
import dotenv from 'dotenv';
import m2s from 'mongoose-to-swagger';
import { ProblemSchema } from './schemas/problems.js';
import { MatchSchema } from './schemas/matchs.js';

dotenv.config();

connect(process.env.MONGODB_URL, {});

const Problems = model('problems', ProblemSchema);
const Matchs = model('matchs', MatchSchema);

const Schemas = {
  Problems: m2s(Problems),
  Matchs: m2s(Matchs),
};

export { Problems, Schemas, Matchs };
