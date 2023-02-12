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
        const { verdict } = await judge({
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
            .send({ correct: false, result: verdict });
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
