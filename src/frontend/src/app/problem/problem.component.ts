import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { LobbyService } from '../services/lobby/lobby.service';
import { ProblemsService } from '../services/problems/problems.service';
import { EndData } from '../types/EndData';
import { PlayerData } from '../types/PlayerData';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { interval, Subscription } from 'rxjs';
import { WebSocketService } from '../services/websocket/websocket.service';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss'],
})
export class ProblemComponent implements OnInit, OnDestroy {
  title: string = '';
  description: string = '';
  id: string = '';
  timeLeftSeconds: number = 0;
  timeLeftMinutes: number = 0;
  endTime: Date = new Date();

  players: PlayerData[] = [];
  endDataSub: Subscription | undefined;
  endTimeSub: Subscription | undefined;
  currentTimeSub: Subscription | undefined;

  constructor(
    private problemService: ProblemsService,
    private aRoute: ActivatedRoute,
    private router: Router,
    private lobbyService: LobbyService,
    public dialog: MatDialog,
    private ws: WebSocketService
  ) {}

  ngOnInit() {
    //Workaround to disable back button in a way
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };

    this.lobbyService.waitingRoom.subscribe((players) => {
      this.players = players;
    });

    if (this.players.length === 0) {
      //From a refresh, re add client
      this.ws.reconnectToGame();
    }

    this.endDataSub = this.lobbyService.endData.subscribe((endData) => {
      if (endData) {
        this.dialog.open(EndGameDialogComponent, {
          data: endData,
          disableClose: true,
        });
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
          for (var i = 0; i < problems.length; i++) {
            if (problems[i]._id === id) {
              this.title = problems[i].name;
              this.description = problems[i].description;
              this.id = problems[i]._id;
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
      this.currentTimeSub?.unsubscribe();
      timeDifference = 0;
    }
    this.timeLeftSeconds = Math.floor((timeDifference / 1000) % 60);
    this.timeLeftMinutes = Math.floor((timeDifference / 1000 / 60) % 60);
  }
}

@Component({
  selector: 'app-end-game-dialog',
  templateUrl: 'end-game-dialog.component.html',
})
export class EndGameDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EndGameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EndData,
    private router: Router
  ) {}

  onHomeClick() {
    this.dialogRef.close();
    this.router.navigate(['/']);
  }
}
