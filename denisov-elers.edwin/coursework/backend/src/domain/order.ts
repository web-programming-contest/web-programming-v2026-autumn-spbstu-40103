import {randomUUID} from 'node:crypto';
import type {
  CartItem,
  Checkout,
  Order,
  Product,
} from '../../../shared/types.js';

export type OrderRequest = Partial<Checkout> & {
  items?: CartItem[];
  total?: number;
};

export class OrderRequestError extends Error {}

export function createOrder(body: OrderRequest | undefined, goods: Product[]) {
  validateCheckout(body);
  const items = buildOrderItems(body.items, goods);
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (body.total !== total) {
    throw new OrderRequestError(
      'Стоимость товаров изменилась. Обновите страницу',
    );
  }

  return {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    email: body.email.trim(),
    phone: body.phone.trim(),
    delivery: body.delivery,
    address: body.delivery === 'delivery' ? body.address.trim() : '',
    payment: body.payment,
    packaging: body.packaging,
    items,
    total,
  } satisfies Order;
}

function validateCheckout(
  body: OrderRequest | undefined,
): asserts body is OrderRequest & Checkout {
  if (
    !body ||
    typeof body.phone !== 'string' ||
    !/^[+\d\s()-]{7,25}$/.test(body.phone) ||
    body.phone.replace(/\D/g, '').length < 7 ||
    !['pickup', 'delivery'].includes(body.delivery || '') ||
    !['card', 'cash'].includes(body.payment || '') ||
    typeof body.packaging !== 'boolean' ||
    typeof body.email !== 'string' ||
    (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) ||
    typeof body.address !== 'string' ||
    (body.delivery === 'delivery' && !body.address.trim())
  ) {
    throw new OrderRequestError(
      'Проверьте данные заказа: телефон, адрес и способ оплаты',
    );
  }
}

function buildOrderItems(items: CartItem[] | undefined, goods: Product[]) {
  if (!Array.isArray(items) || !items.length || items.length > goods.length) {
    throw new OrderRequestError('Корзина пуста или некорректна');
  }

  const ids = new Set<string>();

  return items.map((item) => {
    const product = goods.find((candidate) => candidate.id === item?.productId);

    if (
      !product ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 99 ||
      ids.has(item.productId)
    ) {
      throw new OrderRequestError('Некорректный товар или количество');
    }

    ids.add(item.productId);
    return {
      productId: product.id,
      quantity: item.quantity,
      name: product.name,
      price: product.price,
    };
  });
}
