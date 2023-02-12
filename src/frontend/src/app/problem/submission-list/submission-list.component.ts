import { Component, Input, OnInit } from '@angular/core';
import { SubmissionResult } from 'src/app/types/SubmissionResult';

@Component({
  selector: 'app-submission-list',
  templateUrl: './submission-list.component.html',
  styleUrls: ['./submission-list.component.scss'],
})
export class SubmissionListComponent {
  @Input()
  submissions: Array<SubmissionResult> = [];
  constructor() {}
}
