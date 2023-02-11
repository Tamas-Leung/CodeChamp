import { Router } from 'express';
import { Matchs } from '../database/mongoose.js';

const router = Router();

router.get('/user/:_id', async (req, res) => {
  try {
    const filter = {
      player_id: req.params._id
    };
    const matchs = await Matches.find(filter);
    res.status(200).send(matchs);
  } catch (e) {
    res.status(500).send({
      message: e,
    });
  }
});

export default router;
