import crypto from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFile, writeFile} from 'node:fs/promises';
import cors from 'cors';
import express from 'express';

const directory = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.BACKEND_PORT || 8080);
const GOODS_FILE = path.join(directory, 'data', 'goods.json');
const ORDERS_FILE =
  process.env.GADGET_HUB_ORDERS_FILE ||
  path.join(directory, 'data', 'orders.json');
const USER = {username: 'student', password: 'gadget2026', name: 'Ярослав'};

export const sessions = new Map();

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;
    throw error;
  }
}

async function saveOrders(orders) {
  await writeFile(ORDERS_FILE, `${JSON.stringify(orders, null, 2)}\n`, 'utf8');
}

function tokenFrom(request) {
  const authorization = request.get('authorization') || '';
  return authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
}

function requireUser(request, response, next) {
  const token = tokenFrom(request);
  const user = sessions.get(token);
  if (!user) {
    response.status(401).json({error: 'Требуется авторизация'});
    return;
  }
  request.auth = {token, user};
  next();
}

function validateOrder(order, goods) {
  if (!order || typeof order !== 'object') return 'Не переданы данные заказа';
  if (!/^\+?[\d\s()\-]{7,20}$/.test(String(order.phone || '')))
    return 'Укажите корректный номер телефона';
  if (!['pickup', 'delivery'].includes(order.delivery))
    return 'Выберите способ получения';
  if (order.delivery === 'delivery' && !String(order.address || '').trim())
    return 'Укажите адрес доставки';
  if (!['card', 'cash'].includes(order.payment))
    return 'Выберите способ оплаты';
  if (!Array.isArray(order.items) || order.items.length === 0)
    return 'Корзина пуста';

  const invalidItem = order.items.some(
    (item) =>
      !goods.some((good) => good.id === Number(item.id)) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1,
  );
  return invalidItem ? 'В заказе есть некорректный товар' : '';
}

function asyncRoute(handler) {
  return (request, response, next) =>
    Promise.resolve(handler(request, response, next)).catch(next);
}

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(
    cors({
      origin(origin, callback) {
        const allowed =
          !origin || /^http:\/\/(localhost|127\.0\.0\.1):3000$/.test(origin);
        callback(allowed ? null : new Error('Origin is not allowed'), allowed);
      },
    }),
  );
  app.use(express.json({limit: '1mb'}));

  app.get('/health', (_request, response) => response.json({status: 'ok'}));

  app.post('/login', (request, response) => {
    const {username, password} = request.body || {};
    if (username !== USER.username || password !== USER.password) {
      response.status(401).json({
        error:
          'Такого пользователя нет. Возможно, логин или пароль введены неверно — проверьте данные.',
      });
      return;
    }

    const token = crypto.randomBytes(24).toString('hex');
    const user = {username: USER.username, name: USER.name};
    sessions.set(token, user);
    response.json({token, user});
  });

  app.post('/logout', (request, response) => {
    sessions.delete(tokenFrom(request));
    response.json({success: true});
  });

  app.get('/session', requireUser, (request, response) => {
    response.json({user: request.auth.user});
  });

  app.get(
    '/goods',
    asyncRoute(async (_request, response) => {
      response.json(await readJson(GOODS_FILE, []));
    }),
  );

  app.get(
    '/orders',
    requireUser,
    asyncRoute(async (request, response) => {
      const orders = await readJson(ORDERS_FILE, []);
      response.json(
        orders
          .filter((order) => order.username === request.auth.user.username)
          .reverse(),
      );
    }),
  );

  app.post(
    '/orders',
    requireUser,
    asyncRoute(async (request, response) => {
      const goods = await readJson(GOODS_FILE, []);
      const validationError = validateOrder(request.body, goods);
      if (validationError) {
        response.status(400).json({error: validationError});
        return;
      }

      const orders = await readJson(ORDERS_FILE, []);
      const items = request.body.items.map((item) => {
        const good = goods.find(
          (candidate) => candidate.id === Number(item.id),
        );
        return {
          id: good.id,
          name: good.name,
          price: good.price,
          quantity: item.quantity,
        };
      });
      const created = {
        id:
          orders.reduce((maximum, order) => Math.max(maximum, order.id), 0) + 1,
        username: request.auth.user.username,
        createdAt: new Date().toISOString(),
        email: String(request.body.email || '').trim(),
        phone: String(request.body.phone).trim(),
        delivery: request.body.delivery,
        address:
          request.body.delivery === 'delivery'
            ? String(request.body.address).trim()
            : '',
        payment: request.body.payment,
        giftWrap: Boolean(request.body.giftWrap),
        items,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
      orders.push(created);
      await saveOrders(orders);
      response.status(201).json(created);
    }),
  );

  app.use((_request, response) =>
    response.status(404).json({error: 'Эндпоинт не найден'}),
  );
  app.use((error, _request, response, _next) => {
    response.status(error.type === 'entity.parse.failed' ? 400 : 500).json({
      error:
        error.type === 'entity.parse.failed'
          ? 'Некорректный JSON'
          : 'Внутренняя ошибка сервера',
    });
  });

  return app;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createApp().listen(PORT, '127.0.0.1', () => {
    console.log(`Gadget Hub backend: http://localhost:${PORT}`);
  });
}
