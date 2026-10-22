import type {Checkout} from '../../../../shared/types';

export type CheckoutErrors = Partial<
  Record<'phone' | 'email' | 'address', string>
>;

export function validateCheckout(form: Checkout): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (!form.phone.trim()) {
    errors.phone = 'Обязательное поле';
  } else if (
    !/^[+\d\s()-]{7,25}$/.test(form.phone) ||
    form.phone.replace(/\D/g, '').length < 7
  ) {
    errors.phone = 'Введите корректный телефон';
  }
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Введите корректный email';
  }
  if (form.delivery === 'delivery' && !form.address.trim()) {
    errors.address = 'Обязательное поле';
  }

  return errors;
}
