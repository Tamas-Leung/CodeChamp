
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
