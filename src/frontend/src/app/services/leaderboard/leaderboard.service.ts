import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LeaderboardService {
  url = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  getLeaderboard(top = 100) {
    return this.http.get<Leader[]>(`${this.url}/leaderboard/${top}`);
  }
}

export interface Leader {
  id: string;
  wins: Number;
  rounds: Number;
}
