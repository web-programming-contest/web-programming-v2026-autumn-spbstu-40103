import {existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';

if (!existsSync(new URL('./node_modules/vite/package.json', import.meta.url))) {
  console.log('Зависимости не установлены, выполняю npm install');
  const r = spawnSync('npm', ['install'], {stdio: 'inherit', shell: true});
  if (r.status !== 0) {
    console.error('Не удалось выполнить npm install. Проверьте интернет и запустите команду вручную.');
    process.exit(1);
  }
}
