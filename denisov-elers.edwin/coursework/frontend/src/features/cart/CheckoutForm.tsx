import type {FormEvent} from 'react';
import type {Checkout} from '../../../../shared/types';
import {CheckoutField} from './CheckoutField';
import {CheckoutOptions} from './CheckoutOptions';
import type {CheckoutErrors} from './checkoutValidation';

interface CheckoutFormProps {
  form: Checkout;
  errors: CheckoutErrors;
  busy: boolean;
  onFormChange: (form: Checkout) => void;
  onFieldChange: (name: 'phone' | 'email' | 'address', value: string) => void;
  onSubmit: (event: FormEvent) => void;
}

export function CheckoutForm(props: CheckoutFormProps) {
  return (
    <>
      <h2 className="checkout-title">Оформление заказа</h2>
      <form className="panel checkout" onSubmit={props.onSubmit} noValidate>
        <fieldset disabled={props.busy}>
          <div className="form-row">
            <CheckoutField
              name="phone"
              title="Телефон"
              required
              form={props.form}
              errors={props.errors}
              onChange={props.onFieldChange}
            />
            <CheckoutField
              name="email"
              title="E-mail"
              form={props.form}
              errors={props.errors}
              onChange={props.onFieldChange}
            />
          </div>
          <CheckoutOptions form={props.form} onChange={props.onFormChange}>
            {props.form.delivery === 'delivery' && (
              <CheckoutField
                name="address"
                title="Адрес доставки"
                required
                form={props.form}
                errors={props.errors}
                onChange={props.onFieldChange}
              />
            )}
          </CheckoutOptions>
          <button className="primary" disabled={props.busy}>
            {props.busy ? 'Оформляем…' : 'Оформить заказ'}
          </button>
        </fieldset>
      </form>
    </>
  );
}
