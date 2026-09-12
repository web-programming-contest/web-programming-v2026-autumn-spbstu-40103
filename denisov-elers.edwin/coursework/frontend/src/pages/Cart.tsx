import {useEffect, useState, type FormEvent} from 'react';
import {Link} from 'react-router-dom';
import type {Checkout, Order} from '../../../shared/types';
import {useStore} from '../context/Store';
import {api, money} from '../api';
import {Quantity} from '../components/Product';
import {Modal} from '../components/Modal';

const initial: Checkout = {
  email: '',
  phone: '',
  delivery: 'pickup',
  address: '',
  payment: 'card',
  packaging: false,
};

export function Cart() {
  const {goods, items, remove, clear} = useStore();
  const [tab, setTab] = useState('cart');
  const [selected, setSelected] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<string[]>([]);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const lines = items.flatMap((item) => {
    const product = goods.find((p) => p.id === item.productId);
    return product ? [{...item, product}] : [];
  });
  const total = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const selectedIds = selected.filter((id) =>
    items.some((i) => i.productId === id),
  );

  useEffect(() => {
    if (tab === 'history') {
      setLoading(true);
      setError('');
      api<Order[]>('/orders')
        .then(setOrders)
        .catch((err) => setError(String(err)))
        .finally(() => setLoading(false));
    }
  }, [tab]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const validation: Record<string, string> = {};

    if (!form.phone.trim()) {
      validation.phone = 'Обязательное поле';
    } else if (
      !/^[+\d\s()-]{7,25}$/.test(form.phone) ||
      form.phone.replace(/\D/g, '').length < 7
    ) {
      validation.phone = 'Введите корректный телефон';
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      validation.email = 'Введите корректный email';
    }

    if (form.delivery === 'delivery' && !form.address.trim()) {
      validation.address = 'Обязательное поле';
    }

    setErrors(validation);
    setError('');
    if (Object.keys(validation).length) {
      return;
    }

    setBusy(true);
    try {
      await api<Order>('/orders', {...form, items, total});
      clear();
      setSelected([]);
      setForm(initial);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Не удалось оформить заказ',
      );
    } finally {
      setBusy(false);
    }
  }

  const field = (
    name: 'phone' | 'email' | 'address',
    title: string,
    required = false,
  ) => (
    <label className={`field ${name === 'address' ? 'address-field' : ''}`}>
      {title}
      {required && <span className="required">*</span>}
      <input
        name={name}
        type={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'text'}
        autoComplete={
          name === 'phone'
            ? 'tel'
            : name === 'address'
              ? 'street-address'
              : 'email'
        }
        value={form[name]}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        onChange={(e) => {
          setForm({...form, [name]: e.target.value});
          setErrors((old) => ({...old, [name]: ''}));
        }}
      />
      {errors[name] && (
        <span className="error" id={`${name}-error`}>
          {errors[name]}
        </span>
      )}
    </label>
  );

  return (
    <main className="cart-page">
      <div className="cart-container">
        <h1 className="sr-only">Корзина и история заказов</h1>
        <div className="tabs" role="tablist" aria-label="Заказы">
          <button
            role="tab"
            aria-selected={tab === 'cart'}
            onClick={() => setTab('cart')}
          >
            Корзина
          </button>
          <button
            role="tab"
            aria-selected={tab === 'history'}
            onClick={() => setTab('history')}
          >
            История заказов
          </button>
        </div>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {tab === 'history' ? (
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
                    {order.items.reduce((sum, i) => sum + i.quantity, 0)}
                  </span>
                  <span>{money(order.total)}</span>
                </div>
              ))
            )}
          </section>
        ) : !lines.length ? (
          <section className="panel empty">
            <h2>Ваша корзина пуста</h2>
            <p>Добавьте понравившиеся товары из каталога</p>
            <Link className="primary" to="/catalog">
              Перейти в каталог
            </Link>
          </section>
        ) : (
          <>
            <section className="panel">
              <fieldset disabled={busy} className="cart-items">
                <div className="actions">
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === lines.length}
                      onChange={(e) =>
                        setSelected(
                          e.target.checked ? lines.map((l) => l.productId) : [],
                        )
                      }
                    />
                    Выбрать все
                  </label>
                  <button
                    className="pink"
                    disabled={!selectedIds.length}
                    onClick={() => setDeleting(selectedIds)}
                  >
                    Удалить выбранные
                  </button>
                </div>
                {lines.map((line) => (
                  <div className="cart-row" key={line.productId}>
                    <input
                      type="checkbox"
                      aria-label={`Выбрать ${line.product.name}`}
                      checked={selectedIds.includes(line.productId)}
                      onChange={(e) =>
                        setSelected(
                          e.target.checked
                            ? [...selectedIds, line.productId]
                            : selectedIds.filter((id) => id !== line.productId),
                        )
                      }
                    />
                    <img
                      className="cart-image"
                      src={line.product.image}
                      alt={line.product.name}
                    />
                    <span className="cart-name">{line.product.name}</span>
                    <Quantity product={line.product} />
                    <strong>{money(line.product.price * line.quantity)}</strong>
                    <button
                      className="pink"
                      aria-label={`Удалить ${line.product.name}`}
                      onClick={() => setDeleting([line.productId])}
                    >
                      × Удалить
                    </button>
                  </div>
                ))}
                <p className="cart-total">
                  Товаров: {count} на {money(total)}
                </p>
              </fieldset>
            </section>
            <h2 className="checkout-title">Оформление заказа</h2>
            <form className="panel checkout" onSubmit={submit} noValidate>
              <fieldset disabled={busy}>
                <div className="form-row">
                  {field('phone', 'Телефон', true)}
                  {field('email', 'E-mail')}
                </div>
                <div className="actions delivery">
                  {(['pickup', 'delivery'] as const).map((value) => (
                    <label className="check" key={value}>
                      <input
                        type="radio"
                        name="delivery"
                        checked={form.delivery === value}
                        onChange={() => setForm({...form, delivery: value})}
                      />
                      {value === 'pickup' ? 'Самовывоз' : 'Доставка'}
                    </label>
                  ))}
                </div>
                {form.delivery === 'delivery' &&
                  field('address', 'Адрес доставки', true)}
                <label className="field">
                  Способ оплаты
                  <select
                    value={form.payment}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        payment: e.target.value as Checkout['payment'],
                      })
                    }
                  >
                    <option value="card">По карте</option>
                    <option value="cash">Наличными</option>
                  </select>
                </label>
                <label className="check packaging">
                  <input
                    type="checkbox"
                    checked={form.packaging}
                    onChange={(e) =>
                      setForm({...form, packaging: e.target.checked})
                    }
                  />
                  Нужна упаковка
                </label>
                <button className="primary" disabled={busy}>
                  {busy ? 'Оформляем…' : 'Оформить заказ'}
                </button>
              </fieldset>
            </form>
          </>
        )}
        {deleting.length > 0 && (
          <Modal title="Подтвердите удаление" close={() => setDeleting([])}>
            <h3>
              Вы действительно хотите удалить{' '}
              {deleting.length === 1
                ? goods.find((p) => p.id === deleting[0])?.name
                : `выбранные товары (${deleting.length})`}
              ?
            </h3>
            <div className="actions confirm-actions">
              <button className="pink" onClick={() => setDeleting([])}>
                Отмена
              </button>
              <button
                className="primary"
                onClick={() => {
                  remove(deleting);
                  setSelected((old) =>
                    old.filter((id) => !deleting.includes(id)),
                  );
                  setDeleting([]);
                }}
              >
                Да, удалить
              </button>
            </div>
          </Modal>
        )}
        {success && (
          <Modal title="Заказ оформлен" close={() => setSuccess(false)}>
            <h2>Спасибо, ваш заказ успешно оформлен</h2>
            <button
              className="primary"
              onClick={() => {
                setSuccess(false);
                setTab('history');
              }}
            >
              История заказов
            </button>
          </Modal>
        )}
      </div>
    </main>
  );
}
