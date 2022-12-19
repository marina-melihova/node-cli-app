import { promises as fsPromises } from 'fs';
import path from 'path';
import { AppError } from '../index.js';
import { ERROR } from '../constants.js';

export const copy = async (dir, options) => {
  try {
    const [sourcePath, destPath] = options;
    const source = path.isAbsolute(sourcePath) ? path.normalize(sourcePath) : path.resolve(dir, sourcePath);
    const destination = path.isAbsolute(destPath) ? path.normalize(destPath) : path.resolve(dir, destPath);
    const fdDest = await fsPromises.open(destination, 'w');
    const fdSource = await fsPromises.open(source, 'r');
    const writableStream = fdDest.createWriteStream();
    const readableStream = fdSource.createReadStream({ encoding: 'utf8' });
    readableStream.pipe(writableStream);
  } catch {
    throw new AppError(ERROR.FAILED);
  }
};
