import {useState} from 'react';

import CheckBox from '../catalog-page/CheckBox';
import SelectItem from './SelectItem';
import {ProductCart} from '../../components/Structures';
import {Product} from '../../components/Structures';

function CartForm({
  cards,
  setThanks,
  cartItems,
  username,
}: {
  cards: Product[];
  setThanks: (v: string) => void;
  cartItems: ProductCart[];
  username: string;
}) {
  const [delivery, setDelivery] = useState('pickup');
  const [isError, setIsError] = useState('');

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const order_id = new Date().toISOString().replace(/\D/g, '').slice(6, 12);

    const tel = formData.get('tel')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const address = formData.get('address')?.toString() || '';
    const payment = formData.get('payment')?.toString() || '';
    const packaging = formData.get('packaging') === 'on';

    if (cartItems.length === 0) {
      window.scrollTo({top: 0, behavior: 'smooth'});
      return;
    }
    if (!tel) {
      setIsError('empty-tel');
      return;
    }
    if (!email) {
      setIsError('empty-email');
      return;
    }
    if (delivery === 'delivery' && !address) {
      setIsError('empty-address');
      return;
    }
    if (!payment) {
      setIsError('empty-payment');
      return;
    }

    fetch('http://127.0.0.1:8080/orders', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        order_id,
        username,
        tel,
        email,
        address: delivery === 'delivery' ? address : null,
        cart: cartItems.map((i) => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          price: cards.find((c) => c.id === i.id)?.price ?? 0,
        })),
        delivery,
        payment,
        packaging,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          setIsError('server');
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.success) {
          setIsError('');
          setThanks(order_id);
        }
      })
      .catch(() => setIsError('server'));
  }

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="input-template">
          <label htmlFor="tel">Телефон</label>
          <input
            id="tel"
            name="tel"
            type="text"
            autoComplete="tel"
            style={
              isError === 'empty-tel' ? {outline: '1px #FF60C3 solid'} : {}
            }
          />
        </div>

        <div className="input-template">
          <label htmlFor="email" className="star">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="text"
            autoComplete="email"
            style={
              isError === 'empty-email' ? {outline: '1px #FF60C3 solid'} : {}
            }
          />
        </div>
      </div>

      <div className="delivery-group">
        <label className="radio-item">
          <input
            type="radio"
            name="delivery"
            value="pickup"
            checked={delivery === 'pickup'}
            onChange={() => setDelivery('pickup')}
          />
          Самовывоз
        </label>
        <label className="radio-item">
          <input
            type="radio"
            name="delivery"
            value="delivery"
            checked={delivery === 'delivery'}
            onChange={() => setDelivery('delivery')}
          />
          Доставка
        </label>
      </div>

      {delivery === 'delivery' && (
        <div className="input-template delivery">
          <label htmlFor="address" className="star">
            Адрес доставки
          </label>
          <input
            id="address"
            name="address"
            type="text"
            autoComplete="address"
            style={
              isError === 'empty-address' ? {outline: '1px #FF60C3 solid'} : {}
            }
          />
        </div>
      )}

      <SelectItem label="Способ оплаты" name="payment" isError={isError} />

      <CheckBox title="Нужна упаковка" name="packaging" />

      <button className="button-blue-template">
        <span>Оформить заказ</span>
      </button>
    </form>
  );
}

export default CartForm;
