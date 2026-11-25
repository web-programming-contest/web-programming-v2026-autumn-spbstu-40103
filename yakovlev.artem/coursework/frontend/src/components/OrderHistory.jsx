import {formatPrice, goodsWord} from '../format.js';

export default function OrderHistory({orders}) {
  if (orders.length === 0) {
    return <p className="order-history-empty">Вы еще не совершали заказов</p>;
  }
  return (
    <div className="order-history">
      {orders.map((order) => (
        <div className="order-history-row" key={order.number}>
          <span className="order-history-number">
            № {order.number} от {order.date}
          </span>
          <span className="order-history-count">
            {order.items.reduce((sum, item) => sum + item.qty, 0)}{' '}
            {goodsWord(order.items.reduce((sum, item) => sum + item.qty, 0))}
          </span>
          <span className="order-history-total">
            {formatPrice(order.total)}
          </span>
        </div>
      ))}
    </div>
  );
}
