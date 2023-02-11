import { Matchs } from '../../database/mongoose.js';

export const insertMatch = async (gameID, playerID, win, problemsPlayed) => {
  await Matchs({
    game_id: gameID,
    player_id: playerID,
    win,
    rounds_completed: problemsPlayed.length - win ? 0 : 1,
    problems: problemsPlayed,
  }).save();
};

export default {};
