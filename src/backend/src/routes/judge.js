import { Router } from 'express';
import { Problems } from '../database/mongoose.js';

import judge from '../services/judge/index.js';

const router = Router();

router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const { code, language } = req.body;
  try {
    const problem = await Problems.findById(id);
    if (!problem) {
      res.status(404).send({ message: `Problem ${id} not found.` });
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
        res.status(200).send('A test case failed.');
        return;
      }
    }
    res.status(200).send('All test cases passed!');
  } catch (e) {
    res.status(500).send({
      message: e,
    });
  }
});

export default router;
