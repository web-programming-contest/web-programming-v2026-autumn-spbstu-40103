import {useCallback, useEffect, useState} from 'react';
import {api} from '../api/client';

// Товары не меняются за время сессии, поэтому грузим один раз и запоминаем.
let cache = null;
let pending = null;

function fetchGoods() {
  if (cache) {
    return Promise.resolve(cache);
  }
  if (!pending) {
    pending = api
      .getGoods()
      .then((goods) => (cache = goods))
      .finally(() => (pending = null));
  }
  return pending;
}

// status: 'loading' | 'ready' | 'error'
export function useGoods() {
  const [state, setState] = useState(
    cache ? {status: 'ready', goods: cache} : {status: 'loading', goods: []},
  );

  const load = useCallback(() => {
    let cancelled = false;
    setState((s) => ({...s, status: 'loading'}));
    fetchGoods()
      .then((goods) => !cancelled && setState({status: 'ready', goods}))
      .catch(() => !cancelled && setState({status: 'error', goods: []}));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => (cache ? undefined : load()), [load]);

  return {...state, reload: load};
}
