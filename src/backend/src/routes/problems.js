import { Router } from 'express';
const router = Router();
import { ProblemDifficulty, Problems, ProblemType } from "../database/mongoose.js";

/**
 * @swagger
 * /problems:
 *   post:
 *     tags: 
 *        - problems
 *     summary: Add a new problem
 *     description: Adds a new problem
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Problems'
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '500':
 *         description: Internal Failure
 * 
*/
router.post('/', async (req, res) => {
  try {
    await Problems(req.body).save();
    res.status(200).send('OK');
  } catch (e) {
    res.status(500).send({
      message: e
    });
  }
});

/**
 * @swagger
 * /problems:
 *   put:
 *     tags: 
 *        - problems
 *     summary: Update a problem
 *     description: Updates a problem by _id
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Problems'
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '500':
 *         description: Internal Failure
 * 
*/
router.put('/', async (req, res) => {
  try {
    await Problems.replaceOne({ _id: req.body._id }, req.body);
    res.status(200).send('OK');
  } catch (e) {
    res.status(500).send({
      message: e
    });
  }
});

/**
 * @swagger
 * /problems:
 *   get:
 *     tags: 
 *        - problems
 *     summary: Gets all problems
 *     description: Gets all problem
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Problems'
 *       '500':
 *         description: Internal Failure
 * 
*/
router.get('/', async (req, res) => {
  try {
    const filter = {};
    const problems = await Problems.find(filter);
    res.status(200).send(problems);
  } catch (e) {
    res.status(500).send({
      message: e
    });
  }
})

/**
 * @swagger
 * /problems/{_id}:
 *   delete:
 *     tags: 
 *        - problems
 *     summary: Deletes a problem
 *     description: Delets a problem by _id
 *     parameters:
 *       - name: _id
 *         in: path
 *         description: Id to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '500':
 *         description: Internal Failure
 * 
*/
router.delete('/:_id', async (req, res) => {
  try {
    await Problems.deleteMany({_id: req.params._id});
    res.status(200).send("OK");
  } catch (e) {
    res.status(500).send({
      message: e
    });
  }
})


export default router;
