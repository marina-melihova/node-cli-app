import { promises as fsPromises } from 'fs';
import path from 'path';
import { AppError } from '../index.js';
import { ERROR } from '../constants.js';

export const remove = async (dir, filePath) => {
  try {
    const file = path.isAbsolute(filePath) ? path.normalize(filePath) : path.resolve(dir, filePath);
    const stats = await fsPromises.stat(file);
    if (!stats.isFile()) throw { type: 'invalidInput' };
    await fsPromises.rm(file);
  } catch (err) {
    const message = err.type === 'invalidInput' ? ERROR.INVALID : ERROR.FAILED;
    throw new AppError(message);
  }
};
