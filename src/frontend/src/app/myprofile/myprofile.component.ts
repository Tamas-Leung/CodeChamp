import { Component, OnInit } from '@angular/core';
import { PlayerData } from '../types/PlayerData';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Stats, ProfileService } from '../services/profile/profile.service';
import { ProblemsService } from '../services/problems/problems.service';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss'],
})
export class MyProfileComponent {
  player: PlayerData;
  userStats: Stats[] | undefined;
  constructor(
    private router: Router,
    private authService: AuthService,
    private profileService: ProfileService,
    private problemService: ProblemsService
  ) {
    this.player = {
      id: 'a',
      name: '',
      picture: '',
      finishedCurrentRound: true,
      wins: 0,
      losses: 0,
      problemSolved: 0,
    } as PlayerData;
    const playerStats = authService.getPlayerData();
    this.player.picture = playerStats.picture;
    this.player.name = playerStats.name;
  }
  ngOnInit(): void {
    this.profileService.getUserStats().subscribe((res) => {
      this.userStats = res;
      let won = 0;
      let problemSolved = 0;
      this.userStats.forEach((element) => {
        if (element.win) {
          won++;
        }
        problemSolved += element.problems.length;
      });
      const tempPlayerStats = this.player;
      tempPlayerStats.wins = won;
      tempPlayerStats.losses = this.userStats.length - won;
      tempPlayerStats.problemSolved = problemSolved;
      this.player = tempPlayerStats;
    });
  }
  leave() {
    this.router.navigate(['/']);
  }
}
