
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
import { isValidObjectId } from 'mongoose';

import { Problems } from '../database/mongoose.js';
import judge from '../services/judge/index.js';
import judgeVerdict from '../services/judge/judge-verdict.js';
import { languageIsSupported } from '../services/judge/languages.js';

export default function Judge(webSocketManager) {
  const router = Router();

  /**
   * @swagger
   * /judge/{_id}:
   *   post:
   *     tags:
   *        - judge
   *     summary: Judges code against a problem's test cases
   *     description: Judges code against a problem's test cases
   *     parameters:
   *       - name: _id
   *         in: path
   *         description: Problem id to judge
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - code
   *               - language
   *             properties:
   *               code:
   *                 type: string
   *               language:
   *                 type: string
   *     responses:
   *       '200':
   *         description: Returns an object containing a result. If code passes all cases then All test cases passed! otherwise A test case failed.
   *       '400':
   *         description: The given id is invalid
   *       '404':
   *         description: No problem was found for the problem with the given id
   *       '500':
   *         description: Internal Failure
   *
   */
  router.post('/:_id', async (req, res) => {
    const { _id } = req.params;
    const { code, language, token } = req.body;

    if (!languageIsSupported(language)) {
      res
        .status(400)
        .send({ error: `${language} is not a supported language.` });
      return;
    }
    if (!isValidObjectId(_id)) {
      res.status(400).send({ error: `${_id} is not a valid id.` });
      return;
    }

    try {
      const problem = await Problems.findById(_id);
      if (!problem) {
        res.status(404).send({ error: `Problem ${_id} not found.` });
        return;
      }
      // eslint-disable-next-line no-restricted-syntax
      for await (const { input, output } of problem.test_cases) {
        const { verdict, additionalInfo } = await judge({
          language,
          code,
          input,
          output,
          timeLimit: problem.time_limit,
          memoryLimit: problem.memory_limit,
        });
        if (verdict !== judgeVerdict.CA) {
          res
            .status(200)
            .send({ correct: false, result: verdict, additionalInfo });
          return;
        }
      }
      webSocketManager.playerCompleteRound(token);

      res.status(200).send({ correct: true, result: 'All test cases passed!' });
    } catch (error) {
      res.status(500).send({
        error,
      });
    }
  });

  return router;
}
