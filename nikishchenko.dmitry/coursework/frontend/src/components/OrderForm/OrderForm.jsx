import {useEffect, useRef, useState} from 'react';
import {EMPTY_ORDER, validateOrder} from '../../cart/orderValidation';
import Button from '../Button/Button';
import Checkbox from '../Checkbox/Checkbox';
import RadioGroup from '../Radio/RadioGroup';
import Select from '../Select/Select';
import TextField from '../TextField/TextField';
import styles from './OrderForm.module.css';

const DELIVERY = [
  {value: 'pickup', label: 'Самовывоз'},
  {value: 'delivery', label: 'Доставка'},
];
const PAYMENT = [
  {value: 'card', label: 'По карте'},
  {value: 'cash', label: 'Наличными'},
];

/**
 * Форма оформления заказа. onSubmit вызывается только с валидными данными.
 * Обязательные поля: e-mail, способ оплаты и (при доставке) адрес. Телефон необязателен.
 */
export default function OrderForm({onSubmit, submitting, formError}) {
  const [values, setValues] = useState(EMPTY_ORDER);
  const [errors, setErrors] = useState({});
  const [attempt, setAttempt] = useState(0);
  const formRef = useRef(null);

  // После неудачной попытки отправки переводим фокус на первое поле с ошибкой
  useEffect(() => {
    if (attempt > 0) {
      formRef.current.querySelector('[aria-invalid="true"]')?.focus();
    }
  }, [attempt]);

  // Ошибка у поля исчезает, как только человек начал его исправлять
  function change(field, value) {
    setValues((v) => ({...v, [field]: value}));
    if (errors[field]) {
      setErrors((e) => ({...e, [field]: undefined}));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (submitting) {
      return;
    }
    const found = validateOrder(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setAttempt((n) => n + 1);
      return;
    }
    onSubmit(values);
  }

  return (
    <form
      ref={formRef}
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className={styles.row}>
        <TextField
          label="Телефон"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={(e) =>
            change('phone', e.target.value.replace(/[^\d+()\-\s]/g, ''))
          }
          error={errors.phone}
        />
        <TextField
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={values.email}
          onChange={(e) => change('email', e.target.value)}
          error={errors.email}
        />
      </div>

      <div className={styles.radio}>
        <RadioGroup
          legend="Способ получения"
          name="delivery"
          options={DELIVERY}
          value={values.delivery}
          onChange={(v) => {
            change('delivery', v);
            if (v === 'pickup') {
              setErrors((e) => ({...e, address: undefined}));
            }
          }}
        />
      </div>

      {/* Адрес нужен только при доставке */}
      {values.delivery === 'delivery' && (
        <div className={`${styles.wide} ${styles.address}`}>
          <TextField
            label="Адрес доставки"
            name="address"
            autoComplete="street-address"
            required
            value={values.address}
            onChange={(e) => change('address', e.target.value)}
            error={errors.address}
          />
        </div>
      )}

      <div className={`${styles.narrow} ${styles.payment}`}>
        <Select
          label="Способ оплаты"
          required
          options={PAYMENT}
          value={values.payment}
          onChange={(v) => change('payment', v)}
          error={errors.payment}
        />
      </div>

      <Checkbox
        label="Нужна упаковка"
        checked={values.packaging}
        onChange={(e) => change('packaging', e.target.checked)}
      />

      {formError && (
        <p className={styles['form-error']} role="alert">
          {formError}
        </p>
      )}

      <Button
        type="submit"
        aria-disabled={submitting || undefined}
        className={styles.submit}
      >
        Оформить заказ
      </Button>
    </form>
  );
}
