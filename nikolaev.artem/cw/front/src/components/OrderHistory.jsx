import {formatDate, formatPrice, pluralize} from '../utils/format'
import './OrderHistory.css'

export default function OrderHistory({orders}) {
  if (!orders?.length) {
    return <p className="order-history__empty">У вас пока нет оформленных заказов</p>
  }

  return (
    <div className="order-history">
      {orders.map((order) => {
        const count = order.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0
        return (
          <div className="order-history__row" key={order.id}>
            <span className="order-history__number">
              № {order.orderNumber} от {formatDate(order.createdAt)}
            </span>
            <span>
              {count} {pluralize(count, ['товар', 'товара', 'товаров'])}
            </span>
            <span className="order-history__total">{formatPrice(order.total)} ₽</span>
          </div>
        )
      })}
    </div>
  )
}
