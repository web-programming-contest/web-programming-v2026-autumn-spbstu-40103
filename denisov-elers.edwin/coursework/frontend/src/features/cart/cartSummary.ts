import type {CartItem, Product} from '../../../../shared/types';

export interface CartLine extends CartItem {
  product: Product;
}

export function getCartSummary(items: CartItem[], goods: Product[]) {
  const lines = items.flatMap((item) => {
    const product = goods.find((candidate) => candidate.id === item.productId);
    return product ? [{...item, product}] : [];
  });
  const total = lines.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0,
  );
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return {lines, total, count};
}
