import {Link} from 'react-router-dom';
import {formatItems, formatOrderDate, formatPrice} from '../../utils/format';
import styles from './OrderHistory.module.css';

// status: 'loading' | 'ready' | 'error'. Строки не кликабельны: это просто текст (ТЗ).
export default function OrderHistory({orders, status, onRetry}) {
  if (status === 'loading') {
    return <p className={styles.message}>Загружаем заказы…</p>;
  }
  if (status === 'error') {
    return (
      <div className={styles.message}>
        <p>Не удалось загрузить историю заказов</p>
        <button type="button" className={styles.retry} onClick={onRetry}>
          Повторить
        </button>
      </div>
    );
  }
  if (orders.length === 0) {
    return (
      <div className={styles.message}>
        <p className={styles['empty-title']}>Заказов пока нет</p>
        <p>
          Выберите товары в <Link to="/catalog">каталоге</Link>
        </p>
      </div>
    );
  }
  return (
    <ul className={styles.card}>
      {orders.map((o) => (
        <li key={o.id} className={styles.row}>
          <span>
            № {o.id} от {formatOrderDate(o.date)}
          </span>
          <span>{formatItems(o.itemsCount)}</span>
          <span>{formatPrice(o.total)}</span>
        </li>
      ))}
    </ul>
  );
}
