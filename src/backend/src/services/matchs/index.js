
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
