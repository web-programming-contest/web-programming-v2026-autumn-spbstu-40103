import {useEffect, useState, type Dispatch, type SetStateAction} from 'react';
import type {CartItem, Product} from '../../../shared/types';
import {api} from '../api';

export function useStoreData(setItems: Dispatch<SetStateAction<CartItem[]>>) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [goods, setGoods] = useState<Product[]>([]);

  useEffect(() => {
    Promise.all([
      api<{authenticated: boolean}>('/session'),
      api<Product[]>('/goods'),
    ])
      .then(([session, products]) => {
        setAuthenticated(session.authenticated);
        setGoods(products);
        setItems((old) =>
          old.filter((item) =>
            products.some((product) => product.id === item.productId),
          ),
        );
      })
      .catch((reason) =>
        setError(
          reason instanceof Error ? reason.message : 'Сервер недоступен',
        ),
      )
      .finally(() => setLoading(false));

    const expireSession = () => setAuthenticated(false);
    window.addEventListener('session-expired', expireSession);
    return () => window.removeEventListener('session-expired', expireSession);
  }, [setItems]);

  return {
    authenticated,
    loading,
    error,
    goods,
    login: async (login: string, password: string) => {
      await api('/login', {login, password});
      setAuthenticated(true);
    },
    logout: async () => {
      await api('/logout', {});
      window.location.assign('/');
    },
  };
}
