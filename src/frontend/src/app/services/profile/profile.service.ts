import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  url = environment.apiUrl;
  id = '';
  constructor(private http: HttpClient, private authService: AuthService) {
    this.id = authService.getPlayerData().email;
  }

  getUserStats() {
    return this.http.get<Stats[]>(this.url + '/matchs/user/' + this.id);
  }
}

interface ProblemInStats {
  _id: string;
  name: string;
  description: string;
  difficulty: string;
}

export interface Stats {
  game_id: string;
  player_id: string;
  win: Boolean;
  rounds_completed: Number;
  problems: ProblemInStats[];
}
