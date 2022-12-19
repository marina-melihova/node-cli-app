import { promises as fsPromises } from 'fs';
import path from 'path';
import { AppError } from '../index.js';
import { ERROR } from '../constants.js';

export const read = async (dir, file) => {
  try {
    const filePath = path.resolve(dir, file);
    const fd = await fsPromises.open(filePath);
    const readableStream = fd.createReadStream({ encoding: 'utf8' });
    readableStream.pipe(process.stdout);
  } catch {
    throw new AppError(ERROR.FAILED);
  }
};
