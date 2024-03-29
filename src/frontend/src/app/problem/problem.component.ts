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

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { LobbyService } from '../services/lobby/lobby.service';
import {
  Problem,
  ProblemsService,
} from '../services/problems/problems.service';
import { EndData } from '../types/EndData';
import { PlayerData } from '../types/PlayerData';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { interval, Subscription } from 'rxjs';
import { WebSocketService } from '../services/websocket/websocket.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubmissionResult } from '../types/SubmissionResult';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss'],
})
export class ProblemComponent implements OnInit, OnDestroy {
  problem: Problem | null = null;
  submissions: Array<SubmissionResult> = [];
  timeLeftSeconds: number = 0;
  timeLeftMinutes: number = 0;
  endTime: Date = new Date();
  playersInNextRound = 0;
  nextRoundCapacity = 0;

  players: PlayerData[] = [];
  endDataSub: Subscription | undefined;
  endTimeSub: Subscription | undefined;
  currentTimeSub: Subscription | undefined;

  warningDisplayed = false;
  WARNING_TIME_MINS = 5;

  constructor(
    private problemService: ProblemsService,
    private aRoute: ActivatedRoute,
    private router: Router,
    private lobbyService: LobbyService,
    public dialog: MatDialog,
    private ws: WebSocketService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    //Workaround to disable back button in a way
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };

    this.lobbyService.waitingRoom.subscribe((players) => {
      this.players = players;
      this.playersInNextRound = this.players.filter(
        (player) => player.finishedCurrentRound
      ).length;
      this.nextRoundCapacity = Math.floor(this.players.length / 2);
    });

    if (this.players.length === 0) {
      //From a refresh, re add client
      this.ws.reconnectToGame();
    }

    this.endDataSub = this.lobbyService.endData.subscribe((endData) => {
      if (endData) {
        this.router.navigate(['/end']);
      }
    });

    this.endTimeSub = this.lobbyService.currentEndTime.subscribe((endTime) => {
      this.endTime = endTime;
    });

    this.currentTimeSub = interval(1000).subscribe((x) =>
      this.setTimeDifference()
    );

    this.aRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id != null) {
        //Close dialogs
        this.dialog.closeAll();
        this.problemService.getProblems().subscribe((problems) => {
          for (let i = 0; i < problems.length; i++) {
            if (problems[i]._id === id) {
              this.problem = problems[i];
            }
          }
        });
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy() {
    this.endDataSub?.unsubscribe();
    this.currentTimeSub?.unsubscribe();
    this.endTimeSub?.unsubscribe();
  }

  private setTimeDifference() {
    let timeDifference = this.endTime.getTime() - new Date().getTime();
    if (timeDifference <= 0) {
      timeDifference = 0;
    }
    this.timeLeftSeconds = Math.floor((timeDifference / 1000) % 60);
    this.timeLeftMinutes = Math.floor((timeDifference / 1000 / 60) % 60);
    if (
      !this.warningDisplayed &&
      this.timeLeftMinutes < this.WARNING_TIME_MINS
    ) {
      this.warningDisplayed = true;
      this.snackBar.open(`${this.timeLeftMinutes} minutes remaining!`, '', {
        duration: 2500,
        panelClass: ['warning-snackbar'],
      });
    }
  }
}
