import {defineConfig} from 'vite';

export default defineConfig({
  server: {host: 'localhost', port: 3000, strictPort: true},
  preview: {host: 'localhost', port: 3000, strictPort: true},
  build: {target: 'esnext', outDir: 'dist', emptyOutDir: true}
});
