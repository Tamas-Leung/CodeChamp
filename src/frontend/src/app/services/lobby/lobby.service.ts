import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { EndData } from 'src/app/types/EndData';
import { PlayerData } from 'src/app/types/PlayerData';

@Injectable({
  providedIn: 'root',
})
export class LobbyService {
  public waitingRoom = new BehaviorSubject<PlayerData[]>([]);

  public endData = new BehaviorSubject<EndData | undefined>(undefined);

  public currentRound = new BehaviorSubject<number>(0);

  constructor() {}

  updateWaitingRoom(players: PlayerData[]) {
    this.waitingRoom.next(players);
  }

  updateEndData(endData: EndData | undefined) {
    this.endData.next(endData);
  }

  updateCurrentRound(round: number) {
    this.currentRound.next(round);
  }
}
