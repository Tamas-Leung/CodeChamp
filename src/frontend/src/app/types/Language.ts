import { CodeModel } from '@ngstack/code-editor';
import * as prettier from 'prettier/standalone';
import * as tsParser from 'prettier/parser-babel';
export interface Language {
  displayName: string;
  extension: string;
  templateCode: string;
  // The displayed code will not be reset unless it's completely re-assigned.
  // So we need to reset the value after formatting by stringifying and parsing the object.
  // https://github.com/ngstack/code-editor/issues/1030
  format(codeModel: CodeModel): CodeModel;
}

const javaScript: Language = {
  displayName: 'JavaScript',
  extension: 'mjs',
  templateCode:
    "import readline from 'readline'; const stdin = readline.createInterface({ input: process.stdin, output: process.stdout, }); stdin.question('', (input) => { console.log(\"Your answer here...\"); stdin.close(); });",
  format: (codeModel) => {
    codeModel.value = prettier.format(codeModel.value, {
      parser: 'babel',
      plugins: [tsParser],
    });
    return JSON.parse(JSON.stringify(codeModel));
  },
};

const python: Language = {
  displayName: 'Python',
  extension: 'py',
  templateCode: `inp = input()
print('Your answer here...')`,
  format: (codeModel) => JSON.parse(JSON.stringify(codeModel)),
};

export const languages = { javaScript, python };
