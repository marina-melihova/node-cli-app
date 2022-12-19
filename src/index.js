import os from 'os';
import { changeDir, listDir, fs, cpusInfo, calcHash, compress, decompress, AppError } from './utils/index.js';
import { ERROR } from './utils/constants.js';

let args = process.argv.slice(2);

let userName = 'guest';

for (let arg of args) {
  if (arg.startsWith('--')) {
    let [key, value = null] = arg.slice(2).split('=');
    if (key === 'username') {
      userName = value;
    }
  }
}

const homeDir = os.homedir();
let currentDir = homeDir;

process.stdout.write(`Welcome to the File Manager, ${userName}! Input ".exit" or press Ctrl+C to quit\n`);
process.stdout.write(`You are currently in ${currentDir}\n`);

const onExit = () => {
  process.stdout.write(`\nThank you for using File Manager, ${userName}, goodbye!\n`);
  process.exit();
};

process.stdin.on('data', async chunk => {
  const command = chunk.toString().trim();
  if (command === '.exit') {
    onExit();
  }
  let result;
  const regex = /"[^"]+"|[^\s]+/g;
  const partsCmd = command.match(regex).map(e => e.replace(/"(.+)"/, '$1'));
  const [operation, ...options] = partsCmd;
  switch (operation) {
    case 'up':
      result = await changeDir(currentDir, '../');
      if (result) {
        currentDir = result;
      }
      break;

    case 'cd':
      result = await changeDir(currentDir, options[0]);
      if (result) {
        currentDir = result;
      }
      break;

    case 'ls':
      await listDir(currentDir);
      break;

    case 'cat':
      result = await fs.read(currentDir, options[0]);
      break;

    case 'add':
      await fs.create(currentDir, options[0]);
      break;

    case 'rn':
      if (options.length < 2) throw new AppError(ERROR.INVALID);
      await fs.rename(currentDir, options);
      break;

    case 'cp':
      if (options.length < 2) throw new AppError(ERROR.INVALID);
      await fs.copy(currentDir, options);
      break;

    case 'mv':
      if (options.length < 2) throw new AppError(ERROR.INVALID);
      await fs.copy(currentDir, options);
      await fs.remove(currentDir, options[0]);
      break;

    case 'rm':
      await fs.remove(currentDir, options[0]);
      break;

    case 'hash':
      result = await calcHash(currentDir, options[0]);
      if (result) {
        console.log(result);
      }
      break;

    case 'os':
      switch (options[0].slice(2)) {
        case 'EOL':
          console.log(JSON.stringify(os.EOL));
          break;
        case 'cpus':
          console.log(`This machine has ${os.cpus().length} CPUS:${os.EOL}`);
          console.table(cpusInfo());
          break;
        case 'homedir':
          console.log(os.homedir());
          break;
        case 'username':
          console.log(os.userInfo().username);
          break;
        case 'architecture':
          console.log(os.arch());
          break;
        default:
          throw new AppError(ERROR.INVALID);
      }
      break;

    case 'compress':
      if (options.length < 2) throw new AppError(ERROR.INVALID);
      await compress(currentDir, options);
      break;

    case 'decompress':
      if (options.length < 2) throw new AppError(ERROR.INVALID);
      await decompress(currentDir, options);
      break;

    default:
      throw new AppError(ERROR.INVALID);
  }

  process.stdout.write(`You are currently in ${currentDir}\n`);
});

process.on('SIGINT', onExit);
