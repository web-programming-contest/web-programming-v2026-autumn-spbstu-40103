import {useEffect, useState} from 'react';
import type {CartItem} from '../../../shared/types';
import {CART_STORAGE_KEY, readCart, saveCart} from '../utils/cartStorage';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(readCart);
  const [persistenceError, setPersistenceError] = useState('');

  useEffect(() => {
    try {
      saveCart(items);
    } catch {
      setPersistenceError('Не удалось сохранить корзину в браузере');
    }
  }, [items]);

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY) {
        setItems(readCart());
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  return {
    items,
    setItems,
    persistenceError,
    setQuantity: (id: string, quantity: number) =>
      setItems((old) =>
        quantity <= 0
          ? old.filter((item) => item.productId !== id)
          : old.some((item) => item.productId === id)
            ? old.map((item) =>
                item.productId === id
                  ? {...item, quantity: Math.min(99, quantity)}
                  : item,
              )
            : [...old, {productId: id, quantity: Math.min(99, quantity)}],
      ),
    remove: (ids: string[]) =>
      setItems((old) => old.filter((item) => !ids.includes(item.productId))),
    clear: () => setItems([]),
  };
}
