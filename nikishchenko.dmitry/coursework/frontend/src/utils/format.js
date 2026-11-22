// Цена как в макете: «102099 ₽» (без разделителей разрядов)
export function formatPrice(price) {
  return `${price} ₽`;
}

// Рейтинг по-русски: 4.8 -> «4,8», 5 -> «5»
export function formatRating(rating) {
  return String(rating).replace('.', ',');
}

// Склонение по числу: pluralize(1, ['товар', 'товара', 'товаров']) -> 'товар'
export function pluralize(n, forms) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return forms[0];
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return forms[1];
  }
  return forms[2];
}

// «3 товара»
export function formatItems(n) {
  return `${n} ${pluralize(n, ['товар', 'товара', 'товаров'])}`;
}

// Дата заказа как в макете: «28.04.2024», «1.03.2024» (день без ведущего нуля). Строку разбираем руками:
// через new Date дата могла бы сместиться из-за часового пояса.
export function formatOrderDate(iso) {
  const [y, m, d] = String(iso).slice(0, 10).split('-');
  return `${Number(d)}.${m}.${y}`;
}

// «Смартфон Samsung…» -> «смартфон Samsung…» для фразы «хотите удалить …»; аббревиатуры и латиницу не трогаем
export function lowerFirst(text) {
  return /^[А-ЯЁ][а-яё]/.test(text)
    ? text[0].toLowerCase() + text.slice(1)
    : text;
}
