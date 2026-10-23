import {spawn} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const viteEntry = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js');
const children = [
  spawn(process.execPath, ['backend/server.js'], {cwd: root, stdio: 'inherit'}),
  spawn(process.execPath, [viteEntry, '--host', '127.0.0.1'], {
    cwd: root,
    stdio: 'inherit',
  }),
];

function stop() {
  for (const child of children) child.kill('SIGTERM');
}

process.on('SIGINT', stop);
process.on('SIGTERM', stop);

for (const child of children) {
  child.on('exit', (code) => {
    if (code && code !== 0) process.exitCode = code;
  });
}
