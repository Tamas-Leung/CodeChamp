import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LeaderboardService {
  url = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getLeaderboard(top = 100) {
    return this.http.get<Leader[]>(`${this.url}/matchs/leaderboard/${top}`);
  }
}

export interface Leader {
  _id: string;
  wins: Number;
  rounds: Number;
}
