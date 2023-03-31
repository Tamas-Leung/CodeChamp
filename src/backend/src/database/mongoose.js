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
