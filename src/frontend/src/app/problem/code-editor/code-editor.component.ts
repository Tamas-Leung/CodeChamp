import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';
import { SolutionSubmitService } from '../solution-submit/solution-submit.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
})
export class CodeEditorComponent {

  constructor(private submitSolutionService: SolutionSubmitService, public dialog: MatDialog) {
  }

  theme = 'vs-dark';

  codeModel: CodeModel = {
    language: 'typescript',
    uri: 'solution.ts',
    value: [`export class MyClass {`, `  constructor() {`, '', '  }', `}`].join(
      '\n'
    ),
  };

  options = {
    contextmenu: true,
    minimap: {
      enabled: true,
    },
  };


  solution = "";
  onCodeChanged(value: string) {
    this.solution = value;
  }

  submitCode() {
    this.dialog.open(SubmissionDialog, {
      data: this.submitSolutionService.submitSolution(this.solution, this.codeModel.language)
    });
  }
}

@Component({
  selector: 'submit-dialog.component',
  templateUrl: 'submit-dialog.component.html',
})
export class SubmissionDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Observable<any>) { }

  ngOnInit() {
    console.log(this.data)
  }
}

