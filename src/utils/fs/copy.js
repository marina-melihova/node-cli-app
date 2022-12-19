import { promises as fsPromises } from 'fs';
import path from 'path';
import { AppError } from '../index.js';
import { ERROR } from '../constants.js';

export const copy = async (dir, options) => {
  try {
    const [sourcePath, destPath] = options;
    const source = path.isAbsolute(sourcePath) ? path.normalize(sourcePath) : path.resolve(dir, sourcePath);
    const sourceStats = await fsPromises.stat(source);
    if (!sourceStats.isFile()) throw { type: 'invalidInput' };
    let destination = path.isAbsolute(destPath) ? path.normalize(destPath) : path.resolve(dir, destPath);
    const destStats = await fsPromises.stat(destination);
    if (destStats.isDirectory()) {
      const filename = path.basename(source);
      destination = path.resolve(destination, filename);
    }
    const fdDest = await fsPromises.open(destination, 'w');
    const fdSource = await fsPromises.open(source, 'r');
    const writableStream = fdDest.createWriteStream();
    const readableStream = fdSource.createReadStream({ encoding: 'utf8' });
    readableStream.pipe(writableStream);
  } catch (err) {
    const message = err.type === 'invalidInput' ? ERROR.INVALID : ERROR.FAILED;
    throw new AppError(message);
  }
};
