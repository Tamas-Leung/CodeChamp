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
