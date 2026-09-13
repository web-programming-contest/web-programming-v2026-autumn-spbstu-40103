import {useState, type FormEvent} from 'react';
import type {CartItem, Checkout, Order} from '../../../../shared/types';
import {api} from '../../api';
import {validateCheckout, type CheckoutErrors} from './checkoutValidation';

const initialCheckout: Checkout = {
  email: '',
  phone: '',
  delivery: 'pickup',
  address: '',
  payment: 'card',
  packaging: false,
};

export function useCheckout() {
  const [form, setForm] = useState(initialCheckout);
  const [errors, setErrors] = useState<CheckoutErrors>({});

  const changeField = (name: 'phone' | 'email' | 'address', value: string) => {
    setForm({...form, [name]: value});
    setErrors((old) => ({...old, [name]: ''}));
  };

  const submit =
    (
      items: CartItem[],
      total: number,
      setBusy: (busy: boolean) => void,
      onError: (message: string) => void,
      onSuccess: () => void,
    ) =>
    async (event: FormEvent) => {
      event.preventDefault();
      const validation = validateCheckout(form);
      setErrors(validation);
      onError('');
      if (Object.keys(validation).length) {
        return;
      }

      setBusy(true);
      try {
        await api<Order>('/orders', {...form, items, total});
        setForm(initialCheckout);
        onSuccess();
      } catch (error) {
        onError(
          error instanceof Error ? error.message : 'Не удалось оформить заказ',
        );
      } finally {
        setBusy(false);
      }
    };

  return {form, errors, setForm, changeField, submit};
}
