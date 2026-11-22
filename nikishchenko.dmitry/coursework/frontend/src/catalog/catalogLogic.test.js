import {describe, expect, it} from 'vitest';
import {
  EMPTY_FILTERS,
  GAP,
  filterGoods,
  getFilterOptions,
  getPageItems,
  paginate,
  parsePrice,
  priceBounds,
  sortGoods,
} from './catalogLogic';

const g = (id, o = {}) => ({
  id,
  price: 1000,
  popularity: 50,
  createdAt: '2024-01-01',
  type: 'Смартфоны',
  color: 'Чёрный',
  ...o,
});
const ids = (list) => list.map((x) => x.id);

describe('sortGoods', () => {
  const goods = [
    g(1, {price: 300, popularity: 10, createdAt: '2024-03-01'}),
    g(2, {price: 100, popularity: 90, createdAt: '2024-05-01'}),
    g(3, {price: 200, popularity: 50, createdAt: '2024-01-01'}),
  ];
  it('новые: сначала самые свежие', () =>
    expect(ids(sortGoods(goods, 'new'))).toEqual([2, 1, 3]));
  it('популярные: по убыванию популярности', () =>
    expect(ids(sortGoods(goods, 'popular'))).toEqual([2, 3, 1]));
  it('подешевле: от дешёвых к дорогим', () =>
    expect(ids(sortGoods(goods, 'cheap'))).toEqual([2, 3, 1]));
  it('подороже: от дорогих к дешёвым', () =>
    expect(ids(sortGoods(goods, 'expensive'))).toEqual([1, 3, 2]));
  it('неизвестный вариант = «новые»', () =>
    expect(ids(sortGoods(goods, '???'))).toEqual([2, 1, 3]));
  it('равные значения идут по id, исходный массив не меняется', () => {
    const same = [g(3), g(1), g(2)];
    expect(ids(sortGoods(same, 'cheap'))).toEqual([1, 2, 3]);
    expect(ids(same)).toEqual([3, 1, 2]);
  });
});

describe('filterGoods', () => {
  const goods = [
    g(1, {price: 500, type: 'Смартфоны', color: 'Красный'}),
    g(2, {price: 1500, type: 'Умные часы', color: 'Синий'}),
    g(3, {price: 2500, type: 'Умные часы', color: 'Красный'}),
  ];
  const f = (o) => ids(filterGoods(goods, {...EMPTY_FILTERS, ...o}));
  it('без фильтров показываются все товары', () =>
    expect(f({})).toEqual([1, 2, 3]));
  it('цена «от» и «до» включает границы', () => {
    expect(f({priceFrom: '1500'})).toEqual([2, 3]);
    expect(f({priceTo: '1500'})).toEqual([1, 2]);
    expect(f({priceFrom: '1500', priceTo: '1500'})).toEqual([2]);
  });
  it('перепутанные «от» и «до» меняются местами', () =>
    expect(f({priceFrom: '2000', priceTo: '1000'})).toEqual([2]));
  it('фильтр по типу и по цвету', () => {
    expect(f({types: ['Умные часы']})).toEqual([2, 3]);
    expect(f({colors: ['Красный']})).toEqual([1, 3]);
  });
  it('несколько значений внутри группы = «или», между группами = «и»', () => {
    expect(f({colors: ['Красный', 'Синий']})).toEqual([1, 2, 3]);
    expect(f({types: ['Умные часы'], colors: ['Красный']})).toEqual([3]);
  });
  it('ничего не подошло: пустой список', () =>
    expect(f({priceFrom: '99999'})).toEqual([]));
  it('мусор в поле цены игнорируется', () =>
    expect(f({priceFrom: 'abc', priceTo: '-5'})).toEqual([1, 2, 3]));
});

describe('parsePrice', () => {
  it('разбирает числа и пустые значения', () => {
    expect(parsePrice('2990')).toBe(2990);
    expect(parsePrice('1 500')).toBe(1500);
    expect(parsePrice('')).toBeNull();
    expect(parsePrice('x')).toBeNull();
    expect(parsePrice('-1')).toBeNull();
  });
});

describe('priceBounds и getFilterOptions', () => {
  it('границы цены', () => {
    expect(priceBounds([g(1, {price: 590}), g(2, {price: 167890})])).toEqual({
      min: 590,
      max: 167890,
    });
    expect(priceBounds([])).toEqual({min: 0, max: 0});
  });
  it('типы по алфавиту, цвета по радуге, повторы убраны', () => {
    const o = getFilterOptions([
      g(1, {type: 'Умные часы', color: 'Синий'}),
      g(2, {type: 'Смартфоны', color: 'Красный'}),
      g(3, {type: 'Смартфоны', color: 'Чёрный'}),
      g(4, {type: 'Аксессуары', color: 'Жёлтый'}),
      g(5, {type: 'Аксессуары', color: 'Какой-то новый'}),
    ]);
    expect(o.types).toEqual(['Аксессуары', 'Смартфоны', 'Умные часы']);
    expect(o.colors).toEqual([
      'Красный',
      'Жёлтый',
      'Синий',
      'Чёрный',
      'Какой-то новый',
    ]);
  });
});

describe('paginate', () => {
  const items = Array.from({length: 41}, (_, i) => i + 1);
  it('41 товар = 5 страниц по 9, на последней один', () => {
    expect(paginate(items, 1).totalPages).toBe(5);
    expect(paginate(items, 1).items).toHaveLength(9);
    expect(paginate(items, 5).items).toEqual([37, 38, 39, 40, 41].slice(0, 5));
  });
  it('номер страницы подгоняется под допустимый', () => {
    expect(paginate(items, 99).page).toBe(5);
    expect(paginate(items, 0).page).toBe(1);
    expect(paginate(items, NaN).page).toBe(1);
  });
  it('пустой список: одна пустая страница', () =>
    expect(paginate([], 3)).toEqual({items: [], page: 1, totalPages: 1}));
});

describe('getPageItems', () => {
  const G = GAP;
  it('до трёх страниц показываются все', () => {
    expect(getPageItems(1, 1)).toEqual([1]);
    expect(getPageItems(2, 3)).toEqual([1, 2, 3]);
  });
  it('как в ТЗ: «1 2 3 … N»', () => {
    expect(getPageItems(1, 5)).toEqual([1, 2, 3, G, 5]);
    expect(getPageItems(3, 5)).toEqual([1, 2, 3, G, 5]);
  });
  it('в конце списка окно сдвигается, текущая страница всегда видна', () => {
    expect(getPageItems(4, 5)).toEqual([1, G, 3, 4, 5]);
    expect(getPageItems(5, 5)).toEqual([1, G, 3, 4, 5]);
  });
  it('многоточие ставится только если реально что-то пропущено', () => {
    expect(getPageItems(1, 4)).toEqual([1, 2, 3, 4]);
    expect(getPageItems(6, 10)).toEqual([1, G, 5, 6, 7, G, 10]);
  });
  it('текущая страница есть в списке при любых значениях', () => {
    for (let total = 1; total <= 12; total++) {
      for (let c = 1; c <= total; c++) {
        expect(getPageItems(c, total)).toContain(c);
      }
    }
  });
});
