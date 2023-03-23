import * as prettier from 'prettier/standalone';
import * as tsParser from 'prettier/parser-babel';

export interface Language {
  displayName: string;
  extension: string;
  templateCode: string;
  format(code: string): string;
}

const javaScript: Language = {
  displayName: 'JavaScript',
  extension: 'mjs',
  templateCode:
    "import readline from 'readline'; const stdin = readline.createInterface({ input: process.stdin, output: process.stdout, }); stdin.question('', (input) => { console.log(\"Your answer here...\"); stdin.close(); });",
  format: (code) =>
    prettier.format(code, {
      parser: 'babel',
      plugins: [tsParser],
    }),
};

const python: Language = {
  displayName: 'Python',
  extension: 'py',
  templateCode: `inp = input()
print('Your answer here...')`,
  format: (code) => code,
};

export const languages = { javaScript, python };
