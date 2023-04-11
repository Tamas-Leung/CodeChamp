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

import { exec } from 'child_process';
import { access, constants, mkdir } from 'fs';

import {
  setupEnvironment,
  cleanUpEnvironment,
  dockerRunCmd,
} from './docker.js';
import judgeVerdict from './judge-verdict.js';

import { JUDGE_DIR } from './path-generator.js';

const KILL_SIGNAL_CODE = 'SIGKILL';
const DOCKER_MLE_CODE = 137;

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
              { timeout: timeLimit, killSignal: KILL_SIGNAL_CODE },
              (err, _, stderr) => {
                if (stderr) {
                  cleanUpEnvironment({ codePath, dockerPath });
                  resolve({ verdict: judgeVerdict.SE });
                }
                if (err) {
                  cleanUpEnvironment({ codePath, dockerPath });
                  if (err.code === DOCKER_MLE_CODE) {
                    resolve({ verdict: judgeVerdict.MLE });
                  }
                  resolve({ verdict: judgeVerdict.SE });
                }
              }
            );

            let hasStdout = false;

            child.on('close', (exitCode) => {
              if (!hasStdout) {
                cleanUpEnvironment({ codePath, dockerPath });
                resolve({
                  verdict: judgeVerdict.CE,
                  additionalInfo: `Exited with status code ${exitCode} without writing to standard output.`,
                });
              }
            });

            child.on('exit', (_, signal) => {
              if (signal === KILL_SIGNAL_CODE) {
                exec(`docker kill ${id}`);
                cleanUpEnvironment({ codePath, dockerPath });
                resolve({ verdict: judgeVerdict.TLE });
              }
            });

            child.stderr.on('data', (stderr) => {
              cleanUpEnvironment({ codePath, dockerPath });
              resolve({
                verdict: judgeVerdict.CE,
                // Remove the first line of stderr as it contains the file name.
                additionalInfo: stderr.substring(stderr.indexOf('\n') + 1),
              });
            });

            child.stdout.on('data', (stdout) => {
              hasStdout = true;
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
