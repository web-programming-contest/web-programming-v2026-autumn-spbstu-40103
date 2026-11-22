import {useCallback, useEffect, useState} from 'react';
import {api} from '../api/client';

// История заказов. Грузится каждый раз, когда вкладка становится активной,
// чтобы новый заказ сразу попал в список. status: 'loading' | 'ready' | 'error'
export function useOrders(active) {
  const [state, setState] = useState({status: 'loading', orders: []});

  const load = useCallback(() => {
    let cancelled = false;
    setState((s) => ({...s, status: 'loading'}));
    api
      .getOrders()
      .then((orders) => !cancelled && setState({status: 'ready', orders}))
      .catch(() => !cancelled && setState({status: 'error', orders: []}));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => (active ? load() : undefined), [active, load]);
  return {...state, reload: load};
}
