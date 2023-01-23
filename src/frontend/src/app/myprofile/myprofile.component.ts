import { Component, OnInit } from '@angular/core';
import { PlayerData } from '../types/PlayerData';
import { Router } from '@angular/router';


@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss'],
})


export class MyProfileComponent {
  player: PlayerData;

  constructor(
    private router: Router) {
      this.player = {
        id: "a",
        name: "",
        picture: "",
        finishedCurrentRound: true,
        Wins: 10,
        Losses: 20,
        ProblemSolved: 30,
        Easy: 10,
        Medium: 10,
        Hard: 10,
      } as PlayerData
    }
  leave() {
    this.router.navigate(['/']);
  }
}
