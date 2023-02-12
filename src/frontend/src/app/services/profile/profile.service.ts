import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  url = 'http://localhost:3000';
  id = '';
  constructor(private http: HttpClient, private authService: AuthService) {
    this.id = authService.getPlayerData().id;
  }

  getUserStats() {
    return this.http.get<Stats[]>(this.url + '/matchs/user/' + this.id);
  }
}

export interface Stats {
  game_id: string;
  player_id: string;
  win: Boolean;
  rounds_completed: Number;
  problems: string[];
}
