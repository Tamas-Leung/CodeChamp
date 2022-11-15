import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class SolutionSubmitService {

  constructor(private http: HttpClient) {
  }

  submitSolution(id: number, code: string, language: string) {
    return this.http.post('https://localhost:4200/judge/' + String(id), { code: code, language: language });
  }

}
