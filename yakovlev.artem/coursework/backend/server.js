const express = require('express');
const session = require('express-session');
const fs = require('fs/promises');
const path = require('path');

const PORT = 8080;
const DATA_DIR = path.join(__dirname, 'data');

const app = express();

app.use(express.json());
app.use(
  session({
    name: 'gadget_hub_sid',
    secret: 'gadget-hub-course-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 24 * 60 * 60 * 1000},
  }),
);

// Раздача статики фронтенда не нужна: фронтенд и бэкенд работают на разных портах.
// CORS открыт для локальной разработки, если фронтенд обращается к API напрямую.
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

async function readJson(file) {
  const raw = await fs.readFile(path.join(DATA_DIR, file), 'utf8');
  return JSON.parse(raw);
}

async function writeJson(file, data) {
  await fs.writeFile(
    path.join(DATA_DIR, file),
    JSON.stringify(data, null, '\t'),
    'utf8',
  );
}

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({error: 'Необходима авторизация'});
  }
  next();
}

app.post('/login', async (req, res) => {
  const {login, password} = req.body || {};
  if (!login || !password) {
    return res.status(400).json({error: 'Заполните обязательное поле'});
  }
  const users = await readJson('users.json');
  const user = users.find((u) => u.login === login && u.password === password);
  if (!user) {
    return res.status(401).json({
      error:
        'Такого пользователя нет, возможно неправильный логин или пароль - проверьте данные',
    });
  }
  req.session.user = {login: user.login};
  res.json({user: {login: user.login}});
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('gadget_hub_sid');
    res.json({ok: true});
  });
});

app.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({error: 'Не авторизован'});
  }
  res.json({user: req.session.user});
});

app.get('/goods', async (req, res) => {
  const goods = await readJson('goods.json');
  res.json(goods);
});

app.get('/orders', requireAuth, async (req, res) => {
  const orders = await readJson('orders.json');
  res.json(orders.filter((o) => o.user === req.session.user.login));
});

app.post('/orders', requireAuth, async (req, res) => {
  const {items, contact} = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({error: 'Корзина пуста'});
  }
  if (!contact || !contact.phone || !String(contact.phone).trim()) {
    return res
      .status(400)
      .json({error: 'Заполните обязательное поле: телефон'});
  }
  if (contact.delivery === 'courier' && !String(contact.address || '').trim()) {
    return res
      .status(400)
      .json({error: 'Заполните обязательное поле: адрес доставки'});
  }

  const goods = await readJson('goods.json');
  const orders = await readJson('orders.json');

  const orderItems = [];
  let total = 0;
  for (const item of items) {
    const good = goods.find((g) => g.id === Number(item.id));
    const qty = Math.max(1, Number(item.qty) || 1);
    if (!good) {
      return res.status(400).json({error: `Товар с id ${item.id} не найден`});
    }
    orderItems.push({id: good.id, name: good.name, price: good.price, qty});
    total += good.price * qty;
  }

  const order = {
    number: Math.floor(100000 + Math.random() * 900000),
    date: new Date().toLocaleDateString('ru-RU'),
    user: req.session.user.login,
    items: orderItems,
    total,
    contact: {
      phone: String(contact.phone).trim(),
      email: String(contact.email || '').trim(),
      delivery: contact.delivery === 'courier' ? 'courier' : 'pickup',
      address: String(contact.address || '').trim(),
      payment: contact.payment === 'cash' ? 'cash' : 'card',
      packaging: Boolean(contact.packaging),
    },
  };

  orders.push(order);
  await writeJson('orders.json', orders);
  res.status(201).json(order);
});

app.listen(PORT, () => {
  process.stdout.write(
    `Gadget Hub backend запущен: http://localhost:${PORT}\n`,
  );
});
