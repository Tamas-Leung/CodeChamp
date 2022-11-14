import { Router } from 'express';
import { isValidObjectId } from 'mongoose';

import { Problems } from '../database/mongoose.js';
import judge from '../services/judge/index.js';

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
  const { code, language } = req.body;

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
      const judgeResult = await judge({
        language,
        code,
        input,
        output,
        timeout: problem.time_limit,
      });
      if (!judgeResult) {
        res.status(200).send({ result: 'A test case failed.' });
        return;
      }
    }
    res.status(200).send({ result: 'All test cases passed!' });
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
});

export default router;
