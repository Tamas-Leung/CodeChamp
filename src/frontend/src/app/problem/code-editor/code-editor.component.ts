import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';
import { SolutionSubmitService } from '../solution-submit/solution-submit.service';
import * as prettier from 'prettier/standalone';
import * as tsParser from 'prettier/parser-babel';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LobbyService } from 'src/app/services/lobby/lobby.service';
import { SubmissionResult } from 'src/app/types/SubmissionResult';
import { Language, languages } from 'src/app/types/Language';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
})
export class CodeEditorComponent implements OnInit {
  @Input() id = '';
  @Output() newSubmissionResult: EventEmitter<SubmissionResult> =
    new EventEmitter();
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

  language: Language = languages.javaScript;
  solution = '';
  submissionPending = false;
  submissionResult: SubmissionResult | null = null;

  get submissionColor() {
    return this.submissionResult?.correct ? 'success-text' : 'wrong-text';
  }

  constructor(
    private submitSolutionService: SolutionSubmitService,
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
      (round) => (this.submissionResult = null)
    );
  }

  onCodeChanged(value: string) {
    this.solution = value;
  }

  submitCode() {
    this.submissionPending = true;
    const code = this.solution;

    this.submitSolutionService
      .submitSolution(this.id, code, this.language.extension, this.authService.getToken()!)
      .subscribe((data) => {
        this.submissionPending = false;
        this.submissionResult = {
          correct: data.correct,
          result: data.result,
          additionalInfo: data.additionalInfo,
          code,
          language: this.language.displayName,
          submittedAt: new Date(),
        };
        this.newSubmissionResult.emit(this.submissionResult);
      });
  }
}
