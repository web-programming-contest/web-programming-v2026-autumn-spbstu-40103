import {describe, expect, it} from 'vitest';
import {visibleItems, shiftIndex} from '../components/Carousel/carouselUtils';
import {formatPrice, formatRating} from './format';
import {pickHits, pickNew} from './goodsSelectors';

describe('format', () => {
  it('цена без разделителей, как в макете', () => {
    expect(formatPrice(102099)).toBe('102099 ₽');
    expect(formatPrice(590)).toBe('590 ₽');
  });
  it('рейтинг с запятой, целые без дробной части', () => {
    expect(formatRating(4.8)).toBe('4,8');
    expect(formatRating(5)).toBe('5');
  });
});

describe('карусель', () => {
  const items = ['a', 'b', 'c', 'd'];
  it('показывает 3 элемента с указанной позиции', () => {
    expect(visibleItems(items, 0, 3)).toEqual(['a', 'b', 'c']);
    expect(visibleItems(items, 1, 3)).toEqual(['b', 'c', 'd']);
  });
  it('закольцована: после последнего идёт первый', () => {
    expect(visibleItems(items, 2, 3)).toEqual(['c', 'd', 'a']);
    expect(visibleItems(items, 3, 3)).toEqual(['d', 'a', 'b']);
  });
  it('если элементов не больше видимых, показывает все как есть', () => {
    expect(visibleItems(['a', 'b'], 1, 3)).toEqual(['a', 'b']);
    expect(visibleItems(['a', 'b', 'c'], 2, 3)).toEqual(['a', 'b', 'c']);
  });
  it('shiftIndex ходит по кругу в обе стороны', () => {
    expect(shiftIndex(0, 1, 4)).toBe(1);
    expect(shiftIndex(3, 1, 4)).toBe(0);
    expect(shiftIndex(0, -1, 4)).toBe(3);
    expect(shiftIndex(2, -3, 4)).toBe(3);
    expect(shiftIndex(5, 0, 0)).toBe(0);
  });
  it('полный круг возвращает на то же место', () => {
    let s = 0;
    for (let i = 0; i < 4; i++) {
      s = shiftIndex(s, 1, 4);
    }
    expect(s).toBe(0);
  });
});

describe('goodsSelectors', () => {
  const goods = [
    {id: 1, isHit: true, isNew: false, popularity: 50},
    {id: 2, isHit: true, isNew: true, popularity: 90},
    {id: 3, isHit: false, isNew: true, popularity: 70},
    {id: 4, isHit: false, isNew: false, popularity: 99},
  ];
  it('хиты: только isHit, по убыванию популярности', () => {
    expect(pickHits(goods).map((g) => g.id)).toEqual([2, 1]);
  });
  it('новинки: только isNew, по убыванию популярности; товар может быть и тем и другим', () => {
    expect(pickNew(goods).map((g) => g.id)).toEqual([2, 3]);
  });
  it('исходный массив не меняется', () => {
    const copy = goods.map((g) => g.id);
    pickHits(goods);
    expect(goods.map((g) => g.id)).toEqual(copy);
  });
});
