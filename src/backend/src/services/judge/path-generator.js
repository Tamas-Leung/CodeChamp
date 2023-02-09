import { v4 } from 'uuid';
import path from 'path';

export const JUDGE_DIR = 'temp-judge';
const FILE_START = 'TEMP-CODE-';
const PATH_START = path.join(JUDGE_DIR, FILE_START);

export const generatePath = (language) => {
  const id = v4();
  return {
    id,
    codePath: `${PATH_START + id}.${language}`,
    dockerPath: `${PATH_START + id}.Dockerfile`,
  };
};
