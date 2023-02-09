import { exec } from 'child_process';
import { access, constants, mkdir } from 'fs';

import {
  setupEnvironment,
  cleanUpEnvironment,
  dockerRunCmd,
} from './docker.js';

import { JUDGE_DIR } from './path-generator.js';

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

export default ({ language, code, input, output, timeLimit, memoryLimit }) =>
  new Promise((resolve, reject) => {
    ensureJudgeDirExists()
      .then(() => {
        setupEnvironment(code, language)
          .then(({ id, codePath, dockerPath }) => {
            const cmd = dockerRunCmd(id, id, memoryLimit);
            const child = exec(
              cmd,
              { timeout: timeLimit },
              (err, _, stderr) => {
                if (stderr) {
                  reject(stderr);
                }
                if (err) {
                  reject(err);
                }
              }
            );

            child.stdout.on('data', (stdout) => {
              cleanUpEnvironment({ codePath, dockerPath })
                .then(() => {
                  resolve(stdout === output);
                })
                .catch((err) => reject(err));
            });

            child.stdin.setEncoding('utf-8');
            // This option is helpful for debugging:
            // child.stdout.pipe(process.stdout);
            child.stdin.write(input);
            child.stdin.end();
          })
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
