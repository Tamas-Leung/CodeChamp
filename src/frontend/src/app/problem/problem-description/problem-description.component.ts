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

import { Component, Input } from '@angular/core';
import { Problem } from 'src/app/services/problems/problems.service';

@Component({
  selector: 'app-problem-description',
  templateUrl: './problem-description.component.html',
  styleUrls: ['./problem-description.component.scss'],
})
export class ProblemDescriptionComponent {
  @Input()
  problem!: Problem;
  get timeLimitSeconds() {
    return Math.floor(this.problem.time_limit.valueOf() / 1000);
  }
  get chipColor() {
    return this.problem.difficulty === 'Easy'
      ? 'success'
      : this.problem.difficulty === 'Medium'
      ? 'orange'
      : 'warn';
  }
}
