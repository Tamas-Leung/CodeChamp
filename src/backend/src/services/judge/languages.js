const languages = Object.freeze({
  JAVASCRIPT: `mjs`,
});

const languageImages = Object.freeze({
  mjs: `node`,
});

const languageCommands = Object.freeze({
  mjs: `node`,
});

const languageIsSupported = (language) =>
  Object.keys(languages).some((l) => language === l);

export { languages, languageIsSupported, languageImages, languageCommands };
