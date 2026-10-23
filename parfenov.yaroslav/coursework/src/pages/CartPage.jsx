import {useEffect, useMemo, useState} from 'react';
import {Link} from 'react-router-dom';
import {api} from '../api.js';
import Modal from '../components/Modal.jsx';
import QuantityControl from '../components/QuantityControl.jsx';
import {money} from '../components/ProductCard.jsx';
import {useStore} from '../context/StoreContext.jsx';

function plural(number, words) {
  const value = Math.abs(number) % 100;
  const last = value % 10;
  if (value > 10 && value < 20) return words[2];
  if (last === 1) return words[0];
  if (last > 1 && last < 5) return words[1];
  return words[2];
}

export default function CartPage() {
  const {goods, token, cart, cartCount, removeItems, clearCart} = useStore();
  const [tab, setTab] = useState('cart');
  const [selected, setSelected] = useState([]);
  const [deleteIds, setDeleteIds] = useState([]);
  const [orders, setOrders] = useState(null);
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    email: '',
    phone: '',
    delivery: 'pickup',
    address: '',
    payment: 'card',
    giftWrap: false,
  });

  const items = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, quantity]) => ({
          good: goods.find((item) => item.id === Number(id)),
          quantity,
        }))
        .filter((item) => item.good),
    [cart, goods],
  );
  const total = items.reduce(
    (sum, item) => sum + item.good.price * item.quantity,
    0,
  );
  const allSelected = items.length > 0 && selected.length === items.length;

  useEffect(() => {
    if (tab !== 'history' || orders !== null) return;
    api('/orders', {token})
      .then(setOrders)
      .catch(() => setOrders([]));
  }, [tab, orders, token]);

  const change = (event) => {
    const {name, value, type, checked} = event.target;
    setForm({...form, [name]: type === 'checkbox' ? checked : value});
  };

  function toggleSelected(id) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  }

  async function submitOrder(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!/^\+?[\d\s()\-]{7,20}$/.test(form.phone))
      nextErrors.phone = 'Введите корректный номер телефона';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      nextErrors.email = 'Проверьте электронную почту';
    if (form.delivery === 'delivery' && !form.address.trim())
      nextErrors.address = 'Укажите адрес доставки';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSending(true);
    setOrderError('');
    try {
      await api('/orders', {
        method: 'POST',
        token,
        body: JSON.stringify({
          ...form,
          items: items.map(({good, quantity}) => ({id: good.id, quantity})),
        }),
      });
      clearCart();
      setSelected([]);
      setOrders(null);
      setSuccess(true);
    } catch (error) {
      setOrderError(error.message);
    } finally {
      setSending(false);
    }
  }

  function confirmDelete() {
    removeItems(deleteIds);
    setSelected((current) => current.filter((id) => !deleteIds.includes(id)));
    setDeleteIds([]);
  }

  return (
    <section className="cart-page container">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Личный кабинет</span>
          <h1>Ваши покупки</h1>
        </div>
      </div>
      <div className="tabs">
        <button
          className={tab === 'cart' ? 'active' : ''}
          onClick={() => setTab('cart')}
        >
          Корзина <span>{cartCount}</span>
        </button>
        <button
          className={tab === 'history' ? 'active' : ''}
          onClick={() => {
            setTab('history');
            setSuccess(false);
          }}
        >
          История заказов
        </button>
      </div>

      {tab === 'history' ? (
        <OrderHistory orders={orders} />
      ) : (
        <>
          {success && (
            <div className="success-banner">
              <span>✓</span>
              <div>
                <strong>Спасибо, ваш заказ успешно оформлен</strong>
                <p>Он появился в истории покупок.</p>
              </div>
            </div>
          )}
          {items.length === 0 ? (
            <div className="empty-state cart-empty">
              <div className="state-icon">🛒</div>
              <h2>В корзине пока пусто</h2>
              <p>Найдите нужное в каталоге.</p>
              <Link className="button" to="/catalog">
                Перейти в каталог
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-list-toolbar">
                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() =>
                      setSelected(
                        allSelected ? [] : items.map((item) => item.good.id),
                      )
                    }
                  />
                  <span>Выбрать все</span>
                </label>
                <button
                  disabled={!selected.length}
                  onClick={() => setDeleteIds(selected)}
                >
                  Удалить выбранные
                </button>
              </div>
              <div className="cart-list">
                {items.map(({good, quantity}) => (
                  <article className="cart-item" key={good.id}>
                    <label className="cart-check check-row">
                      <input
                        type="checkbox"
                        checked={selected.includes(good.id)}
                        onChange={() => toggleSelected(good.id)}
                      />
                    </label>
                    <div className="cart-image">
                      <img
                        className="product-image"
                        src={`/assets/goods/image_${good.id}.png`}
                        alt={good.name}
                      />
                    </div>
                    <div className="cart-product">
                      <h3>{good.name}</h3>
                      <p>
                        {good.category} · {good.color}
                      </p>
                    </div>
                    <QuantityControl goodId={good.id} />
                    <strong className="cart-price">
                      {money.format(good.price * quantity)}
                    </strong>
                    <button
                      className="delete-button"
                      onClick={() => setDeleteIds([good.id])}
                    >
                      ×
                    </button>
                  </article>
                ))}
              </div>
              <section className="checkout-section">
                <div className="checkout-copy">
                  <span className="eyebrow">Последний шаг</span>
                  <h2>Оформление заказа</h2>
                  <p>Заполните контакты и выберите получение.</p>
                  <div className="order-total">
                    <span>Итого</span>
                    <strong>{money.format(total)}</strong>
                    <small>
                      {cartCount}{' '}
                      {plural(cartCount, ['товар', 'товара', 'товаров'])}
                    </small>
                  </div>
                </div>
                <form
                  className="checkout-form"
                  onSubmit={submitOrder}
                  noValidate
                >
                  {orderError && <p className="form-alert">{orderError}</p>}
                  <div className="form-grid">
                    <Field
                      label="Электронная почта"
                      name="email"
                      value={form.email}
                      onChange={change}
                      error={errors.email}
                    />
                    <Field
                      label="Номер телефона *"
                      name="phone"
                      value={form.phone}
                      onChange={change}
                      error={errors.phone}
                    />
                  </div>
                  <fieldset className="choice-field">
                    <legend>Получение *</legend>
                    <label>
                      <input
                        type="radio"
                        name="delivery"
                        value="pickup"
                        checked={form.delivery === 'pickup'}
                        onChange={change}
                      />
                      <span>Самовывоз</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="delivery"
                        value="delivery"
                        checked={form.delivery === 'delivery'}
                        onChange={change}
                      />
                      <span>Доставка</span>
                    </label>
                  </fieldset>
                  {form.delivery === 'delivery' && (
                    <Field
                      label="Адрес доставки *"
                      name="address"
                      value={form.address}
                      onChange={change}
                      error={errors.address}
                    />
                  )}
                  <label className="field">
                    <span>Способ оплаты</span>
                    <select
                      name="payment"
                      value={form.payment}
                      onChange={change}
                    >
                      <option value="card">По карте</option>
                      <option value="cash">Наличными</option>
                    </select>
                  </label>
                  <label className="check-row gift-check">
                    <input
                      type="checkbox"
                      name="giftWrap"
                      checked={form.giftWrap}
                      onChange={change}
                    />
                    <span>Нужна подарочная упаковка</span>
                  </label>
                  <button className="button full" disabled={sending}>
                    {sending
                      ? 'Оформляем…'
                      : `Оформить заказ · ${money.format(total)}`}
                  </button>
                </form>
              </section>
            </>
          )}
        </>
      )}

      {deleteIds.length > 0 && (
        <Modal onClose={() => setDeleteIds([])} small>
          <div className="confirm-modal">
            <div className="confirm-icon">?</div>
            <h2>Удалить товары?</h2>
            <p>Действие изменит вашу корзину.</p>
            <div className="confirm-actions">
              <button
                className="button button-secondary"
                onClick={() => setDeleteIds([])}
              >
                Отмена
              </button>
              <button className="button danger" onClick={confirmDelete}>
                Удалить
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}

function Field({label, name, value, onChange, error}) {
  return (
    <label className={`field ${error ? 'invalid' : ''}`}>
      <span>{label}</span>
      <input name={name} value={value} onChange={onChange} />
      <small className="field-error">{error}</small>
    </label>
  );
}

function OrderHistory({orders}) {
  if (orders === null)
    return (
      <div className="orders-loading">
        <div className="loader" />
        <p>Загружаем историю…</p>
      </div>
    );
  if (!orders.length)
    return (
      <div className="empty-state">
        <h2>Заказов пока нет</h2>
        <p>Оформленные заказы появятся здесь.</p>
      </div>
    );
  return (
    <div className="orders-list">
      {orders.map((order) => (
        <article className="order-row" key={order.id}>
          <div>
            <span>Заказ № {order.id}</span>
            <strong>
              {new Date(order.createdAt).toLocaleDateString('ru-RU')}
            </strong>
          </div>
          <div>
            <span>Количество</span>
            <strong>{order.itemCount} шт.</strong>
          </div>
          <div>
            <span>Стоимость</span>
            <strong>{money.format(order.total)}</strong>
          </div>
          <span className="order-status">Оформлен</span>
        </article>
      ))}
    </div>
  );
}
