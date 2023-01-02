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
