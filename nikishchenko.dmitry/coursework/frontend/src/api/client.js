const BASE_URL =
  import.meta.env.VITE_API_URL ?? `http://${window.location.hostname}:8000`;

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(BASE_URL + path, {
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      ...options,
    });
  } catch {
    throw new ApiError(0, 'Не удалось связаться с сервером');
  }
  if (!res.ok) {
    let detail;
    try {
      detail = (await res.json()).detail;
    } catch {
      // тело ответа не JSON — останется сообщение по умолчанию
    }
    throw new ApiError(
      res.status,
      typeof detail === 'string' ? detail : 'Ошибка запроса',
    );
  }
  return res.json();
}

export const api = {
  me: () => request('/me'),
  login: (login, password) =>
    request('/login', {
      method: 'POST',
      body: JSON.stringify({login, password}),
    }),
  register: (login, password) =>
    request('/register', {
      method: 'POST',
      body: JSON.stringify({login, password}),
    }),
  logout: () => request('/logout', {method: 'POST'}),
  getGoods: () => request('/goods'),
  getOrders: () => request('/orders'),
  createOrder: (order) =>
    request('/orders', {method: 'POST', body: JSON.stringify(order)}),
};
