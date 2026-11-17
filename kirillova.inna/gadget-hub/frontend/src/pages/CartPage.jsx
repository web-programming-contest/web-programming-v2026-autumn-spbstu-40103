import {useEffect, useMemo, useState} from 'react';
import {Link} from 'react-router-dom';
import {useCart} from '../hooks/CartContext.jsx';
import {api, ApiError} from '../api/client.js';
import QuantityStepper from '../components/QuantityStepper.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

function CartPage() {
  const [activeTab, setActiveTab] = useState('cart');

  return (
    <div className="cart-page">
      <div className="container">
        <div className="tabs">
          <button
            type="button"
            className={`tabs__tab ${activeTab === 'cart' ? 'tabs__tab--active' : ''}`}
            onClick={() => setActiveTab('cart')}
          >
            Корзина
          </button>
          <button
            type="button"
            className={`tabs__tab ${activeTab === 'history' ? 'tabs__tab--active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            История заказов
          </button>
        </div>

        {activeTab === 'cart' ? <CartTab /> : <HistoryTab />}
      </div>
    </div>
  );
}

function CartTab() {
  const {items, increment, decrement, remove, removeMany, clear} = useCart();
  const productIds = useMemo(() => Object.keys(items).map(Number), [items]);
  const productIdsKey = productIds.join(',');

  const [products, setProducts] = useState({});
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [pendingDelete, setPendingDelete] = useState(null);
  const [completedOrderId, setCompletedOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(productIds.length > 0);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (productIds.length === 0) {
      setProducts({});
      setIsLoading(false);
      return undefined;
    }
    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);
    api
      .getGoods({pageSize: 1000})
      .then((data) => {
        if (cancelled) {
          return;
        }
        const byId = {};
        data.items.forEach((product) => {
          byId[product.id] = product;
        });
        setProducts(byId);
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(
            'Не удалось загрузить товары корзины. Проверьте, что бекенд запущен.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [productIdsKey]);

  const cartLines = productIds
    .map((id) => {
      const product = products[id];
      if (!product) {
        return null;
      }
      return {id, product, quantity: items[id]};
    })
    .filter(Boolean);

  const totalCount = cartLines.reduce((sum, line) => sum + line.quantity, 0);
  const totalPrice = cartLines.reduce(
    (sum, line) => sum + line.quantity * line.product.price,
    0,
  );

  function toggleSelected(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleSelectAll() {
    setSelectedIds((prev) =>
      prev.size === cartLines.length
        ? new Set()
        : new Set(cartLines.map((line) => line.id)),
    );
  }

  function confirmDelete() {
    if (pendingDelete === 'all') {
      removeMany([...selectedIds]);
      setSelectedIds(new Set());
    } else if (pendingDelete !== null) {
      remove(pendingDelete);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(pendingDelete);
        return next;
      });
    }
    setPendingDelete(null);
  }

  const deleteMessage =
    pendingDelete === 'all'
      ? `Вы уверены, что хотите удалить выбранные товары (${selectedIds.size})?`
      : `Вы уверены, что хотите удалить «${products[pendingDelete]?.name ?? 'товар'}»?`;

  if (completedOrderId !== null) {
    return (
      <OrderSuccessNotice
        orderId={completedOrderId}
        onClose={() => setCompletedOrderId(null)}
      />
    );
  }

  if (cartLines.length === 0 && isLoading) {
    return <p className="cart-page__status">Загрузка…</p>;
  }

  if (cartLines.length === 0 && loadError) {
    return (
      <p className="cart-page__status cart-page__status--error">{loadError}</p>
    );
  }

  if (cartLines.length === 0) {
    return (
      <div className="cart-empty">
        <img
          src="/images/cart-empty.svg"
          alt=""
          className="cart-empty__illustration"
        />
        <h2 className="cart-empty__title">Пока пусто</h2>
        <p className="cart-empty__text">
          Ознакомьтесь с новинками и хитами на главной или найдите нужное в
          каталоге
        </p>
        <div className="cart-empty__actions">
          <Link to="/catalog" className="button button--primary">
            Перейти в каталог
          </Link>
          <Link to="/" className="button button--link">
            Главная страница
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="cart-list">
        <div className="cart-list__header">
          <label className="filters__checkbox">
            <input
              type="checkbox"
              checked={
                selectedIds.size === cartLines.length && cartLines.length > 0
              }
              onChange={toggleSelectAll}
            />
            Выбрать все
          </label>
          {selectedIds.size > 0 && (
            <button
              type="button"
              className="cart-list__delete-all"
              onClick={() => setPendingDelete('all')}
            >
              × Удалить все
            </button>
          )}
        </div>

        {cartLines.map((line) => (
          <div className="cart-line" key={line.id}>
            <label className="cart-line__checkbox">
              <input
                type="checkbox"
                checked={selectedIds.has(line.id)}
                onChange={() => toggleSelected(line.id)}
              />
            </label>
            <img
              src={line.product.image}
              alt={line.product.name}
              className="cart-line__image"
            />
            <p className="cart-line__name">{line.product.name}</p>
            <QuantityStepper
              quantity={line.quantity}
              onIncrement={() => increment(line.id)}
              onDecrement={() => decrement(line.id)}
              size="sm"
            />
            <div className="cart-line__price">
              {(line.quantity * line.product.price).toLocaleString('ru-RU')} ₽
            </div>
            <button
              type="button"
              className="cart-line__remove"
              onClick={() => setPendingDelete(line.id)}
            >
              × Удалить
            </button>
          </div>
        ))}

        <div className="cart-list__total">
          {totalCount} {pluralizeItems(totalCount)} на{' '}
          {totalPrice.toLocaleString('ru-RU')} ₽
        </div>
      </div>

      <CheckoutForm
        cartLines={cartLines}
        onOrderCreated={(order) => {
          clear();
          setCompletedOrderId(order.id);
        }}
      />

      <ConfirmDialog
        isOpen={pendingDelete !== null}
        message={deleteMessage}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}

function pluralizeItems(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return 'товар';
  }
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) {
    return 'товара';
  }
  return 'товаров';
}

function CheckoutForm({cartLines, onOrderCreated}) {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryType, setDeliveryType] = useState('pickup');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [needsPackaging, setNeedsPackaging] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError(null);

    const errors = {};
    if (!phone.trim()) {
      errors.phone = 'Заполните обязательное поле';
    } else if (phone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Введите корректный номер телефона';
    }
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) {
      errors.email = 'Введите корректную почту';
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      errors.address = 'Заполните обязательное поле';
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await api.createOrder({
        items: cartLines.map((line) => ({
          productId: line.id,
          quantity: line.quantity,
        })),
        phone,
        email: email || null,
        deliveryType,
        address: deliveryType === 'delivery' ? address : null,
        paymentMethod,
        needsPackaging,
      });
      onOrderCreated(created);
    } catch (error) {
      setServerError(
        error instanceof ApiError ? error.message : 'Не удалось оформить заказ',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="checkout">
      <h2 className="checkout__title">Оформление заказа</h2>

      {serverError && (
        <div className="checkout__server-error">{serverError}</div>
      )}

      <form className="checkout-form" onSubmit={handleSubmit} noValidate>
        <div className="checkout-form__row">
          <div className="form-field form-field--required">
            <label htmlFor="phone">Телефон</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className={fieldErrors.phone ? 'input--error' : ''}
            />
            {fieldErrors.phone && (
              <span className="form-field__error">{fieldErrors.phone}</span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={fieldErrors.email ? 'input--error' : ''}
            />
            {fieldErrors.email && (
              <span className="form-field__error">{fieldErrors.email}</span>
            )}
          </div>
        </div>

        <div className="checkout-form__row checkout-form__row--radio">
          <label className="radio-option">
            <input
              type="radio"
              name="deliveryType"
              checked={deliveryType === 'pickup'}
              onChange={() => setDeliveryType('pickup')}
            />
            Самовывоз
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="deliveryType"
              checked={deliveryType === 'delivery'}
              onChange={() => setDeliveryType('delivery')}
            />
            Доставка
          </label>
        </div>

        {deliveryType === 'delivery' && (
          <div className="form-field form-field--required">
            <label htmlFor="address">Адрес доставки</label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className={fieldErrors.address ? 'input--error' : ''}
            />
            {fieldErrors.address && (
              <span className="form-field__error">{fieldErrors.address}</span>
            )}
          </div>
        )}

        <div className="form-field">
          <label htmlFor="paymentMethod">Способ оплаты</label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value)}
          >
            <option value="card">По карте</option>
            <option value="cash">Наличными</option>
          </select>
        </div>

        <label className="filters__checkbox">
          <input
            type="checkbox"
            checked={needsPackaging}
            onChange={(event) => setNeedsPackaging(event.target.checked)}
          />
          Нужна упаковка
        </label>

        <button
          type="submit"
          className="button button--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Оформляем…' : 'Оформить заказ'}
        </button>
      </form>
    </section>
  );
}

function OrderSuccessNotice({orderId, onClose}) {
  return (
    <div className="modal-overlay modal-overlay--open">
      <div
        className="confirm-dialog confirm-dialog--success"
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="confirm-dialog__close"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>
        <img
          src="/images/success.svg"
          alt=""
          className="confirm-dialog__image"
        />
        <h2 className="confirm-dialog__title">
          Спасибо, ваш заказ успешно оформлен
        </h2>
        <p className="confirm-dialog__message">Номер заказа {orderId}.</p>
        <p className="confirm-dialog__message">
          Мы свяжемся с вами в течение 10 минут, чтобы уточнить удобное для вас
          время.
        </p>
        <div className="confirm-dialog__actions">
          <button
            type="button"
            className="button button--primary"
            onClick={onClose}
          >
            Ок
          </button>
        </div>
      </div>
    </div>
  );
}

function HistoryTab() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .getOrders()
      .then((data) => {
        if (!cancelled) {
          setOrders(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Не удалось загрузить историю заказов');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return <p className="cart-page__status">Загрузка…</p>;
  }
  if (error) {
    return (
      <p className="cart-page__status cart-page__status--error">{error}</p>
    );
  }
  if (orders.length === 0) {
    return <p className="cart-page__status">Заказов пока нет</p>;
  }

  return (
    <ul className="order-history">
      {orders.map((order) => {
        const itemsCount = order.items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        const date = new Date(order.createdAt).toLocaleDateString('ru-RU');
        return (
          <li className="order-history__row" key={order.id}>
            <span>
              № {order.id} от {date}
            </span>
            <span>
              {itemsCount} {pluralizeItems(itemsCount)}
            </span>
            <span>{order.totalPrice.toLocaleString('ru-RU')} ₽</span>
          </li>
        );
      })}
    </ul>
  );
}

export default CartPage;
