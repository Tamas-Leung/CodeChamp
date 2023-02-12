import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProblemsService {
  url = 'http://localhost:3000';
  constructor(private http: HttpClient) { }

  getProblems() {
    return this.http.get<Problem[]>(this.url + '/problems');
  }
}

export type TestCase = {
  input: string;
  output: string;
}

export interface Problem {
  test_cases: Array<TestCase>;
  description: string;
  difficulty: string;
  memory_limit: Number;
  time_limit: Number;
  name: string;
  problem_type: string[];
  _id: string;
}
