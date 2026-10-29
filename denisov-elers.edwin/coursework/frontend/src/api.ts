export async function api<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`http://localhost:8080${path}`, {
    credentials: 'include',
    ...(body !== undefined
      ? {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(body),
        }
      : {}),
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401 && path !== '/login') {
      window.dispatchEvent(new Event('session-expired'));
    }
    throw new Error(data.message || 'Не удалось выполнить запрос');
  }

  return data as T;
}
