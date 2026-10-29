import {createContext, useContext, type ReactNode} from 'react';
import type {Store} from './storeTypes';
import {useCart} from './useCart';
import {useStoreData} from './useStoreData';

const Context = createContext<Store | null>(null);

export function StoreProvider({children}: {children: ReactNode}) {
  const cart = useCart();
  const data = useStoreData(cart.setItems);
  const store: Store = {
    ...data,
    items: cart.items,
    setQuantity: cart.setQuantity,
    remove: cart.remove,
    clear: cart.clear,
    error: data.error || cart.persistenceError,
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
