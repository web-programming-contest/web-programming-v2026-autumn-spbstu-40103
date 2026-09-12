import express from 'express';
import cors from 'cors';
import session from 'express-session';
import {readFile, writeFile, rename} from 'node:fs/promises';
import {resolve} from 'node:path';
import {randomUUID} from 'node:crypto';
import type {Product, Order, Checkout, CartItem} from '../../shared/types.js';

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

export function createApp(dataDir = resolve(process.cwd(), 'data')) {
  const app = express();

  const read = async <T>(name: string): Promise<T> =>
    JSON.parse(await readFile(resolve(dataDir, name), 'utf8')) as T;
  app.use(cors({origin: 'http://localhost:3000', credentials: true}));
  app.use(express.json({limit: '100kb'}));
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'gadget-hub-local-classroom-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {httpOnly: true, sameSite: 'lax', maxAge: 86400000},
    }),
  );

  app.get('/session', (req, res) =>
    res.json({authenticated: Boolean(req.session.userId)}),
  );

  app.post('/login', async (req, res, next) => {
    try {
      const users =
        await read<{id: string; login: string; password: string}[]>(
          'users.json',
        );
      const user = users.find(
        (u) => u.login === req.body?.login && u.password === req.body?.password,
      );

      if (!user) {
        res.status(401).json({
          message:
            'такого пользователя нет, возможно неправильный логин или пароль - проверьте данные',
        });
        return;
      }

      req.session.regenerate((err) => {
        if (err) {
          return next(err);
        }

        req.session.userId = user.id;
        req.session.save((error) =>
          error ? next(error) : res.json({authenticated: true}),
        );
      });
    } catch (err) {
      next(err);
    }
  });

  app.post('/logout', (req, res, next) =>
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie('connect.sid').json({authenticated: false});
    }),
  );

  app.get('/goods', async (_req, res) =>
    res.json(await read<Product[]>('goods.json')),
  );

  app.use('/orders', (req, res, next) => {
    if (!req.session.userId) {
      res.status(401).json({message: 'Войдите в аккаунт'});
      return;
    }
    next();
  });

  app.get('/orders', async (_req, res) =>
    res.json((await read<Order[]>('orders.json')).reverse()),
  );

  let pendingWrite = Promise.resolve();
  app.post('/orders', async (req, res, next) => {
    try {
      const body = req.body as
        (Partial<Checkout> & {items?: CartItem[]; total?: number}) | undefined;
      if (
        !body ||
        typeof body.phone !== 'string' ||
        !/^[+\d\s()-]{7,25}$/.test(body.phone) ||
        body.phone.replace(/\D/g, '').length < 7 ||
        !['pickup', 'delivery'].includes(body.delivery || '') ||
        !['card', 'cash'].includes(body.payment || '') ||
        typeof body.packaging !== 'boolean' ||
        typeof body.email !== 'string' ||
        (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) ||
        typeof body.address !== 'string' ||
        (body.delivery === 'delivery' && !body.address.trim())
      ) {
        res.status(400).json({
          message: 'Проверьте данные заказа: телефон, адрес и способ оплаты',
        });
        return;
      }

      const goods = await read<Product[]>('goods.json');

      if (
        !Array.isArray(body.items) ||
        !body.items.length ||
        body.items.length > goods.length
      ) {
        res.status(400).json({message: 'Корзина пуста или некорректна'});
        return;
      }

      const ids = new Set<string>();
      const items: Order['items'] = [];

      for (const item of body.items) {
        const product = goods.find((p) => p.id === item?.productId);

        if (
          !product ||
          !Number.isSafeInteger(item.quantity) ||
          item.quantity < 1 ||
          item.quantity > 99 ||
          ids.has(item.productId)
        ) {
          res.status(400).json({message: 'Некорректный товар или количество'});
          return;
        }

        ids.add(item.productId);
        items.push({
          productId: product.id,
          quantity: item.quantity,
          name: product.name,
          price: product.price,
        });
      }

      const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      if (body.total !== total) {
        res
          .status(400)
          .json({message: 'Стоимость товаров изменилась. Обновите страницу'});
        return;
      }

      const order: Order = {
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        email: body.email.trim(),
        phone: body.phone.trim(),
        delivery: body.delivery as Checkout['delivery'],
        address: body.delivery === 'delivery' ? body.address.trim() : '',
        payment: body.payment as Checkout['payment'],
        packaging: body.packaging,
        items,
        total,
      };

      const save = pendingWrite.then(async () => {
        const orders = await read<Order[]>('orders.json');
        orders.push(order);
        await writeFile(
          resolve(dataDir, 'orders.json.tmp'),
          `${JSON.stringify(orders, null, 2)}\n`,
        );
        await rename(
          resolve(dataDir, 'orders.json.tmp'),
          resolve(dataDir, 'orders.json'),
        );
      });

      pendingWrite = save.catch(() => {});
      await save;
      res.status(201).json(order);
    } catch (err) {
      next(err);
    }
  });

  app.use((err: unknown, res: express.Response) => {
    console.error(err);
    res.status(err instanceof SyntaxError ? 400 : 500).json({
      message:
        err instanceof SyntaxError
          ? 'Некорректный JSON'
          : 'Ошибка сервера. Попробуйте позже',
    });
  });

  return app;
}
