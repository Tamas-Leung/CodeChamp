export interface Language {
  displayName: string;
  extension: string;
}

const javaScript: Language = { displayName: 'JavaScript', extension: 'mjs' };
const python: Language = { displayName: 'Python', extension: 'py' };

export const languages = { javaScript, python };
