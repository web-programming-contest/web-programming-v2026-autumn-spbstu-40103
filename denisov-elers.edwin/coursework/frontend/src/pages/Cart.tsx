import {useState} from 'react';
import {Link} from 'react-router-dom';
import type {Order} from '../../../shared/types';
import {useStore} from '../context/Store';
import {CartDialogs} from '../features/cart/CartDialogs';
import {CartItems} from '../features/cart/CartItems';
import {CheckoutForm} from '../features/cart/CheckoutForm';
import {OrderHistory} from '../features/cart/OrderHistory';
import {getCartSummary} from '../features/cart/cartSummary';
import {useCheckout} from '../features/cart/useCheckout';
import {asset} from '../utils/assets';

export function Cart() {
  const {goods, items, remove, clear} = useStore();
  const [tab, setTab] = useState<'cart' | 'history'>('cart');
  const [selected, setSelected] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const checkout = useCheckout();
  const {lines, total, count} = getCartSummary(items, goods);
  const selectedIds = selected.filter((id) =>
    items.some((item) => item.productId === id),
  );

  function confirmDeleting() {
    remove(deleting);
    setSelected((old) => old.filter((id) => !deleting.includes(id)));
    setDeleting([]);
  }

  function completeCheckout(order: Order) {
    clear();
    setSelected([]);
    setOrderId(order.id);
  }

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
          <OrderHistory onError={setError} />
        ) : !lines.length ? (
          <section className="empty-cart">
            <img src={asset('empty.png')} width="148" height="134" alt="" />
            <h2>Пока пусто</h2>
            <p>
              Ознакомьтесь с новинками и хитами на главной
              <br />
              или найдите нужное в каталоге
            </p>
            <div className="empty-cart-actions">
              <Link className="primary" to="/catalog">
                Перейти в каталог
              </Link>
              <Link className="empty-cart-home" to="/">
                Главная страница
              </Link>
            </div>
          </section>
        ) : (
          <>
            <CartItems
              lines={lines}
              count={count}
              total={total}
              selected={selectedIds}
              busy={busy}
              onSelected={setSelected}
              onDelete={setDeleting}
            />
            <CheckoutForm
              form={checkout.form}
              errors={checkout.errors}
              busy={busy}
              onFormChange={checkout.setForm}
              onFieldChange={checkout.changeField}
              onSubmit={checkout.submit(
                items,
                total,
                setBusy,
                setError,
                completeCheckout,
              )}
            />
          </>
        )}
        <CartDialogs
          goods={goods}
          deleting={deleting}
          orderId={orderId}
          closeDeleting={() => setDeleting([])}
          confirmDeleting={confirmDeleting}
          closeSuccess={() => setOrderId(null)}
        />
      </div>
    </main>
  );
}
