import { promises as fsPromises } from 'fs';
import path from 'path';
import { AppError } from '../index.js';
import { ERROR } from '../constants.js';

export const create = async (dir, file) => {
  try {
    const filePath = path.resolve(dir, file);
    await fsPromises.writeFile(filePath, '', { flag: 'wx' });
  } catch {
    throw new AppError(ERROR.FAILED);
  }
};
