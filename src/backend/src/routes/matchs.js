import { Router } from 'express';
import { Matchs } from '../database/mongoose.js';

const router = Router();

router.get('/user/:_id', async (req, res) => {
  try {
    const filter = {
      player_id: req.params._id,
    };
    const matchs = await Matchs.find(filter).populate({
      path: 'problems',
      model: 'problems',
      select: { name: 1, description: 1, difficulty: 1 },
    });
    res.status(200).send(matchs);
  } catch (e) {
    res.status(500).send({
      message: e,
    });
  }
});

router.get('/leaderboard/:top?', async (req, res) => {
  try {
    let top = 100;
    if (req.params.top) {
      top = Number(req.params.top);
    }
    const leaderboard = await Matchs.aggregate([
      {
        $group: {
          _id: '$player_id',
          rounds: {
            $sum: {
              $toInt: '$rounds_completed',
            },
          },
          wins: {
            $sum: {
              $toInt: '$win',
            },
          },
        },
      },
      {
        $sort: {
          wins: -1,
        },
      },
      { $limit: top },
    ]);
    res.status(200).send(leaderboard);
  } catch (e) {
    res.status(500).send({
      message: e,
    });
  }
});

export default router;
