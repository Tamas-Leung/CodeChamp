import { Router } from 'express';
const router = Router();
import { ProblemDifficulty, Problems, ProblemType } from "../database/mongoose.js";

router.get('/', (_req, res) => {
  res.send('GET /problems works');
});

router.get('/add', async (_req, res) => {
  try {
    let newProblem = new Problems(
      {
        name: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\nYou can return the answer in any order.",
        time_limit: 10,
        memory_limit: 10,
        test_cases: [
          {
            input: "[2,7,11,15], 9",
            output: "[0,1]"
          }
        ],
        difficulty: ProblemDifficulty.Easy,
        problem_type: [
          ProblemType.ArrayAndHashing
        ]
      }
    )
    await newProblem.save();
    res.status(200).send('OK');
  } catch (e) {
    console.log(e)
    res.sendStatus(500)
  }

});

export default router;
