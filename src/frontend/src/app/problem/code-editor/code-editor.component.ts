import { Component } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
})
export class CodeEditorComponent {
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

  onCodeChanged(value: any) {
    console.log('CODE', value);
  }
}
