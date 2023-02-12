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
  get chipColor() {
    return this.problem.difficulty === 'Easy'
      ? 'success'
      : this.problem.difficulty === 'Medium'
      ? 'orange'
      : 'warn';
  }
}
