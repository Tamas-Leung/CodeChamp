
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
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient, private router: Router) {}

  logout = () => {
    localStorage.removeItem('token');
    location.reload();
  };

  login(credentials: string): Observable<any> {
    return this.httpClient.post(this.url + '/auth/login', {
      token: credentials,
    });
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') ? true : false;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getPlayerData(): any {
    return JSON.parse(atob(localStorage.getItem('token')!.split('.')[1]));
  }
}
