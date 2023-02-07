export enum GameEvent {
  CREATE = 'create',
  JOIN = 'join',
  END = 'end',
  NEXT_ROUND = 'nextRound',
  PLAYERS_UPDATE = 'playersUpdate',
  FIND_GAME = 'findGame',
  DISCONNECT = 'disconnect',
  LEAVE_GAME = 'leaveGame',
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
