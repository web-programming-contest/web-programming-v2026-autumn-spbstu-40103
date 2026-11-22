import {describe, expect, it} from 'vitest';
import {
  formatItems,
  formatOrderDate,
  lowerFirst,
  pluralize,
} from '../utils/format';
import {
  buildCartRows,
  buildOrderPayload,
  selectedRows,
  totals,
} from './cartLogic';
import {
  BAD_EMAIL,
  BAD_PHONE,
  EMPTY_ORDER,
  NO_PAYMENT,
  REQUIRED,
  validateOrder,
} from './orderValidation';

const goods = [
  {id: 34, name: 'Робот', price: 27990},
  {id: 35, name: 'Часы', price: 2000},
  {id: 36, name: 'Watch', price: 15199},
];

describe('склонения и форматы', () => {
  it('pluralize: 1 товар, 2-4 товара, 5-20 товаров', () => {
    const f = ['товар', 'товара', 'товаров'];
    expect(
      [1, 2, 4, 5, 11, 12, 14, 21, 22, 25, 100, 101, 111].map((n) =>
        pluralize(n, f),
      ),
    ).toEqual([
      'товар',
      'товара',
      'товара',
      'товаров',
      'товаров',
      'товаров',
      'товаров',
      'товар',
      'товара',
      'товаров',
      'товаров',
      'товар',
      'товаров',
    ]);
  });
  it('formatItems как в макете: «1 товар», «4 товара»', () => {
    expect(formatItems(1)).toBe('1 товар');
    expect(formatItems(4)).toBe('4 товара');
    expect(formatItems(3)).toBe('3 товара');
  });
  it('дата заказа: день без нуля, месяц с нулём', () => {
    expect(formatOrderDate('2024-04-28')).toBe('28.04.2024');
    expect(formatOrderDate('2024-03-01')).toBe('1.03.2024');
    expect(formatOrderDate('2024-02-12T10:00:00')).toBe('12.02.2024');
  });
  it('lowerFirst: русские слова с маленькой буквы, остальное без изменений', () => {
    expect(lowerFirst('Смартфон Samsung')).toBe('смартфон Samsung');
    expect(lowerFirst('HUAWEI Band')).toBe('HUAWEI Band');
    expect(lowerFirst('Bluetooth гарнитура')).toBe('Bluetooth гарнитура');
  });
});

describe('cartLogic', () => {
  it('строки корзины: товар + количество + сумма; неизвестные товары пропускаются', () => {
    const rows = buildCartRows(goods, {34: 1, 35: 2, 999: 5});
    expect(rows.map((r) => [r.good.id, r.qty, r.sum])).toEqual([
      [34, 1, 27990],
      [35, 2, 4000],
    ]);
  });
  it('итог как на макете: 1 робот + 2 часов = «3 товара на 31990 ₽»', () => {
    expect(totals(buildCartRows(goods, {34: 1, 35: 2}))).toEqual({
      count: 3,
      sum: 31990,
    });
    expect(totals([])).toEqual({count: 0, sum: 0});
  });
  it('по умолчанию выбрано всё; снятые галочки исключаются из итога', () => {
    const rows = buildCartRows(goods, {34: 1, 35: 2});
    expect(selectedRows(rows, new Set()).length).toBe(2);
    const sel = selectedRows(rows, new Set([34]));
    expect(sel.map((r) => r.good.id)).toEqual([35]);
    expect(totals(sel)).toEqual({count: 2, sum: 4000}); // как на макете: «2 товара на 4000 ₽»
  });
  it('тело заказа: самовывоз без адреса, пустой телефон = null', () => {
    const rows = buildCartRows(goods, {35: 2});
    const p = buildOrderPayload(
      {...EMPTY_ORDER, email: ' a@b.ru ', address: 'лишнее', payment: 'card'},
      rows,
    );
    expect(p).toEqual({
      items: [{goodId: 35, qty: 2}],
      email: 'a@b.ru',
      phone: null,
      delivery: 'pickup',
      address: null,
      payment: 'card',
      packaging: true,
    });
  });
  it('тело заказа: доставка с адресом и телефоном', () => {
    const p = buildOrderPayload(
      {
        ...EMPTY_ORDER,
        email: 'a@b.ru',
        phone: ' +7 999 123-45-67 ',
        delivery: 'delivery',
        address: ' СПб ',
        payment: 'cash',
        packaging: false,
      },
      [],
    );
    expect(p).toMatchObject({
      phone: '+7 999 123-45-67',
      delivery: 'delivery',
      address: 'СПб',
      payment: 'cash',
      packaging: false,
    });
  });
});

describe('validateOrder', () => {
  const ok = {...EMPTY_ORDER, email: 'a@b.ru', payment: 'card'};
  it('пустая форма: нужны e-mail и способ оплаты; телефон и адрес (самовывоз) не нужны', () => {
    expect(validateOrder(EMPTY_ORDER)).toEqual({
      email: REQUIRED,
      payment: NO_PAYMENT,
    });
  });
  it('минимально заполненная форма валидна', () =>
    expect(validateOrder(ok)).toEqual({}));
  it('e-mail: формат', () => {
    expect(validateOrder({...ok, email: 'abc'}).email).toBe(BAD_EMAIL);
    expect(validateOrder({...ok, email: 'a@b'}).email).toBe(BAD_EMAIL);
    expect(validateOrder({...ok, email: '   '}).email).toBe(REQUIRED);
  });
  it('телефон необязателен, но если введён, то не короче 10 цифр', () => {
    expect(validateOrder({...ok, phone: ''})).toEqual({});
    expect(validateOrder({...ok, phone: '+7 (999) 123-45-67'})).toEqual({});
    expect(validateOrder({...ok, phone: '123'}).phone).toBe(BAD_PHONE);
  });
  it('адрес обязателен только при доставке', () => {
    expect(
      validateOrder({...ok, delivery: 'delivery', address: '  '}).address,
    ).toBe(REQUIRED);
    expect(
      validateOrder({...ok, delivery: 'delivery', address: 'СПб'}),
    ).toEqual({});
    expect(validateOrder({...ok, delivery: 'pickup', address: ''})).toEqual({});
  });
});
