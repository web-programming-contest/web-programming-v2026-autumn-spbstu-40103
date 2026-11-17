import {fileURLToPath} from 'node:url';
import './backend/server.js';

const {createServer} = await import('vite').catch(() => {
  console.error('Не найден пакет vite. Выполните в папке проекта: npm install');
  process.exit(1);
});

const root = fileURLToPath(new URL('./frontend/', import.meta.url));
const server = await createServer({root, configFile: fileURLToPath(new URL('./frontend/vite.config.js', import.meta.url))});
await server.listen();
console.log('Магазин: http://localhost:3000');
