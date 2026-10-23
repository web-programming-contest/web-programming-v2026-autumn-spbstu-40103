# Gadget Hub

Учебный интернет-магазин гаджетов.

- frontend: React, React Router и Vite на порту 3000;
- backend: Express на порту 8080;
- товары и заказы: JSON-файлы в `backend/data`;
- корзина: `localStorage` браузера.

## Запуск

```bash
npm install
npm start
```

Откройте http://localhost:3000. Оба сервера останавливаются одной комбинацией
`Ctrl+C`.

Демо-пользователь: `student`, пароль: `gadget2026`.

## Простая структура

- `src/App.jsx` — маршруты страниц;
- `src/context/StoreContext.jsx` — товары, пользователь и корзина;
- `src/pages` — главная, логин, каталог и корзина;
- `src/components` — повторно используемые элементы;
- `backend/server.js` — Express API;
- `tests/api.test.js` — интеграционные тесты API.

## Проверка

```bash
npm test
npm run build
```
