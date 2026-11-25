async function request(path, options = {}) {
  const res = await fetch(path, {
    credentials: 'same-origin',
    headers: {'Content-Type': 'application/json'},
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || 'Ошибка запроса');
    error.status = res.status;
    throw error;
  }
  return data;
}

export const api = {
  login: (login, password) =>
    request('/login', {
      method: 'POST',
      body: JSON.stringify({login, password}),
    }),
  logout: () => request('/logout', {method: 'POST'}),
  me: () => request('/me'),
  goods: () => request('/goods'),
  orders: () => request('/orders'),
  createOrder: (payload) =>
    request('/orders', {method: 'POST', body: JSON.stringify(payload)}),
};

let goodsCache = null;
export function fetchGoods() {
  if (!goodsCache) {
    goodsCache = api.goods().catch((err) => {
      goodsCache = null;
      throw err;
    });
  }
  return goodsCache;
}
