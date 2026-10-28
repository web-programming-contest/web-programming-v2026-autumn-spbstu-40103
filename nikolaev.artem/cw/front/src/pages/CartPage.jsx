import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {useCart} from '../context/CartContext'
import {api, ApiError} from '../api/client'
import CartItemRow from '../components/CartItemRow'
import CheckoutForm from '../components/CheckoutForm'
import ConfirmDialog from '../components/ConfirmDialog'
import MessageDialog from '../components/MessageDialog'
import {Checkbox} from '../components/Checkbox'
import {CrossIcon} from '../components/Icons'
import emptyCart from '../assets/icons/empty-cart.svg'
import smile from '../assets/icons/smile.svg'
import OrderHistory from '../components/OrderHistory'
import {formatPrice, pluralize} from '../utils/format'
import './CartPage.css'

export default function CartPage() {
  const {items, setQuantity, removeItems} = useCart();

  const [activeTab, setActiveTab] = useState('cart');
  const [checkedIds, setCheckedIds] = useState(
    () => new Set(items.map((i) => i.goodId)),
  );
  const [pendingDeleteIds, setPendingDeleteIds] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverFieldErrors, setServerFieldErrors] = useState({});
  const [orderResult, setOrderResult] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const [orders, setOrders] = useState([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  useEffect(() => {
    setCheckedIds((prev) => {
      const validIds = new Set(items.map((i) => i.goodId));
      const next = new Set([...prev].filter((id) => validIds.has(id)));
      items.forEach((i) => {
        if (!prev.has(i.goodId)) {
          next.add(i.goodId);
        }
      });
      return next;
    });
  }, [items]);

  useEffect(() => {
    if (activeTab !== 'history' || ordersLoaded) {
      return;
    }
    api
      .getOrders()
      .then((data) => setOrders(data.items || []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoaded(true));
  }, [activeTab, ordersLoaded]);

  const allChecked =
    items.length > 0 && items.every((i) => checkedIds.has(i.goodId));

  const toggleAll = () => {
    if (allChecked) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(items.map((i) => i.goodId)));
    }
  };

  const toggleOne = (goodId) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(goodId)) {
        next.delete(goodId);
      } else {
        next.add(goodId);
      }
      return next;
    });
  };

  const checkedItems = items.filter((i) => checkedIds.has(i.goodId));
  const checkedCount = checkedItems.reduce((sum, i) => sum + i.quantity, 0);
  const checkedTotal = checkedItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );

  const confirmDelete = (ids) => setPendingDeleteIds(ids);

  const handleConfirmDelete = () => {
    removeItems(pendingDeleteIds);
    setPendingDeleteIds(null);
  };

  const handleCheckout = async (formValues) => {
    setSubmitError('');
    setServerFieldErrors({});

    if (checkedItems.length === 0) {
      setSubmitError('Выберите товары для оформления заказа');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formValues,
        items: checkedItems.map((i) => ({
          goodId: i.goodId,
          quantity: i.quantity,
        })),
      };
      const order = await api.createOrder(payload);
      removeItems(checkedItems.map((i) => i.goodId));
      setOrderResult(order);
      setOrdersLoaded(false);
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        if (err.body?.fields) {
          setServerFieldErrors(err.body.fields);
        } else {
          setSubmitError(
            err.body?.message || 'Проверьте правильность заполнения полей',
          );
        }
      } else {
        setSubmitError('Не удалось оформить заказ. Попробуйте ещё раз.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-page__tabs">
        <div className="tabs" role="tablist">
          <button
            type="button"
            role="tab"
            className={`tabs__item ${activeTab === 'cart' ? 'tabs__item--active' : ''}`}
            onClick={() => setActiveTab('cart')}
          >
            Корзина
          </button>
          <button
            type="button"
            role="tab"
            className={`tabs__item ${activeTab === 'history' ? 'tabs__item--active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            История заказов
          </button>
        </div>
      </div>

      {activeTab === 'history' && (
        <div className="cart-page__history">
          <OrderHistory orders={orders} />
        </div>
      )}

      {activeTab === 'cart' && (
        <>
          {items.length === 0 ? (
            <div className="cart-empty">
              <img className="cart-empty__icon" src={emptyCart} alt="" />
              <h2 className="cart-empty__title">Пока пусто</h2>
              <p className="cart-empty__text">
                Ознакомьтесь с новинками и хитами на главной или найдите нужное
                в каталоге
              </p>
              <div className="cart-empty__actions">
                <Link to="/catalog" className="btn btn--primary">
                  Перейти в каталог
                </Link>
                <Link to="/" className="btn btn--link">
                  Главная страница
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="cart-list">
                <div className="cart-list__header">
                  <Checkbox checked={allChecked} onChange={toggleAll}>
                    Выбрать все
                  </Checkbox>
                  {checkedItems.length > 0 && (
                    <button
                      type="button"
                      className="cart-list__delete-all"
                      onClick={() =>
                        confirmDelete(checkedItems.map((i) => i.goodId))
                      }
                    >
                      <CrossIcon />
                      Удалить все
                    </button>
                  )}
                </div>

                {items.map((item) => (
                  <CartItemRow
                    key={item.goodId}
                    item={item}
                    checked={checkedIds.has(item.goodId)}
                    onToggle={() => toggleOne(item.goodId)}
                    onQuantityChange={(next) => setQuantity(item.goodId, next)}
                    onRemove={() => confirmDelete([item.goodId])}
                  />
                ))}

                <div className="cart-list__summary">
                  {checkedCount}{' '}
                  {pluralize(checkedCount, ['товар', 'товара', 'товаров'])} на{' '}
                  {formatPrice(checkedTotal)} ₽
                </div>
              </div>

              <div className="cart-checkout">
                <h2 className="cart-checkout__title">Оформление заказа</h2>
                {submitError && (
                  <div className="cart-checkout__error">{submitError}</div>
                )}
                <CheckoutForm
                  onSubmit={handleCheckout}
                  isSubmitting={isSubmitting}
                  serverFieldErrors={serverFieldErrors}
                />
              </div>
            </>
          )}
        </>
      )}

      {pendingDeleteIds && (
        <ConfirmDialog
          message={
            pendingDeleteIds.length === 1
              ? `Вы действительно хотите удалить ${
                  items.find((i) => i.goodId === pendingDeleteIds[0])?.title ??
                  'товар'
                }`
              : `Вы действительно хотите удалить выбранные товары (${pendingDeleteIds.length})`
          }
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDeleteIds(null)}
        />
      )}

      {orderResult && (
        <MessageDialog
          icon={smile}
          title="Спасибо, ваш заказ успешно оформлен"
          onClose={() => setOrderResult(null)}
        >
          <p>Номер заказа {orderResult.orderNumber}.</p>
          <p>
            Мы свяжемся с вами в течение 10 минут, чтобы уточнить удобное для
            вас время доставки
          </p>
        </MessageDialog>
      )}
    </div>
  );
}
