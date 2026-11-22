export const REQUIRED = 'Заполните обязательное поле';
export const BAD_EMAIL = 'Введите корректный e-mail';
export const BAD_PHONE = 'Введите корректный номер телефона';
export const NO_PAYMENT = 'Выберите способ оплаты';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const EMPTY_ORDER = {
  phone: '',
  email: '',
  delivery: 'pickup',
  address: '',
  payment: '',
  packaging: true,
};

export function validateOrder(values) {
  const errors = {};
  const email = values.email.trim();
  if (!email) {
    errors.email = REQUIRED;
  } else if (!EMAIL_RE.test(email)) {
    errors.email = BAD_EMAIL;
  }

  const phone = values.phone.trim();
  if (phone && phone.replace(/\D/g, '').length < 10) {
    errors.phone = BAD_PHONE;
  }

  if (values.delivery === 'delivery' && !values.address.trim()) {
    errors.address = REQUIRED;
  }
  if (!values.payment) {
    errors.payment = NO_PAYMENT;
  }
  return errors;
}
