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
