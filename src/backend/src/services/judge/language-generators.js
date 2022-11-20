import { v4 } from 'uuid';
import path from 'path';

export const JUDGE_DIR = 'temp-judge';
const FILE_START = 'TEMP-CODE-';
const PATH_START = path.join(JUDGE_DIR, FILE_START);

const commands = Object.freeze({
  js: `node `,
});

export const generatePath =

  (language) => `${PATH_START + v4()}.${language}`;

export const generateCommand = (language, filePath) =>
  commands[language] + filePath;
