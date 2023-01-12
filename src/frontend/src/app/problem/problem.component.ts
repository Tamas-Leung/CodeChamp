import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { LobbyService } from '../services/lobby/lobby.service';
import { ProblemsService } from '../services/problems/problems.service';
import { EndData } from '../types/EndData';
import { PlayerData } from '../types/PlayerData';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss'],
})
export class ProblemComponent implements OnInit {
  title: string = '';
  description: string = '';
  id: string = '';

  players: PlayerData[] = [];
  endDataSub: Subscription | undefined;

  constructor(
    private problemService: ProblemsService,
    private aRoute: ActivatedRoute,
    private router: Router,
    private lobbyService: LobbyService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.lobbyService.waitingRoom.subscribe((players) => {
      this.players = players;
    });

    this.endDataSub = this.lobbyService.endData.subscribe((endData) => {
      if (endData) {
        this.dialog.open(EndGameDialog, {
          data: endData,
          disableClose: true
        });
      }
    })

    this.aRoute.paramMap.subscribe((params) => {
      const id = params.get('id')
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
    this.endDataSub?.unsubscribe()
}
}


@Component({
  selector: 'end-game-dialog',
  templateUrl: 'end-game-dialog.component.html',
})
export class EndGameDialog {
  constructor(
    public dialogRef: MatDialogRef<EndGameDialog>,
    @Inject(MAT_DIALOG_DATA) public data: EndData,
    private router: Router,
  ) {}

  onHomeClick() {
    this.dialogRef.close();
    this.router.navigate(['/']);
  }
}