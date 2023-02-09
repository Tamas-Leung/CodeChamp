import { Component, Inject, Input, OnInit } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';
import { SolutionSubmitService } from '../solution-submit/solution-submit.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as prettier from 'prettier/standalone';
import * as tsParser from 'prettier/parser-babel';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LobbyService } from 'src/app/services/lobby/lobby.service';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
})
export class CodeEditorComponent implements OnInit {
  @Input() id = '';
  theme = 'vs-dark';

  codeModel: CodeModel = {
    language: 'javascript',
    uri: 'solution.js',
    value:
      "import readline from 'readline'; const stdin = readline.createInterface({ input: process.stdin, output: process.stdout, }); stdin.question('', (input) => { const x = input.split(' '); const target = parseInt(x[1]); const nums = x[0].split(',').map(Number); const map = new Map(); let result = []; for (let i = 0; i < nums.length; i++) { const current = nums[i]; const match = map.get(target - current); if (match !== undefined) { result = [i, match]; break; } map.set(current, i); } console.log(result); stdin.close(); });",
  };

  options = {
    contextmenu: true,
    minimap: {
      enabled: true,
    },
  };

  currentRound = 0;

  solution = '';
  constructor(
    private submitSolutionService: SolutionSubmitService,
    public dialog: MatDialog,
    private authService: AuthService,
    private lobbyService: LobbyService
  ) {}

  ngOnInit() {
    this.solution = this.codeModel.value;
    this.codeModel.value = prettier.format(this.codeModel.value, {
      parser: 'babel',
      plugins: [tsParser],
    });
    this.lobbyService.currentRound.subscribe(
      (round) => (this.currentRound = round)
    );
  }

  onCodeChanged(value: string) {
    this.solution = value;
  }

  submitCode() {
    const roundWhenSent = this.currentRound;
    this.submitSolutionService
      .submitSolution(
        this.id,
        this.solution,
        'mjs',
        this.authService.getToken()!
      )
      .subscribe((data) => {
        // Prevent race condition in which switches rounds but still displays this dialog
        if (roundWhenSent == this.currentRound) {
          this.dialog.open(SubmissionDialogComponent, {
            data: data,
            disableClose: data.correct,
          });
        }
      });
  }
}

export interface Result {
  correct: boolean;
  result: string;
}

@Component({
  selector: 'app-submit-dialog',
  templateUrl: 'submit-dialog.component.html',
})
export class SubmissionDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Result) {}
}
