import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';
import { SolutionSubmitService } from '../solution-submit/solution-submit.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as prettier from 'prettier/standalone';
import * as tsParser from "prettier/parser-babel";


@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
})
export class CodeEditorComponent implements OnInit {
  @Input() id = '';
  theme = 'vs-dark';

  codeModel: CodeModel = {
    language: 'typescript',
    fileType: 'js',
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
    this.submitSolutionService.submitSolution(this.id, this.solution, this.codeModel.fileType).subscribe(
      (data) => {
        this.dialog.open(SubmissionDialogComponent, {
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
  selector: 'app-submit-dialog',
  templateUrl: 'submit-dialog.component.html',
})
export class SubmissionDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {
  }
}

