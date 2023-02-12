import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SubmissionResult } from 'src/app/types/SubmissionResult';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class SolutionSubmitService {
  constructor(private http: HttpClient) {}

  submitSolution(id: string, code: string, language: string, token: string) {
    return this.http.post<SubmissionResult>(
      'http://localhost:3000/judge/' + id,
      {
        code: code,
        language: language,
        token: token,
      }
    );
  }
}
