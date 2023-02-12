import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Leader,
  LeaderboardService,
} from '../services/leaderboard/leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
  displayedColumns: string[] = ['number', 'name', 'wins', 'losses'];
  leaderboard: Leader[] = [];

  constructor(
    private router: Router,
    private leaderboardService: LeaderboardService
  ) {}

  ngOnInit(): void {
    this.leaderboardService
      .getLeaderboard()
      .subscribe((data) => (this.leaderboard = data));
  }

  leave() {
    this.router.navigate(['/']);
  }
}
