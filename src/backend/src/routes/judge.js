import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.send('GET /judge works');
});

export default router;
