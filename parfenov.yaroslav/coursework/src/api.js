const API_URL = 'http://localhost:8080';

export async function api(path, options = {}) {
  const headers = {
    ...(options.body ? {'Content-Type': 'application/json'} : {}),
    ...options.headers,
  };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  const response = await fetch(`${API_URL}${path}`, {...options, headers});
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Ошибка запроса');
  return data;
}
