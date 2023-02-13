import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SubmissionResult } from 'src/app/types/SubmissionResult';
import { environment } from 'src/environments/environment';

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
  url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  submitSolution(id: string, code: string, language: string, token: string) {
    return this.http.post<SubmissionResult>(this.url + '/judge/' + id, {
      code: code,
      language: language,
      token: token,
    });
  }
}
