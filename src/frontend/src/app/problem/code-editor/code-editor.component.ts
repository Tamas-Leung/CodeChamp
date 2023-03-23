import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';
import { SolutionSubmitService } from '../solution-submit/solution-submit.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LobbyService } from 'src/app/services/lobby/lobby.service';
import { SubmissionResult } from 'src/app/types/SubmissionResult';
import { Language, languages } from 'src/app/types/Language';
import { MatSelectChange } from '@angular/material/select';

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

  dropdownLanguages = Object.values(languages);
  selectedLanguage: Language = languages.javaScript;

  codeModel: CodeModel = {
    language: this.selectedLanguage.displayName.toLowerCase(),
    uri: 'solution.js',
    value: this.selectedLanguage.templateCode,
  };

  options = {
    contextmenu: true,
    minimap: {
      enabled: true,
    },
  };

  solutions: Map<string, string> = new Map();
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
    this.codeModel.value = this.selectedLanguage.format(
      this.selectedLanguage.templateCode
    );
    this.solutions.set(this.selectedLanguage.extension, this.codeModel.value);
    this.lobbyService.currentRound.subscribe(
      (round) => (this.submissionResult = null)
    );
  }

  onCodeChanged(value: string) {
    this.solutions.set(this.selectedLanguage.extension, value);
  }

  onLanguageChanged(change: MatSelectChange) {
    const newLanguage = change.value as Language;
    if (!this.solutions.has(newLanguage.extension)) {
      this.solutions.set(newLanguage.extension, newLanguage.templateCode);
    }
    this.codeModel = {
      language: this.selectedLanguage.displayName.toLowerCase(),
      uri: `solution.${this.selectedLanguage.extension}`,
      value: this.selectedLanguage.format(
        this.solutions.get(this.selectedLanguage.extension)!
      ),
    };
  }

  submitCode() {
    this.submissionPending = true;
    const code = this.solutions.get(this.selectedLanguage.extension)!;

    this.submitSolutionService
      .submitSolution(
        this.id,
        code,
        this.selectedLanguage.extension,
        this.authService.getToken()!
      )
      .subscribe((data) => {
        this.submissionPending = false;
        this.submissionResult = {
          correct: data.correct,
          result: data.result,
          additionalInfo: data.additionalInfo,
          code,
          language: this.selectedLanguage.displayName,
          submittedAt: new Date(),
        };
        this.newSubmissionResult.emit(this.submissionResult);
      });
  }
}
