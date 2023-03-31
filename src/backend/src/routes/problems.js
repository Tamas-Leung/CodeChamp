
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
import { Problems } from '../database/mongoose.js';

const router = Router();

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
      message: e,
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
      message: e,
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
      message: e,
    });
  }
});

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
    await Problems.deleteMany({ _id: req.params._id });
    res.status(200).send('OK');
  } catch (e) {
    res.status(500).send({
      message: e,
    });
  }
});

export default router;
