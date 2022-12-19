import { promises as fsPromises } from 'fs';
import path from 'path';
import { AppError } from '../index.js';
import { ERROR } from '../constants.js';

export const remove = async (dir, file) => {
  try {
    const filePath = path.resolve(dir, file);
    await fsPromises.rm(filePath);
  } catch {
    throw new AppError(ERROR.FAILED);
  }
};
