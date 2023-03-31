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
import { promises as fs } from 'fs';
import util from 'util';

import { languageImages, languageCommands } from './languages.js';
import { generatePath } from './path-generator.js';

const execAsync = util.promisify(exec);

const dockerfileContents = (image, fileName, cmd) => `FROM ${image}
ADD ${fileName} ${fileName}
CMD [ "${cmd}", "${fileName}" ]
`;

const dockerBuildCmd = (dockerPath, tag) =>
  `docker build -f ${dockerPath} -t ${tag} .`;

const dockerRunCmd = (imageName, id, memoryLimit) =>
  `docker run --rm --network none -m ${memoryLimit}M -i --name ${id} ${imageName}`;

const writeDockerfile = async (dockerPath, codePath, language) => {
  await fs.writeFile(
    dockerPath,
    dockerfileContents(
      languageImages[language],
      codePath.replace(/\\/g, '/'),
      languageCommands[language]
    )
  );
};

const setupEnvironment = async (code, language) => {
  const { id, codePath, dockerPath } = generatePath(language);
  await fs.writeFile(codePath, code);
  await writeDockerfile(dockerPath, codePath, language);
  await execAsync(dockerBuildCmd(dockerPath, id));
  return { id, codePath, dockerPath };
};

const cleanUpEnvironment = async ({ codePath, dockerPath }) => {
  try {
    await fs.unlink(dockerPath);
    await fs.unlink(codePath);
  } catch (exc) {
    // Ideally we could have a retry mechanism / check if the files existed in the first place
    // But it's not a big deal if the files are not deleted every once in a while.
  }
};

export { setupEnvironment, cleanUpEnvironment, dockerRunCmd };
