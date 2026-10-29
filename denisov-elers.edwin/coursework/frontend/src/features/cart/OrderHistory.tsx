import {useEffect, useState} from 'react';
import type {Order} from '../../../../shared/types';
import {api} from '../../api';
import {money} from '../../utils/format';

export function OrderHistory({onError}: {onError: (message: string) => void}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onError('');
    api<Order[]>('/orders')
      .then(setOrders)
      .catch((error) => onError(String(error)))
      .finally(() => setLoading(false));
  }, [onError]);

  return (
    <section className="panel history" aria-label="История заказов">
      {loading ? (
        <p>Загрузка заказов…</p>
      ) : !orders.length ? (
        <p>У вас пока нет заказов</p>
      ) : (
        orders.map((order) => (
          <div className="history-row" key={order.id}>
            <span>
              № {order.id} от{' '}
              {new Date(order.createdAt).toLocaleDateString('ru-RU')}
            </span>
            <span>
              Товаров:{' '}
              {order.items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
            <span>{money(order.total)}</span>
          </div>
        ))
      )}
    </section>
  );
}
