import { exec } from 'child_process';
import { access, constants, mkdir } from 'fs';

import {
  setupEnvironment,
  cleanUpEnvironment,
  dockerRunCmd,
} from './docker.js';
import judgeVerdict from './judge-verdict.js';

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
              { timeout: timeLimit, killSignal: 'SIGKILL' },
              (err, _, stderr) => {
                if (stderr) {
                  cleanUpEnvironment({ codePath, dockerPath });
                  resolve({ verdict: judgeVerdict.SE });
                }
                if (err) {
                  cleanUpEnvironment({ codePath, dockerPath });
                  if (err.code === 137) {
                    resolve({ verdict: judgeVerdict.MLE });
                  }
                  resolve({ verdict: judgeVerdict.SE });
                }
              }
            );

            child.on('exit', (_, signal) => {
              if (signal === 'SIGKILL') {
                exec(`docker kill ${id}`);
                cleanUpEnvironment({ codePath, dockerPath });
                resolve({ verdict: judgeVerdict.TLE });
              }
            });

            child.stderr.on('data', (stderr) => {
              cleanUpEnvironment({ codePath, dockerPath });
              resolve({ verdict: judgeVerdict.CE, additionalInfo: stderr });
            });

            child.stdout.on('data', (stdout) => {
              cleanUpEnvironment({ codePath, dockerPath });
              resolve({
                verdict: stdout === output ? judgeVerdict.CA : judgeVerdict.WA,
              });
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
