import path from 'path';
import url from 'url';
import os from 'os';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const homeDir = os.homedir();
let currentDir = homeDir;

const userName = 'Username';

const { stdin, stdout } = process;

stdout.write(`Welcome to the File Manager, ${userName}! Input ".exit" or press Ctrl+C to exit\n`);
stdout.write(`You are currently in ${currentDir}\n`);

const onExit = () => {
  stdout.write(`\nThank you for using File Manager, ${userName}, goodbye!\n`);
  process.exit();
};

stdin.on('data', async chunk => {
  if (chunk.toString().trim() === '.exit') {
    onExit();
  }
  stdout.write(`You are currently in ${currentDir}\n`);
});

process.on('SIGINT', onExit);
