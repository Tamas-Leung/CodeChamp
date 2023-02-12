import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { SubmissionResult } from 'src/app/types/SubmissionResult';
import * as prettier from 'prettier/standalone';
import * as tsParser from 'prettier/parser-babel';
@Component({
  selector: 'app-submission-list',
  templateUrl: './submission-list.component.html',
  styleUrls: ['./submission-list.component.scss'],
})
export class SubmissionListComponent {
  @Input()
  submissions: Array<SubmissionResult> = [];

  getSubmissionColor(submissionResult: SubmissionResult) {
    return submissionResult.correct ? 'success-text' : 'wrong-text';
  }

  getFormattedCode(submissionResult: SubmissionResult) {
    console.log(
      prettier.format(submissionResult.code, {
        parser: 'babel',
        plugins: [tsParser],
      })
    );
    return prettier.format(submissionResult.code, {
      parser: 'babel',
      plugins: [tsParser],
    });
  }

  constructor() {}
}
