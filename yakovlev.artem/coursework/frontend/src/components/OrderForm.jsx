import {useState} from 'react';

const INITIAL = {
  phone: '',
  email: '',
  delivery: 'pickup',
  address: '',
  payment: '',
  packaging: false,
};

export default function OrderForm({onSubmit, submitting}) {
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});

  const update = (patch) => {
    setValues((v) => ({...v, ...patch}));
    setErrors((e) => {
      const next = {...e};
      Object.keys(patch).forEach((key) => delete next[key]);
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!values.phone.trim()) {
      nextErrors.phone = 'Заполните обязательное поле';
    }
    if (values.delivery === 'courier' && !values.address.trim()) {
      nextErrors.address = 'Заполните обязательное поле';
    }
    if (!values.payment) {
      nextErrors.payment = 'Выберите способ оплаты';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    onSubmit(values);
  };

  return (
    <form className="order-form" onSubmit={handleSubmit} noValidate>
      <div className="order-form-row">
        <label className={`field${errors.phone ? ' field-error' : ''}`}>
          <span className="field-label">
            Телефон<span className="field-required">*</span>
          </span>
          <input
            type="tel"
            name="phone"
            placeholder="+7 (-_) -_--"
            value={values.phone}
            onChange={(e) => update({phone: e.target.value})}
          />
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </label>
        <label className="field">
          <span className="field-label">E-mail</span>
          <input
            type="email"
            name="email"
            placeholder="example@mail.ru"
            value={values.email}
            onChange={(e) => update({email: e.target.value})}
          />
        </label>
      </div>

      <div className="order-form-row order-form-row-radios">
        <label className="radio">
          <input
            type="radio"
            name="delivery"
            checked={values.delivery === 'pickup'}
            onChange={() => update({delivery: 'pickup'})}
          />
          <span className="radio-dot" />
          Самовывоз
        </label>
        <label className="radio">
          <input
            type="radio"
            name="delivery"
            checked={values.delivery === 'courier'}
            onChange={() => update({delivery: 'courier'})}
          />
          <span className="radio-dot" />
          Доставка
        </label>
      </div>

      {values.delivery === 'courier' && (
        <div className="order-form-row">
          <label
            className={`field field-wide${errors.address ? ' field-error' : ''}`}
          >
            <span className="field-label">
              Адрес доставки<span className="field-required">*</span>
            </span>
            <input
              type="text"
              name="address"
              placeholder="Город, улица, дом, квартира"
              value={values.address}
              onChange={(e) => update({address: e.target.value})}
            />
            {errors.address && (
              <span className="field-error">{errors.address}</span>
            )}
          </label>
        </div>
      )}

      <div className="order-form-row">
        <label
          className={`field field-select${errors.payment ? ' field-error' : ''}`}
        >
          <span className="field-label">Способ оплаты</span>
          <select
            name="payment"
            value={values.payment}
            onChange={(e) => update({payment: e.target.value})}
          >
            <option value="" disabled>
              Не выбрано
            </option>
            <option value="card">По карте</option>
            <option value="cash">Наличными</option>
          </select>
          {errors.payment && (
            <span className="field-error">{errors.payment}</span>
          )}
        </label>
      </div>

      <div className="order-form-row">
        <label className="checkbox">
          <input
            type="checkbox"
            name="packaging"
            checked={values.packaging}
            onChange={(e) => update({packaging: e.target.checked})}
          />
          <span className="checkbox-box" />
          <span className="checkbox-label">Нужна упаковка</span>
        </label>
      </div>

      <button
        type="submit"
        className="btn btn-blue order-form-submit"
        disabled={submitting}
      >
        {submitting ? 'Оформляем…' : 'Оформить заказ'}
      </button>
    </form>
  );
}
