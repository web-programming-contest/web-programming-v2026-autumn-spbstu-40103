import type {CartItem} from '../../../shared/types';

export const CART_STORAGE_KEY = 'gadget-hub-cart';

export function readCart(): CartItem[] {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem(CART_STORAGE_KEY) || '[]',
    );
    if (!Array.isArray(value)) {
      return [];
    }

    const ids = new Set<string>();
    return value.filter((item: unknown): item is CartItem => {
      if (
        !item ||
        typeof item !== 'object' ||
        !('productId' in item) ||
        !('quantity' in item) ||
        typeof item.productId !== 'string' ||
        typeof item.quantity !== 'number' ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 99 ||
        ids.has(item.productId)
      ) {
        return false;
      }
      ids.add(item.productId);
      return true;
    });
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}
