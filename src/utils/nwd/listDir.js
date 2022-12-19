import fsPromises from 'fs/promises';
import { ERROR } from '../constants.js';
import { AppError } from '../index.js';

export const listDir = async dir => {
  try {
    const files = await fsPromises.readdir(dir, { withFileTypes: true });
    const list = files.map(item => ({
      Name: item.name,
      Type: item.isFile() ? 'file' : 'directory',
    }));
    list.sort((a, b) => (b.Type < a.Type) - (a.Type < b.Type) || (b.Name < a.Name) - (a.Name < b.Name));
    console.table(list);
  } catch {
    throw new AppError(ERROR.FAILED);
  }
};
