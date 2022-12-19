import { promises as fsPromises } from 'fs';
import path from 'path';
import { AppError } from '../index.js';
import { ERROR } from '../constants.js';

export const rename = async (dir, options) => {
  try {
    const [oldFileName, newFileName] = options;
    const files = await fsPromises.readdir(dir);
    if (files.includes(newFileName)) throw { type: 'invalidInput' };
    const oldFile = path.resolve(dir, oldFileName);
    const newFile = path.resolve(dir, newFileName);
    await fsPromises.rename(oldFile, newFile);
  } catch (err) {
    const message = err.type === 'invalidInput' ? ERROR.INVALID : ERROR.FAILED;
    throw new AppError(message);
  }
};
