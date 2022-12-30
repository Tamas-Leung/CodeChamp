import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LobbyService {
  public waitingRoom = new BehaviorSubject<string[]>([]);

  constructor() {}

  updateWaitingRoom(players: string[]) {
    this.waitingRoom.next(players);
  }
}
