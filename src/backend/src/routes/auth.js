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
import { decodeToken } from '../services/auth/token.js';

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *        - auth
 *     summary: Login into service
 *     description: Adds user to database if it doesn't exist
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '500':
 *         description: Internal Failure
 *
 */
router.post('/login', async (req, res) => {
  try {
    const decodedToken = decodeToken(req.body.token);

    res.status(200).send({
      token: decodedToken,
    });
  } catch (e) {
    res.status(500).send({
      message: e,
    });
  }
});

export default router;
