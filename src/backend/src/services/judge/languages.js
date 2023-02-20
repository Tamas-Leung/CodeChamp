const languages = Object.freeze({
  JAVASCRIPT: `mjs`,
  PYTHON: `py`,
});

const languageImages = Object.freeze({
  mjs: `node:19-alpine`,
  py: 'python:3.11-alpine',
});

const languageCommands = Object.freeze({
  mjs: `node`,
  py: `python`,
});

const languageIsSupported = (language) =>
  Object.values(languages).some((l) => language === l);

export { languages, languageIsSupported, languageImages, languageCommands };
