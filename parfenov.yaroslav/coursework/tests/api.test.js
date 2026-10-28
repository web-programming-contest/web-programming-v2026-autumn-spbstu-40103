import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import os from 'node:os';
import {writeFile, unlink} from 'node:fs/promises';

const ordersFile = path.join(
  os.tmpdir(),
  `gadget-hub-orders-${process.pid}.json`,
);
process.env.GADGET_HUB_ORDERS_FILE = ordersFile;
const {createApp} = await import('../backend/server.js');

let server;
let baseUrl;

test.before(async () => {
  await writeFile(ordersFile, '[]\n', 'utf8');
  server = createApp().listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
  await unlink(ordersFile).catch(() => {});
});

test('API returns all goods', async () => {
  const response = await fetch(`${baseUrl}/goods`);
  const goods = await response.json();
  assert.equal(response.status, 200);
  assert.equal(goods.length, 32);
  assert.ok(goods.every((good) => good.id && good.name && good.price > 0));
});

test('login rejects incorrect credentials and creates a session', async () => {
  const wrong = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username: 'wrong', password: 'wrong'}),
  });
  assert.equal(wrong.status, 401);

  const correct = await login();
  assert.equal(correct.response.status, 200);
  assert.equal(correct.data.user.username, 'student');
  assert.ok(correct.data.token);
});

test('authorized user creates an order and sees it in history', async () => {
  const {
    data: {token},
  } = await login();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  const createdResponse = await fetch(`${baseUrl}/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      phone: '+7 999 123-45-67',
      delivery: 'pickup',
      payment: 'card',
      items: [{id: 1, quantity: 2}],
    }),
  });
  const created = await createdResponse.json();
  assert.equal(createdResponse.status, 201);
  assert.equal(created.total, 4980);

  const historyResponse = await fetch(`${baseUrl}/orders`, {headers});
  const history = await historyResponse.json();
  assert.equal(history.length, 1);
  assert.equal(history[0].id, created.id);
});

async function login() {
  const response = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username: 'student', password: 'gadget2026'}),
  });
  return {response, data: await response.json()};
}
