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

export enum GameEvent {
  CREATE = 'create',
  JOIN = 'join',
  END = 'end',
  NEXT_ROUND = 'nextRound',
  PLAYERS_UPDATE = 'playersUpdate',
  FIND_GAME = 'findGame',
  DISCONNECT = 'disconnect',
  LEAVE_GAME = 'leaveGame',
  RECONNECT = 'reconnect',
}

export interface CreateGameResponse {
  event: GameEvent.CREATE;
  gameID: String;
}

export interface FindGameResponse {
  event: GameEvent.FIND_GAME;
  gameID: String;
}

export interface JoinGameResponse {
  event: GameEvent.JOIN;
  players: Array<String>;
}
