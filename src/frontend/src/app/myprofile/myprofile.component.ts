import { Component, OnInit } from '@angular/core';
import { PlayerData } from '../types/PlayerData';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss'],
})
export class MyProfileComponent {
  player: PlayerData;
  playerStats: any;

  constructor(private router: Router, private authService: AuthService) {
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
    this.playerStats = authService.getPlayerData();
    this.player.picture = this.playerStats.picture;
    this.player.name = this.playerStats.name;
  }
  leave() {
    this.router.navigate(['/']);
  }
}
