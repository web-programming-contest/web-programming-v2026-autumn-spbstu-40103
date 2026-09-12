import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type {Product, CartItem} from '../../../shared/types';
import {api} from '../api';

interface Store {
  authenticated: boolean;
  loading: boolean;
  error: string;
  goods: Product[];
  items: CartItem[];
  login: (login: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setQuantity: (id: string, quantity: number) => void;
  remove: (ids: string[]) => void;
  clear: () => void;
}

const Context = createContext<Store | null>(null);
const key = 'gadget-hub-cart';

export function StoreProvider({children}: {children: ReactNode}) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [goods, setGoods] = useState<Product[]>([]);
  const [items, setItems] = useState<CartItem[]>(readCart);

  useEffect(() => {
    Promise.all([
      api<{authenticated: boolean}>('/session'),
      api<Product[]>('/goods'),
    ])
      .then(([session, products]) => {
        setAuthenticated(session.authenticated);
        setGoods(products);
        setItems((old) =>
          old.filter((i) => products.some((p) => p.id === i.productId)),
        );
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Сервер недоступен'),
      )
      .finally(() => setLoading(false));
    const expired = () => setAuthenticated(false);
    const sync = (e: StorageEvent) => {
      if (e.key === key) {
        setItems(readCart());
      }
    };
    window.addEventListener('session-expired', expired);
    window.addEventListener('storage', sync);

    return () => {
      window.removeEventListener('session-expired', expired);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch {
      setError('Не удалось сохранить корзину в браузере');
    }
  }, [items]);

  const store: Store = {
    authenticated,
    loading,
    error,
    goods,
    items,
    login: async (login, password) => {
      await api('/login', {login, password});
      setAuthenticated(true);
    },
    logout: async () => {
      await api('/logout', {});
      window.location.assign('/');
    },
    setQuantity: (id, quantity) =>
      setItems((old) =>
        quantity <= 0
          ? old.filter((i) => i.productId !== id)
          : old.some((i) => i.productId === id)
            ? old.map((i) =>
                i.productId === id
                  ? {...i, quantity: Math.min(99, quantity)}
                  : i,
              )
            : [...old, {productId: id, quantity: Math.min(99, quantity)}],
      ),
    remove: (ids) =>
      setItems((old) => old.filter((i) => !ids.includes(i.productId))),
    clear: () => setItems([]),
  };

  return <Context.Provider value={store}>{children}</Context.Provider>;
}

export function useStore() {
  const store = useContext(Context);

  if (!store) {
    throw new Error('StoreProvider missing');
  }

  return store;
}

function readCart(): CartItem[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) || '[]');

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
