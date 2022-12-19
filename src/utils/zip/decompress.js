import { promises as fsPromises } from 'fs';
import zlib from 'zlib';
import path from 'path';
import { once } from 'events';
import { AppError } from '../index.js';
import { ERROR } from '../constants.js';

export const decompress = async (dir, options) => {
  try {
    const [sourcePath, destPath] = options;
    const source = path.isAbsolute(sourcePath) ? path.normalize(sourcePath) : path.resolve(dir, sourcePath);
    const sourceStats = await fsPromises.stat(source);
    if (!sourceStats.isFile()) throw { type: 'invalidInput' };
    let destination = path.isAbsolute(destPath) ? path.normalize(destPath) : path.resolve(dir, destPath);
    const fdDest = await fsPromises.open(destination, 'w');
    const fdSource = await fsPromises.open(source);
    const writableStream = fdDest.createWriteStream();
    const readableStream = fdSource.createReadStream();
    const brotli = zlib.createBrotliDecompress();
    console.log('Decompression has already started, please wait...');
    readableStream.pipe(brotli).pipe(writableStream);
    await once(writableStream, 'finish');
    console.log('Archive was decompressed');
  } catch (err) {
    const message = err.type === 'invalidInput' ? ERROR.INVALID : ERROR.FAILED;
    throw new AppError(message);
  }
};
