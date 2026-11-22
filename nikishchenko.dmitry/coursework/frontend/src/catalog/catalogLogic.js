export const PAGE_SIZE = 9;

export const SORTS = [
  {id: 'new', label: 'Новые'},
  {id: 'popular', label: 'Популярные'},
  {id: 'cheap', label: 'Подешевле'},
  {id: 'expensive', label: 'Подороже'},
];
export const DEFAULT_SORT = 'new';

const COMPARATORS = {
  new: (a, b) => b.createdAt.localeCompare(a.createdAt),
  popular: (a, b) => b.popularity - a.popularity,
  cheap: (a, b) => a.price - b.price,
  expensive: (a, b) => b.price - a.price,
};

export function sortGoods(goods, sortId) {
  const compare = COMPARATORS[sortId] ?? COMPARATORS[DEFAULT_SORT];
  return [...goods].sort((a, b) => compare(a, b) || a.id - b.id);
}

export const EMPTY_FILTERS = {
  priceFrom: '',
  priceTo: '',
  types: [],
  colors: [],
};

export function parsePrice(value) {
  if (value === '' || value === null || value === undefined) {
    return null;
  }
  const n = Number(String(value).replace(/\s/g, ''));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function filterGoods(goods, filters) {
  let from = parsePrice(filters.priceFrom);
  let to = parsePrice(filters.priceTo);
  if (from !== null && to !== null && from > to) {
    [from, to] = [to, from];
  }
  return goods.filter(
    (g) =>
      (from === null || g.price >= from) &&
      (to === null || g.price <= to) &&
      (filters.types.length === 0 || filters.types.includes(g.type)) &&
      (filters.colors.length === 0 || filters.colors.includes(g.color)),
  );
}

export function priceBounds(goods) {
  if (goods.length === 0) {
    return {min: 0, max: 0};
  }
  const prices = goods.map((g) => g.price);
  return {min: Math.min(...prices), max: Math.max(...prices)};
}

export const COLOR_ORDER = [
  'Красный',
  'Розовый',
  'Оранжевый',
  'Жёлтый',
  'Зелёный',
  'Голубой',
  'Синий',
  'Фиолетовый',
  'Бежевый',
  'Белый',
  'Серый',
  'Чёрный',
];

export function getFilterOptions(goods) {
  const types = [...new Set(goods.map((g) => g.type))].sort((a, b) =>
    a.localeCompare(b, 'ru'),
  );
  const colors = [...new Set(goods.map((g) => g.color))].sort((a, b) => {
    const ia = COLOR_ORDER.indexOf(a);
    const ib = COLOR_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) {
      return a.localeCompare(b, 'ru');
    }
    return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib);
  });
  return {types, colors};
}

export function paginate(items, page, pageSize = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, Math.trunc(page) || 1), totalPages);
  return {
    items: items.slice((current - 1) * pageSize, current * pageSize),
    page: current,
    totalPages,
  };
}

export const GAP = '…';

export function getPageItems(current, total) {
  if (total <= 3) {
    return Array.from({length: total}, (_, i) => i + 1);
  }
  let start = current <= 3 ? 1 : current - 1;
  let end = start + 2;
  if (end > total) {
    end = total;
    start = total - 2;
  }
  const items = [];
  if (start > 1) {
    items.push(1);
    if (start > 2) {
      items.push(GAP);
    }
  }
  for (let p = start; p <= end; p++) {
    items.push(p);
  }
  if (end < total) {
    if (end < total - 1) {
      items.push(GAP);
    }
    items.push(total);
  }
  return items;
}
