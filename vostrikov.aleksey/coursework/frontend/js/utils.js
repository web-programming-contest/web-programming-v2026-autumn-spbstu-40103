export function formatPrice(value) {
  return `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;
}

export function formatRating(value) {
  return String(value).replace('.', ',');
}

export function formatDate(iso) {
  const date = new Date(iso);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
