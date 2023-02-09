const dockerfileContents = (image, fileName, cmd) => `FROM ${image}
ADD ${fileName} ${fileName}
CMD [ "${cmd}", "${fileName}" ]
`;

const dockerBuildCmd = (dockerPath, tag) =>
  `docker build -f ${dockerPath} -t ${tag} .`;

const dockerRunCmd = (imageName, id, memoryLimit) =>
  `docker run --rm --network none -m ${memoryLimit}M -i --name ${id} ${imageName}`;

export { dockerRunCmd };
