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
