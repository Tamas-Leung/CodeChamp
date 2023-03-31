
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

  public currentEndTime = new BehaviorSubject<Date>(new Date());

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

  updateEndTimer(endTime: number) {
    this.currentEndTime.next(new Date(endTime));
  }
}
