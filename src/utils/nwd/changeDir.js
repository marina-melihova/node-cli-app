import fsPromises from 'fs/promises';
import path from 'path';
import { ERROR } from '../constants.js';
import { AppError } from '../index.js';

export const changeDir = async (cwd, newDir) => {
  let result = null;
  try {
    let newPath = newDir;
    if (newDir.endsWith(':')) newPath = newDir + '/';
    const target = path.isAbsolute(newPath) ? path.normalize(newPath) : path.resolve(cwd, newDir);
    const stats = await fsPromises.stat(target);
    if (stats.isDirectory()) {
      await fsPromises.access(target);
      result = target;
    } else {
      throw new AppError(ERROR.FAILED);
    }
  } catch {
    throw new AppError(ERROR.FAILED);
  }

  return result;
};
