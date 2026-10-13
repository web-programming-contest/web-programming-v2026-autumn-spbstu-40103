# Gadget Hub — backend

Backend курсового проекта интернет-магазина Gadget Hub на ExpressJS.

## Возможности

- сессия пользователя через cookie;
- `POST /login` и `POST /logout`;
- `GET /session`;
- `GET /goods` и `GET /goods/:id`;
- `GET /orders` для авторизованного пользователя;
- `POST /orders` с серверной валидацией и пересчётом стоимости;
- товары и заказы хранятся локально в JSON;
- чтение/запись JSON выполняются асинхронно через `fs/promises`.

## Запуск

```bash
npm install
npm start
```

Сервер запускается на `http://localhost:8080`.

Frontend должен запускаться на `http://localhost:3000` (CORS уже настроен).

## Демо-пользователь

- логин: `student`
- пароль: `12345`

При желании их можно переопределить переменными окружения `DEMO_USERNAME` и `DEMO_PASSWORD`.

## API

- `GET /health`
- `GET /session`
- `POST /login` — `{ "username": "student", "password": "12345" }`
- `POST /logout`
- `GET /goods`
- `GET /goods/:id`
- `GET /orders` — нужна сессия
- `POST /orders` — нужна сессия

Пример тела заказа:

```json
{
  "items": [{ "productId": 1, "quantity": 2 }],
  "customer": {
    "phone": "+7 999 123-45-67",
    "email": "student@example.com",
    "deliveryType": "pickup",
    "address": "",
    "payment": "card",
    "packaging": true
  }
}
```
