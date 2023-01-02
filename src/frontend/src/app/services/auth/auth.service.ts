import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient, private router: Router) {}

  logout = () => {
    localStorage.removeItem('token');
    location.reload();
  };

  login(credentials: string): Observable<any> {
    return this.httpClient.post('http://localhost:3000/auth/login', {
      token: credentials,
    });
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') ? true : false;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
