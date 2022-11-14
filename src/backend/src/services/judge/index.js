import { exec } from 'child_process';
import { writeFile, unlink, access, constants, mkdir } from 'fs';

import {
  JUDGE_DIR,
  generateCommand,
  generatePath,
} from './language-generators.js';

const ensureJudgeDirExists = () =>
  new Promise((resolve, reject) => {
    access(JUDGE_DIR, constants.F_OK, (accessFailed) => {
      if (accessFailed) {
        mkdir(JUDGE_DIR, (err) => {
          if (err) {
            reject(err);
          }
          resolve();
        });
      }
      resolve();
    });
  });

export default ({ language, code, input, output, timeout }) =>
  new Promise((resolve, reject) => {
    ensureJudgeDirExists()
      .then(() => {
        const codePath = generatePath(language);
        writeFile(codePath, code, (err) => {
          if (err) {
            reject(err);
          }
        });

        const cmd = generateCommand(language, codePath);
        if (!cmd) {
          reject(new Error(`Unsupported Language: ${language}`));
        }

        const child = exec(cmd, { timeout }, (err, stdout, stderr) => {
          if (stderr) {
            reject(stderr);
          }
          if (err) {
            reject(err);
          }
          if (stdout) {
            resolve(stdout === output);
          }
        });

        child.stdout.on('data', (stdout) => {
          unlink(codePath, (err) => {
            reject(err);
          });
          resolve(stdout === output);
        });

        child.stdin.setEncoding('utf-8');
        // This option is helpful for debugging:
        // child.stdout.pipe(process.stdout);
        child.stdin.write(input);
        child.stdin.end();
      })
      .catch((err) => reject(err));
  });
