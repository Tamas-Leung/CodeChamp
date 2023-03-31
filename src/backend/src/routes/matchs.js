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

import { Router } from 'express';
import { Matchs } from '../database/mongoose.js';

const router = Router();

router.get('/user/:_id', async (req, res) => {
  try {
    const filter = {
      player_id: req.params._id,
    };
    const matchs = await Matchs.find(filter)
      .sort({ _id: -1 })
      .populate({
        path: 'problems',
        model: 'problems',
        select: { name: 1, description: 1, difficulty: 1 },
      });
    res.status(200).send(matchs);
  } catch (e) {
    res.status(500).send({
      message: e,
    });
  }
});

router.get('/leaderboard/:top?', async (req, res) => {
  try {
    let top = 100;
    if (req.params.top) {
      top = Number(req.params.top);
    }
    const leaderboard = await Matchs.aggregate([
      {
        $group: {
          _id: '$player_id',
          rounds: {
            $sum: {
              $toInt: '$rounds_completed',
            },
          },
          wins: {
            $sum: {
              $toInt: '$win',
            },
          },
        },
      },
      {
        $sort: {
          wins: -1,
        },
      },
      { $limit: top },
    ]);
    res.status(200).send(leaderboard);
  } catch (e) {
    res.status(500).send({
      message: e,
    });
  }
});

export default router;
