import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {api} from '../api.js';

const StoreContext = createContext(null);
const TOKEN_KEY = 'gadgetHubToken';
const USER_KEY = 'gadgetHubUser';
const CART_KEY = 'gadgetHubCart';

function readUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch {
    return {};
  }
}

export function StoreProvider({children}) {
  const [goods, setGoods] = useState([]);
  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_KEY) || '',
  );
  const [user, setUser] = useState(readUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState(readCart);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const goodsPromise = api('/goods');
        if (token) {
          try {
            const session = await api('/session', {token});
            setUser(session.user);
            localStorage.setItem(USER_KEY, JSON.stringify(session.user));
          } catch {
            setToken('');
            setUser(null);
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
          }
        }
        setGoods(await goodsPromise);
      } catch (requestError) {
        setError(`${requestError.message}. Проверьте backend на порту 8080.`);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function login(credentials) {
    const result = await api('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    setToken(result.token);
    setUser(result.user);
    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
  }

  async function logout() {
    try {
      await api('/logout', {method: 'POST', token});
    } catch {
      /* локальный выход всё равно выполняется */
    }
    setToken('');
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  function changeQuantity(goodId, difference) {
    setCart((current) => {
      const next = {...current};
      const quantity = Number(next[goodId] || 0) + difference;
      if (quantity > 0) next[goodId] = quantity;
      else delete next[goodId];
      localStorage.setItem(CART_KEY, JSON.stringify(next));
      return next;
    });
  }

  function removeItems(ids) {
    setCart((current) => {
      const next = {...current};
      ids.forEach((id) => delete next[id]);
      localStorage.setItem(CART_KEY, JSON.stringify(next));
      return next;
    });
  }

  function clearCart() {
    setCart({});
    localStorage.removeItem(CART_KEY);
  }

  const cartCount = Object.values(cart).reduce(
    (sum, quantity) => sum + Number(quantity),
    0,
  );
  const value = useMemo(
    () => ({
      goods,
      token,
      user,
      loading,
      error,
      login,
      logout,
      cart,
      cartCount,
      changeQuantity,
      removeItems,
      clearCart,
    }),
    [goods, token, user, loading, error, cart],
  );
  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error('useStore используется вне StoreProvider');
  return value;
}
