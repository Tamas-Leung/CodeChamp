import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface Leaderboard {
  name: string;
  number: number;
  wins: number;
  losses: number;
}


const ELEMENT_DATA: Leaderboard[] = [
  {number: 1, name: 'Player4', wins: 51, losses: 5},
  {number: 2, name: 'Player3', wins: 49, losses: 4},
  {number: 3, name: 'Player1', wins: 37, losses: 3},
  {number: 4, name: 'Player2', wins: 24, losses: 2},
  {number: 5, name: 'Player5', wins: 23, losses: 2},
  {number: 1, name: 'Player11', wins: 21, losses: 3},
  {number: 2, name: 'Player14', wins: 19, losses: 2},
  {number: 3, name: 'Player7', wins: 17, losses: 2},
  {number: 4, name: 'Player9', wins: 14, losses: 2},
  {number: 5, name: 'Player10', wins: 13, losses: 1},
];


@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  displayedColumns: string[] = ['number', 'name', 'wins', 'losses'];
  dataSource = ELEMENT_DATA;
  constructor(
    private router: Router,
    ) {}

  ngOnInit(): void {
  }


  leave() {
    this.router.navigate(['/']);
  }

}
