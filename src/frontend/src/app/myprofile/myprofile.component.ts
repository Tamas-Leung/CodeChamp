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

  constructor(private router: Router) {
    this.player = {
      id: 'a',
      name: '',
      picture: '',
      finishedCurrentRound: true,
      wins: 10,
      losses: 20,
      problemSolved: 30,
      easy: 10,
      medium: 10,
      hard: 10,
    } as PlayerData;
  }
  leave() {
    this.router.navigate(['/']);
  }
}
