import {createContext, useContext, useEffect, useMemo, useReducer} from 'react';
import {useAuth} from './AuthContext';
import {
  cartCount,
  cartReducer,
  initialCartState,
  readCart,
  writeCart,
} from './cartReducer';

const CartContext = createContext(null);

export function CartProvider({children}) {
  const {user} = useAuth();
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  // Смена пользователя: загружаем его корзину из localStorage (у гостя корзины нет)
  useEffect(() => {
    dispatch({type: 'load', owner: user, items: user ? readCart(user) : {}});
  }, [user]);

  // Сохраняем только если состояние уже принадлежит текущему пользователю
  useEffect(() => {
    if (user && state.owner === user) {
      writeCart(user, state.items);
    }
  }, [user, state]);

  const value = useMemo(
    () => ({
      items: state.items,
      count: cartCount(state.items),
      getQty: (id) => state.items[id] ?? 0,
      add: (id) => dispatch({type: 'add', id}),
      setQty: (id, qty) => dispatch({type: 'setQty', id, qty}),
      remove: (id) => dispatch({type: 'remove', id}),
      removeMany: (ids) => dispatch({type: 'removeMany', ids}),
      clear: () => dispatch({type: 'clear'}),
    }),
    [state.items],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart должен использоваться внутри CartProvider');
  }
  return ctx;
}
