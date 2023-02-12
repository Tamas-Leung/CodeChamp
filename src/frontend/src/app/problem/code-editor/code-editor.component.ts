import { Component, Inject, Input, OnInit } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';
import { SolutionSubmitService } from '../solution-submit/solution-submit.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as prettier from 'prettier/standalone';
import * as tsParser from 'prettier/parser-babel';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LobbyService } from 'src/app/services/lobby/lobby.service';
import { EndData } from 'src/app/types/EndData';

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
      "import readline from 'readline'; const stdin = readline.createInterface({ input: process.stdin, output: process.stdout, }); stdin.question('', (input) => { console.log(\"Your answer here...\"); stdin.close(); });",
  };

  options = {
    contextmenu: true,
    minimap: {
      enabled: true,
    },
  };

  currentRound = 0;
  submissionPending = false;
  endData: EndData | undefined = undefined;
  solution = '';
  submissionResult = '';

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
    this.lobbyService.endData.subscribe((endData) => (this.endData = endData));
  }

  onCodeChanged(value: string) {
    this.solution = value;
  }

  submitCode() {
    const roundWhenSent = this.currentRound;
    this.submissionPending = true;
    this.submitSolutionService
      .submitSolution(
        this.id,
        this.solution,
        'mjs',
        this.authService.getToken()!
      )
      .subscribe((data) => {
        this.submissionPending = false;
        this.submissionResult = data.result;
        // Prevent race condition in which switches rounds but still displays this dialog
        if (roundWhenSent == this.currentRound && !this.endData) {
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
