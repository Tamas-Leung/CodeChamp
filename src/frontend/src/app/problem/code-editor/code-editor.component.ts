import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';
import { SolutionSubmitService } from '../solution-submit/solution-submit.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { format } from "prettier/standalone";
import * as prettier from 'prettier/standalone';
import * as tsParser from "prettier/parser-babel";


@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
})
export class CodeEditorComponent {
  theme = 'vs-dark';

  codeModel: CodeModel = {
    language: 'js',
    uri: 'solution.js',
    value: "import readline from 'readline'; const stdin = readline.createInterface({ input: process.stdin, output: process.stdout, }); stdin.question('', (input) => { const x = input.split(' '); const target = parseInt(x[1]); const nums = x[0].split(',').map(Number); const map = new Map(); let result = []; for (let i = 0; i < nums.length; i++) { const current = nums[i]; const match = map.get(target - current); if (match !== undefined) { result = [i, match]; break; } map.set(current, i); } console.log(result); stdin.close(); });"
  };

  options = {
    contextmenu: true,
    minimap: {
      enabled: true,
    },
  };

  solution = "";
  constructor(private submitSolutionService: SolutionSubmitService, public dialog: MatDialog) {
  }

  ngOnInit() {
    // this.codeModel.value = format(this.codeModel.value, { parser: "babel" });
    this.solution = this.codeModel.value;
    this.codeModel.value = prettier.format(this.codeModel.value, {
      parser: "babel",
      plugins: [tsParser],
    });
  }

  onCodeChanged(value: string) {
    this.solution = value;
  }

  submitCode() {
    this.submitSolutionService.submitSolution("63747e5dfffe067b61c7e67e", this.solution, this.codeModel.language).subscribe(
      (data) => {
        this.dialog.open(SubmissionDialog, {
          data: data.result
        });
      }
    );
  }
}

export interface Result {
  result: string
}


@Component({
  selector: 'submit-dialog.component',
  templateUrl: 'submit-dialog.component.html',
})
export class SubmissionDialog {

  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {
  }

  ngOnInit() {
  }
}

