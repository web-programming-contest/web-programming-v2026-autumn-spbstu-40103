import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import {useAuth} from './AuthContext.jsx';

const CartContext = createContext(null);

function storageKey(login) {
  return `gadget_hub_cart_${login}`;
}

function loadCart(login) {
  try {
    const raw = localStorage.getItem(storageKey(login));
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function CartProvider({children}) {
  const {user} = useAuth();
  const [items, setItems] = useState({});

  useEffect(() => {
    setItems(user ? loadCart(user.login) : {});
  }, [user]);

  const persist = useCallback(
    (next) => {
      setItems(next);
      if (user) {
        localStorage.setItem(storageKey(user.login), JSON.stringify(next));
      }
    },
    [user],
  );

  const add = useCallback(
    (id, qty = 1) => {
      persist({...items, [id]: (items[id] || 0) + qty});
    },
    [items, persist],
  );

  const setQty = useCallback(
    (id, qty) => {
      const next = {...items};
      if (qty <= 0) {
        delete next[id];
      } else {
        next[id] = qty;
      }
      persist(next);
    },
    [items, persist],
  );

  const remove = useCallback(
    (id) => {
      const next = {...items};
      delete next[id];
      persist(next);
    },
    [items, persist],
  );

  const removeMany = useCallback(
    (ids) => {
      const next = {...items};
      ids.forEach((id) => delete next[id]);
      persist(next);
    },
    [items, persist],
  );

  const clear = useCallback(() => {
    persist({});
  }, [persist]);

  const count = useMemo(
    () => Object.values(items).reduce((sum, qty) => sum + qty, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{items, count, add, setQty, remove, removeMany, clear}}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
