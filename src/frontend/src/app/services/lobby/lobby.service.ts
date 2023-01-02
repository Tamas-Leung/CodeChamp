import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlayerData } from 'src/app/types';

@Injectable({
  providedIn: 'root',
})
export class LobbyService {
  public waitingRoom = new BehaviorSubject<PlayerData[]>([]);

  constructor() {}

  updateWaitingRoom(players: PlayerData[]) {
    this.waitingRoom.next(players);
  }
}
