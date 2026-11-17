const API_BASE_URL = 'http://localhost:8080';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const isJson = response.headers
    .get('content-type')
    ?.includes('application/json');
  const body = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = body?.message || `Ошибка запроса: ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return body;
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export const api = {
  login(username, password) {
    return request('/login', {
      method: 'POST',
      body: JSON.stringify({username, password}),
    });
  },

  logout() {
    return request('/logout', {method: 'POST'});
  },

  me() {
    return request('/me');
  },

  getGoods(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.set(key, value);
      }
    });
    const queryString = query.toString();
    return request(`/goods${queryString ? `?${queryString}` : ''}`);
  },

  getOrders() {
    return request('/orders');
  },

  createOrder(payload) {
    return request('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
