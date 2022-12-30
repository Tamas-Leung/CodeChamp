export enum GameEvent {
  CREATE = 'create',
  JOIN = 'join',
  END = 'end',
  NEXT_ROUND = 'nextRound',
  PLAYERS_UPDATE = 'playersUpdate',
}

export interface CreateGameResponse {
  event: GameEvent.CREATE;
  gameID: String;
}

export interface JoinGameResponse {
  event: GameEvent.JOIN;
  players: Array<String>;
}
