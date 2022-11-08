import { connect, model } from 'mongoose';
import dotenv from 'dotenv';
import m2s from 'mongoose-to-swagger';
import { ProblemSchema } from './schemas/problems.js';

dotenv.config();

connect(process.env.MONGODB_URL, {});

const Problems = model('problems', ProblemSchema);

const Schemas = {
  Problems: m2s(Problems),
};

export { Problems, Schemas };
