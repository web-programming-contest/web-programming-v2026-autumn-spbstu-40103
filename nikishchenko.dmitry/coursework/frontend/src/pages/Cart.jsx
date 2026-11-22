import {useEffect, useMemo, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {api} from '../api/client';
import {
  buildCartRows,
  buildOrderPayload,
  selectedRows,
  totals,
} from '../cart/cartLogic';
import CartItem from '../components/CartItem/CartItem';
import Checkbox from '../components/Checkbox/Checkbox';
import ConfirmDialog from '../components/ConfirmDialog/ConfirmDialog';
import EmptyCart from '../components/EmptyCart/EmptyCart';
import LinkButton from '../components/LinkButton/LinkButton';
import Modal, {ModalActions, ModalMessage} from '../components/Modal/Modal';
import Button from '../components/Button/Button';
import OrderForm from '../components/OrderForm/OrderForm';
import OrderHistory from '../components/OrderHistory/OrderHistory';
import OrderSuccessModal from '../components/OrderSuccessModal/OrderSuccessModal';
import Tabs from '../components/Tabs/Tabs';
import {useAuth} from '../context/AuthContext';
import {useCart} from '../context/CartContext';
import {useGoods} from '../hooks/useGoods';
import {useOrders} from '../hooks/useOrders';
import {CloseIcon} from '../icons';
import {formatItems, formatPrice, lowerFirst} from '../utils/format';
import styles from './Cart.module.css';
import {usePageTitle} from '../hooks/usePageTitle';

const TABS = [
  {id: 'cart', label: 'Корзина'},
  {id: 'history', label: 'История заказов'},
];

export default function Cart() {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'history' ? 'history' : 'cart';
  const changeTab = (id) => setParams(id === 'history' ? {tab: 'history'} : {});
  usePageTitle(tab === 'history' ? 'История заказов' : 'Корзина');

  const {logout} = useAuth();
  const {goods, status, reload} = useGoods();
  const cart = useCart();
  const orders = useOrders(tab === 'history');

  const [deselected, setDeselected] = useState(() => new Set());
  const [confirm, setConfirm] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(null);
  const [failure, setFailure] = useState(null);

  const rows = useMemo(
    () => buildCartRows(goods, cart.items),
    [goods, cart.items],
  );
  const selected = selectedRows(rows, deselected);
  const sum = totals(selected);
  const allSelected = rows.length > 0 && selected.length === rows.length;

  useEffect(() => {
    if (status !== 'ready') {
      return;
    }
    const known = new Set(goods.map((g) => g.id));
    const stale = Object.keys(cart.items)
      .map(Number)
      .filter((id) => !known.has(id));
    if (stale.length > 0) {
      cart.removeMany(stale);
    }
  }, [status, goods, cart]);

  function toggleOne(id) {
    setFormError('');
    setDeselected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleAll() {
    setFormError('');
    setDeselected(
      allSelected ? new Set(rows.map((r) => r.good.id)) : new Set(),
    );
  }

  function askRemoveOne(row) {
    setConfirm({
      ids: [row.good.id],
      text: `Вы действительно хотите удалить ${lowerFirst(row.good.name)}?`,
    });
  }

  function askRemoveSelected() {
    const text = allSelected
      ? 'Вы действительно хотите удалить все товары из корзины?'
      : `Вы действительно хотите удалить выбранные товары (${selected.length})?`;
    setConfirm({ids: selected.map((r) => r.good.id), text});
  }

  function changeQty(row, next) {
    if (next < 1) {
      askRemoveOne(row);
    } else {
      cart.setQty(row.good.id, next);
    }
  }

  async function handleSubmit(values) {
    if (submitting) {
      return;
    }
    if (selected.length === 0) {
      setFormError('Выберите хотя бы один товар для заказа');
      return;
    }
    setFormError('');
    setSubmitting(true);
    try {
      const order = await api.createOrder(buildOrderPayload(values, selected));
      cart.removeMany(selected.map((r) => r.good.id));
      setDeselected(new Set());
      setSuccess(order);
    } catch (err) {
      if (err.status === 401) {
        await logout();
        return;
      }
      setFailure(
        err.status === 422
          ? 'Не удалось оформить заказ: проверьте данные формы и попробуйте ещё раз'
          : 'Не удалось оформить заказ. Попробуйте ещё раз позже',
      );
    } finally {
      setSubmitting(false);
    }
  }

  function renderCartTab() {
    if (status === 'error') {
      return (
        <div className={styles.message}>
          <p>Не удалось загрузить товары</p>
          <button type="button" className={styles.retry} onClick={reload}>
            Повторить
          </button>
        </div>
      );
    }
    if (rows.length === 0) {
      return status === 'loading' && cart.count > 0 ? (
        <p className={styles.message}>Загружаем корзину…</p>
      ) : (
        <EmptyCart />
      );
    }
    return (
      <>
        <section className={styles.card} aria-label="Товары в корзине">
          <div className={styles.toolbar}>
            <Checkbox
              label="Выбрать все"
              checked={allSelected}
              onChange={toggleAll}
            />
            {selected.length > 0 && (
              <LinkButton
                icon={<CloseIcon size={12} strokeWidth={3.6} />}
                onClick={askRemoveSelected}
              >
                {allSelected ? 'Удалить все' : 'Удалить выбранные'}
              </LinkButton>
            )}
          </div>
          <ul className={styles.list}>
            {rows.map((row) => (
              <li key={row.good.id} className={styles['list-item']}>
                <CartItem
                  row={row}
                  selected={!deselected.has(row.good.id)}
                  onToggle={() => toggleOne(row.good.id)}
                  onQtyChange={(next) => changeQty(row, next)}
                  onRemove={() => askRemoveOne(row)}
                />
              </li>
            ))}
          </ul>
          <div className={styles.summary} aria-live="polite">
            {selected.length > 0
              ? `${formatItems(sum.count)} на ${formatPrice(sum.sum)}`
              : 'Ничего не выбрано'}
          </div>
        </section>

        <h2 className={styles.heading}>Оформление заказа</h2>
        <OrderForm
          onSubmit={handleSubmit}
          submitting={submitting}
          formError={formError}
        />
      </>
    );
  }

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.tabs}>
        <Tabs
          tabs={TABS}
          value={tab}
          onChange={changeTab}
          label="Разделы корзины"
        />
      </div>

      {tab === 'cart' ? (
        <div
          role="tabpanel"
          id="tab-panel-cart"
          aria-labelledby="tab-cart"
          className={styles.panel}
        >
          {renderCartTab()}
        </div>
      ) : (
        <div
          role="tabpanel"
          id="tab-panel-history"
          aria-labelledby="tab-history"
          className={styles.panel}
        >
          <OrderHistory
            orders={orders.orders}
            status={orders.status}
            onRetry={orders.reload}
          />
        </div>
      )}

      {confirm && (
        <ConfirmDialog
          text={confirm.text}
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            cart.removeMany(confirm.ids);
            setConfirm(null);
          }}
        />
      )}

      {success && (
        <OrderSuccessModal order={success} onClose={() => setSuccess(null)} />
      )}

      {failure && (
        <Modal label="Ошибка" onClose={() => setFailure(null)}>
          <ModalMessage>{failure}</ModalMessage>
          <ModalActions>
            <Button onClick={() => setFailure(null)}>Ок</Button>
          </ModalActions>
        </Modal>
      )}
    </div>
  );
}
