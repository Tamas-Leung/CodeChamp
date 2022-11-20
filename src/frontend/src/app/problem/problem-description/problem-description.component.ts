import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-problem-description',
  templateUrl: './problem-description.component.html',
  styleUrls: ['./problem-description.component.scss'],
})
export class ProblemDescriptionComponent {
  @Input() title = '';
  @Input() description = '';
}
