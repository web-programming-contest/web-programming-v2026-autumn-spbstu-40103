import {useEffect, useMemo, useState} from 'react';
import {Link} from 'react-router-dom';
import {api, fetchGoods} from '../api.js';
import {useCart} from '../context/CartContext.jsx';
import CartList, {CartSummary} from '../components/CartList.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import OrderForm from '../components/OrderForm.jsx';
import OrderHistory from '../components/OrderHistory.jsx';
import {formatPrice} from '../format.js';

export default function CartPage() {
  const {items, setQty, remove, removeMany, clear} = useCart();
  const [goods, setGoods] = useState([]);
  const [tab, setTab] = useState('cart');
  const [selected, setSelected] = useState(() => new Set());
  const [confirm, setConfirm] = useState(null);
  const [orders, setOrders] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGoods()
      .then(setGoods)
      .catch(() =>
        setError('Не удалось загрузить товары. Проверьте, что бэкенд запущен.'),
      );
    api
      .orders()
      .then(setOrders)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (tab === 'history') {
      api
        .orders()
        .then(setOrders)
        .catch(() => {});
    }
  }, [tab]);

  const entries = useMemo(
    () =>
      Object.entries(items)
        .map(([id, qty]) => ({
          good: goods.find((g) => g.id === Number(id)),
          qty,
        }))
        .filter((e) => e.good),
    [items, goods],
  );

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = (checked) => {
    setSelected(checked ? new Set(entries.map((e) => e.good.id)) : new Set());
  };

  const confirmDelete = () => {
    if (confirm?.type === 'single') {
      remove(confirm.id);
    }
    if (confirm?.type === 'bulk') {
      removeMany([...selected]);
      setSelected(new Set());
    }
    setConfirm(null);
  };

  const handleOrder = async (values) => {
    setSubmitting(true);
    setError('');
    try {
      const order = await api.createOrder({
        items: entries.map((e) => ({id: e.good.id, qty: e.qty})),
        contact: values,
      });
      clear();
      setSelected(new Set());
      setPlacedOrder(order);
      const fresh = await api.orders();
      setOrders(fresh);
    } catch (err) {
      setError(err.message || 'Не удалось оформить заказ');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmText =
    confirm?.type === 'single'
      ? `Вы действительно хотите удалить ${entries.find((e) => e.good.id === confirm.id)?.good.name}?`
      : 'Вы действительно хотите удалить выбранные товары?';

  return (
    <div className="cart-page">
      <div className="container">
        <div className="tabs">
          <button
            type="button"
            className={`tabs-tab${tab === 'cart' ? ' tabs-tab-active' : ''}`}
            onClick={() => setTab('cart')}
          >
            Корзина
          </button>
          <button
            type="button"
            className={`tabs-tab${tab === 'history' ? ' tabs-tab-active' : ''}`}
            onClick={() => setTab('history')}
          >
            История заказов
          </button>
        </div>

        {tab === 'cart' && placedOrder && (
          <div className="cart-success">
            <h2 className="cart-success-title">
              Спасибо, ваш заказ успешно оформлен!
            </h2>
            <p className="cart-success-text">
              Заказ № {placedOrder.number} на сумму{' '}
              {formatPrice(placedOrder.total)} передан в обработку.
            </p>
            <div className="cart-success-actions">
              <button
                type="button"
                className="btn btn-blue"
                onClick={() => setTab('history')}
              >
                История заказов
              </button>
              <Link to="/catalog" className="btn btn-text-blue">
                Продолжить покупки
              </Link>
            </div>
          </div>
        )}

        {tab === 'cart' && !placedOrder && entries.length === 0 && (
          <div className="cart-empty">
            <img
              className="cart-empty-image"
              src="/images/promo/cart-empty.png"
              alt=""
            />
            <h2 className="cart-empty-title">Пока пусто</h2>
            <p className="cart-empty-text">
              Ознакомьтесь с новинками и хитами на главной
              <br />
              или найдите нужное в каталоге
            </p>
            <div className="cart-empty-actions">
              <Link to="/catalog" className="btn btn-blue">
                Перейти в каталог
              </Link>
              <Link to="/" className="btn btn-text-blue">
                Главная страница
              </Link>
            </div>
          </div>
        )}

        {tab === 'cart' && !placedOrder && entries.length > 0 && (
          <>
            <div className="card">
              <CartList
                entries={entries}
                selected={selected}
                onToggle={toggle}
                onToggleAll={toggleAll}
                onQtyChange={setQty}
                onRemove={(id) => setConfirm({type: 'single', id})}
                onRemoveSelected={() => setConfirm({type: 'bulk'})}
              />
              <CartSummary entries={entries} />
            </div>

            <h2 className="section-title cart-page-checkout-title">
              Оформление заказа
            </h2>
            <div className="card">
              {error && <p className="page-error">{error}</p>}
              <OrderForm onSubmit={handleOrder} submitting={submitting} />
            </div>
          </>
        )}

        {tab === 'history' && (
          <div className="card">
            <OrderHistory orders={orders} />
          </div>
        )}
      </div>

      {confirm && (
        <ConfirmDialog
          text={confirmText}
          onConfirm={confirmDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
