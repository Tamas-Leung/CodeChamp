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
import { filter, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProblemsService {
  url = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getProblems() {
    return this.http.get<Problem[]>(this.url + '/problems');
  }
}

export type TestCase = {
  input: string;
  output: string;
};

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
