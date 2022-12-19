import { createHash } from 'crypto';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { AppError } from './index.js';
import { ERROR } from './constants.js';

const sha256 = content => {
  return createHash('sha256').update(content).digest('hex');
};

export const calcHash = async (dir, filePath) => {
  try {
    const file = path.isAbsolute(filePath) ? path.normalize(filePath) : path.resolve(dir, filePath);
    const fileBuffer = await fsPromises.readFile(file);
    console.log(sha256(fileBuffer));
  } catch {
    throw new AppError(ERROR.FAILED);
  }
};
