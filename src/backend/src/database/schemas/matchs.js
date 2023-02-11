import { Schema } from 'mongoose';

const MatchSchema = new Schema({
  game_id: {
    type: String,
    required: true,
  },
  player_id: {
    type: String,
    required: true,
  },
  win: {
    type: Boolean,
    required: true,
  },
  rounds_completed: {
    type: Number,
    required: true,
  },
  problems: {
    type: [
      {
        type: String,
      },
    ],
    required: true,
  },
});

export { MatchSchema };
export default {};
