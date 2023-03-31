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
