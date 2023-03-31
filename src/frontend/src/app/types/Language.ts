/*
 * CodeChamp Copyright (C) 2023 Tamas Leung, Anton Kanugalawattage, Zhiming Zhao, Youssef Rizkalla, Dipendra Subedi
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
