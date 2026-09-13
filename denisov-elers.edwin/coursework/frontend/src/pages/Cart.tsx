import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useStore} from '../context/Store';
import {CartDialogs} from '../features/cart/CartDialogs';
import {CartItems} from '../features/cart/CartItems';
import {CheckoutForm} from '../features/cart/CheckoutForm';
import {OrderHistory} from '../features/cart/OrderHistory';
import {getCartSummary} from '../features/cart/cartSummary';
import {useCheckout} from '../features/cart/useCheckout';

export function Cart() {
  const {goods, items, remove, clear} = useStore();
  const [tab, setTab] = useState<'cart' | 'history'>('cart');
  const [selected, setSelected] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
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

  function completeCheckout() {
    clear();
    setSelected([]);
    setSuccess(true);
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
          <section className="panel empty">
            <h2>Ваша корзина пуста</h2>
            <p>Добавьте понравившиеся товары из каталога</p>
            <Link className="primary" to="/catalog">
              Перейти в каталог
            </Link>
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
          success={success}
          closeDeleting={() => setDeleting([])}
          confirmDeleting={confirmDeleting}
          closeSuccess={() => setSuccess(false)}
          showHistory={() => {
            setSuccess(false);
            setTab('history');
          }}
        />
      </div>
    </main>
  );
}
