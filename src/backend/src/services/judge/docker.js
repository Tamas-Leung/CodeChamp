import { promises as fs } from 'fs';

import { languageImages, languageCommands } from './languages.js';

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

export { dockerRunCmd };
