import { API_URL } from './config.js';

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const error = new Error(data?.error ?? `HTTP ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function getSession() {
  return apiFetch('/session');
}

export function login(username, password) {
  return apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function logout() {
  return apiFetch('/logout', { method: 'POST' });
}

export function getGoods() {
  return apiFetch('/goods');
}

export function getOrders() {
  return apiFetch('/orders');
}

export function createOrder(payload) {
  return apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
