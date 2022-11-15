import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';
import { SolutionSubmitService } from '../solution-submit/solution-submit.service';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
})
export class CodeEditorComponent {

  constructor(private submitSolutionService: SolutionSubmitService) {

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
    this.submitSolutionService.submitSolution(this.solution, this.codeModel.language);
  }
}

