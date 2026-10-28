import {useState} from 'react';
import {PAYMENT_OPTIONS} from '../utils/constants';
import {
  formatPhoneInput,
  isCompletePhone,
  isValidEmail,
} from '../utils/validation';
import {Checkbox, Radio} from './Checkbox';
import './CheckoutForm.css';

const EMPTY_FORM = {
  phone: '',
  email: '',
  deliveryType: 'pickup',
  address: '',
  paymentType: '',
  needPackage: true,
};
const REQUIRED = 'Заполните обязательное поле';

export default function CheckoutForm({
  onSubmit,
  isSubmitting,
  serverFieldErrors = {},
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const setField = (name, value) => {
    setForm((prev) => ({...prev, [name]: value}));
    setErrors((prev) => ({...prev, [name]: undefined}));
  };

  const validate = () => {
    const next = {};
    if (!form.phone.trim()) {
      next.phone = REQUIRED;
    } else if (!isCompletePhone(form.phone)) {
      next.phone = 'Введите номер телефона полностью';
    }
    if (form.email.trim() && !isValidEmail(form.email)) {
      next.email = 'Введите корректный e-mail';
    }
    if (form.deliveryType === 'delivery' && !form.address.trim()) {
      next.address = REQUIRED;
    }
    if (!form.paymentType) {
      next.paymentType = 'Выберите способ оплаты';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    onSubmit({
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      deliveryType: form.deliveryType,
      address:
        form.deliveryType === 'delivery' ? form.address.trim() : undefined,
      paymentType: form.paymentType || undefined,
      needPackage: form.needPackage,
    });
  };

  const err = {...serverFieldErrors, ...errors};
  const cls = (name) => `field ${err[name] ? 'field--error' : ''}`;

  return (
    <form className="checkout-form" onSubmit={handleSubmit} noValidate>
      <div className="checkout-form__row">
        <div className={cls('phone')}>
          <label className="field__label" htmlFor="phone">
            Телефон
          </label>
          <input
            id="phone"
            className="field__input"
            type="tel"
            inputMode="numeric"
            value={form.phone}
            onChange={(e) =>
              setField('phone', formatPhoneInput(e.target.value, form.phone))
            }
            placeholder="+7 (___) ___-__-__"
            maxLength={18}
          />
          <span className="field__star">*</span>
          {err.phone && <span className="field__error">{err.phone}</span>}
        </div>

        <div className={cls('email')}>
          <label className="field__label" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            className="field__input"
            type="email"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
          />
          {err.email && <span className="field__error">{err.email}</span>}
        </div>
      </div>

      <div className="checkout-form__radios">
        <Radio
          name="deliveryType"
          checked={form.deliveryType === 'pickup'}
          onChange={() => setField('deliveryType', 'pickup')}
        >
          Самовывоз
        </Radio>
        <Radio
          name="deliveryType"
          checked={form.deliveryType === 'delivery'}
          onChange={() => setField('deliveryType', 'delivery')}
        >
          Доставка
        </Radio>
      </div>

      {form.deliveryType === 'delivery' && (
        <div className={`${cls('address')} checkout-form__address`}>
          <label className="field__label" htmlFor="address">
            Адрес доставки
          </label>
          <input
            id="address"
            className="field__input"
            value={form.address}
            onChange={(e) => setField('address', e.target.value)}
          />
          <span className="field__star">*</span>
          {err.address && <span className="field__error">{err.address}</span>}
        </div>
      )}

      <div className={`${cls('paymentType')} checkout-form__payment`}>
        <label className="field__label" htmlFor="paymentType">
          Способ оплаты
        </label>
        <select
          id="paymentType"
          className={`field__select ${form.paymentType ? '' : 'field__select--empty'}`}
          value={form.paymentType}
          onChange={(e) => setField('paymentType', e.target.value)}
        >
          <option value="">Не выбрано</option>
          {PAYMENT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {err.paymentType && (
          <span className="field__error">{err.paymentType}</span>
        )}
      </div>

      <Checkbox
        checked={form.needPackage}
        onChange={(e) => setField('needPackage', e.target.checked)}
      >
        Нужна упаковка
      </Checkbox>

      <div>
        <button
          type="submit"
          className="btn btn--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Оформляем...' : 'Оформить заказ'}
        </button>
      </div>
    </form>
  );
}
