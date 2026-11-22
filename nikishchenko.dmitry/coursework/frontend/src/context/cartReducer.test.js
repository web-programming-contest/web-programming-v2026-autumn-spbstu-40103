import {describe, expect, it} from 'vitest';
import {
  MAX_QTY,
  cartCount,
  cartReducer,
  initialCartState,
  readCart,
  writeCart,
} from './cartReducer';

const run = (state, ...actions) => actions.reduce(cartReducer, state);
const start = {owner: 'admin', items: {}};

function fakeStorage(initial = {}) {
  const data = {...initial};
  return {
    getItem: (k) => data[k] ?? null,
    setItem: (k, v) => {
      data[k] = v;
    },
    removeItem: (k) => {
      delete data[k];
    },
    data,
  };
}

describe('cartReducer', () => {
  it('add добавляет товар и увеличивает количество', () => {
    const s = run(
      start,
      {type: 'add', id: 5},
      {type: 'add', id: 5},
      {type: 'add', id: 7},
    );
    expect(s.items).toEqual({5: 2, 7: 1});
  });

  it('setQty меняет количество, а 0 удаляет товар (снова появится «В корзину»)', () => {
    const s1 = run(
      start,
      {type: 'add', id: 5},
      {type: 'setQty', id: 5, qty: 4},
    );
    expect(s1.items).toEqual({5: 4});
    expect(run(s1, {type: 'setQty', id: 5, qty: 0}).items).toEqual({});
    expect(run(s1, {type: 'setQty', id: 5, qty: -3}).items).toEqual({});
  });

  it('количество не превышает лимит бэкенда (99)', () => {
    expect(run(start, {type: 'setQty', id: 5, qty: 500}).items).toEqual({
      5: MAX_QTY,
    });
    const s = run({owner: 'admin', items: {5: MAX_QTY}}, {type: 'add', id: 5});
    expect(s.items).toEqual({5: MAX_QTY});
  });

  it('remove и removeMany удаляют только указанные товары', () => {
    const s = {owner: 'admin', items: {1: 1, 2: 2, 3: 3}};
    expect(run(s, {type: 'remove', id: 2}).items).toEqual({1: 1, 3: 3});
    expect(run(s, {type: 'removeMany', ids: [1, 3]}).items).toEqual({2: 2});
  });

  it('clear очищает корзину, owner сохраняется', () => {
    const s = run({owner: 'admin', items: {1: 1}}, {type: 'clear'});
    expect(s).toEqual({owner: 'admin', items: {}});
  });

  it('load подменяет корзину и владельца', () => {
    const s = run(initialCartState, {
      type: 'load',
      owner: 'admin',
      items: {9: 2},
    });
    expect(s).toEqual({owner: 'admin', items: {9: 2}});
  });

  it('cartCount считает единицы товара, а не позиции', () => {
    expect(cartCount({1: 1, 2: 2})).toBe(3); // как на макете: бейдж «3»
    expect(cartCount({})).toBe(0);
  });
});

describe('localStorage', () => {
  it('записывает и читает корзину по ключу пользователя', () => {
    const st = fakeStorage();
    writeCart('admin', {1: 2}, st);
    expect(st.data['cart:admin']).toBe('{"1":2}');
    expect(readCart('admin', st)).toEqual({1: 2});
    expect(readCart('other', st)).toEqual({});
  });

  it('пустая корзина удаляет ключ', () => {
    const st = fakeStorage({'cart:admin': '{"1":2}'});
    writeCart('admin', {}, st);
    expect('cart:admin' in st.data).toBe(false);
  });

  it('испорченные данные не ломают приложение', () => {
    expect(readCart('a', fakeStorage({'cart:a': '{не json'}))).toEqual({});
    expect(readCart('a', fakeStorage({'cart:a': '[1,2]'}))).toEqual({});
    expect(
      readCart('a', fakeStorage({'cart:a': '{"1":-2,"x":3,"4":1.5,"5":2}'})),
    ).toEqual({5: 2});
  });
});
