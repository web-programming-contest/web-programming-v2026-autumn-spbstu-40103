import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

const backend = 'http://localhost:8080';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // /login — одновременно и роут фронтенда: GET-страницу отдаём из SPA,
      // а POST с данными формы проксируем на бэкенд.
      '/login': {
        target: backend,
        bypass(req) {
          if (
            req.method === 'GET' &&
            req.headers.accept?.includes('text/html')
          ) {
            return '/index.html';
          }
        },
      },
      '/logout': backend,
      '/me': backend,
      '/goods': backend,
      '/orders': backend,
    },
  },
});
