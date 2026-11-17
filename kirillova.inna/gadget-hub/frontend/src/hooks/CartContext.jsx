import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useAuth} from './AuthContext.jsx';

const CartContext = createContext(null);
const STORAGE_PREFIX = 'gadget-hub-cart:';

function readCartFromStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function CartProvider({children}) {
  const {user} = useAuth();
  const storageKey = user ? `${STORAGE_PREFIX}${user.id}` : null;

  const [cart, setCart] = useState({key: null, items: {}});

  if (cart.key !== storageKey) {
    setCart({
      key: storageKey,
      items: storageKey ? readCartFromStorage(storageKey) : {},
    });
  }

  const items = cart.items;

  useEffect(() => {
    if (!storageKey || cart.key !== storageKey) {
      return;
    }
    if (Object.keys(cart.items).length === 0) {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, JSON.stringify(cart.items));
    }
  }, [cart, storageKey]);

  const update = useCallback((fn) => {
    setCart((prev) => ({...prev, items: fn(prev.items)}));
  }, []);

  const increment = useCallback(
    (id) => update((prev) => ({...prev, [id]: (prev[id] ?? 0) + 1})),
    [update],
  );

  const decrement = useCallback(
    (id) =>
      update((prev) => {
        const current = prev[id] ?? 0;
        const next = {...prev};
        if (current <= 1) {
          delete next[id];
        } else {
          next[id] = current - 1;
        }
        return next;
      }),
    [update],
  );

  const remove = useCallback(
    (id) =>
      update((prev) => {
        const next = {...prev};
        delete next[id];
        return next;
      }),
    [update],
  );

  const removeMany = useCallback(
    (ids) =>
      update((prev) => {
        const next = {...prev};
        ids.forEach((id) => delete next[id]);
        return next;
      }),
    [update],
  );

  const clear = useCallback(() => update(() => ({})), [update]);

  const totalCount = useMemo(
    () => Object.values(items).reduce((sum, qty) => sum + qty, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      increment,
      decrement,
      remove,
      removeMany,
      clear,
      totalCount,
    }),
    [items, increment, decrement, remove, removeMany, clear, totalCount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
