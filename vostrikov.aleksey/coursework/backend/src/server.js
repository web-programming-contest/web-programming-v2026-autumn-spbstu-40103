import cors from 'cors';
import express from 'express';
import session from 'express-session';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readJson, writeJson } from './json-store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const productsPath = path.join(rootDir, 'data', 'products.json');
const ordersPath = path.join(rootDir, 'data', 'orders.json');

const app = express();
const port = Number(process.env.PORT ?? 8080);

const allowedOrigins = new Set([
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Origin is not allowed by CORS'));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: '256kb' }));

app.use(
  session({
    name: 'gadgethub.sid',
    secret: process.env.SESSION_SECRET ?? 'gadget-hub-dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 8,
    },
  }),
);

const user = {
  username: process.env.DEMO_USERNAME ?? 'student',
  password: process.env.DEMO_PASSWORD ?? '12345',
};

function requireAuth(req, res, next) {
  if (!req.session.user) {
    res.status(401).json({ error: 'Требуется авторизация' });
    return;
  }
  next();
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function toMoney(value) {
  return Math.round(Number(value) * 100) / 100;
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'gadget-hub-backend' });
});

app.get('/session', (req, res) => {
  res.json({
    authenticated: Boolean(req.session.user),
    username: req.session.user ?? null,
  });
});

app.post('/login', (req, res) => {
  const username = cleanText(req.body?.username);
  const password = cleanText(req.body?.password);

  if (!username || !password) {
    res.status(400).json({ error: 'Логин и пароль обязательны' });
    return;
  }

  if (username !== user.username || password !== user.password) {
    res.status(401).json({
      error:
        'Такого пользователя нет, возможно неправильный логин или пароль — проверьте данные',
    });
    return;
  }

  req.session.user = username;
  res.json({ ok: true, username });
});

app.post('/logout', (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
      return;
    }
    res.clearCookie('gadgethub.sid');
    res.json({ ok: true });
  });
});

app.get('/goods', async (_req, res, next) => {
  try {
    const products = await readJson(productsPath, []);
    res.json(products);
  } catch (error) {
    next(error);
  }
});

app.get('/goods/:id', async (req, res, next) => {
  try {
    const products = await readJson(productsPath, []);
    const product = products.find((item) => item.id === Number(req.params.id));
    if (!product) {
      res.status(404).json({ error: 'Товар не найден' });
      return;
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

app.get('/orders', requireAuth, async (req, res, next) => {
  try {
    const orders = await readJson(ordersPath, []);
    const ownOrders = orders
      .filter((order) => order.username === req.session.user)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(ownOrders);
  } catch (error) {
    next(error);
  }
});

app.post('/orders', requireAuth, async (req, res, next) => {
  try {
    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    const customer = req.body?.customer ?? {};
    const phone = cleanText(customer.phone);
    const email = cleanText(customer.email);
    const deliveryType = cleanText(customer.deliveryType);
    const address = cleanText(customer.address);
    const payment = cleanText(customer.payment);
    const packaging = Boolean(customer.packaging);

    if (!phone) {
      res.status(400).json({ error: 'Телефон обязателен' });
      return;
    }

    if (!['pickup', 'delivery'].includes(deliveryType)) {
      res.status(400).json({ error: 'Выберите способ получения заказа' });
      return;
    }

    if (deliveryType === 'delivery' && !address) {
      res.status(400).json({ error: 'Для доставки укажите адрес' });
      return;
    }

    if (!payment) {
      res.status(400).json({ error: 'Выберите способ оплаты' });
      return;
    }

    if (items.length === 0) {
      res.status(400).json({ error: 'Корзина пуста' });
      return;
    }

    const products = await readJson(productsPath, []);
    const normalizedItems = [];

    for (const item of items) {
      const productId = Number(item.productId);
      const quantity = Number(item.quantity);
      const product = products.find((entry) => entry.id === productId);

      if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        res.status(400).json({ error: 'Некорректный состав заказа' });
        return;
      }

      normalizedItems.push({
        productId,
        name: product.name,
        price: product.price,
        quantity,
        lineTotal: toMoney(product.price * quantity),
      });
    }

    const total = toMoney(
      normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0),
    );
    const orders = await readJson(ordersPath, []);
    const now = new Date();
    const id = Math.max(10000, ...orders.map((order) => Number(order.id) || 0)) + 1;

    const order = {
      id,
      username: req.session.user,
      createdAt: now.toISOString(),
      items: normalizedItems,
      itemsCount: normalizedItems.reduce((sum, item) => sum + item.quantity, 0),
      total,
      customer: {
        phone,
        email,
        deliveryType,
        address: deliveryType === 'delivery' ? address : '',
        payment,
        packaging,
      },
    };

    orders.push(order);
    await writeJson(ordersPath, orders);

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(port, () => {
  console.log(`Gadget Hub backend: http://localhost:${port}`);
  console.log(`Demo login: ${user.username} / ${user.password}`);
});
