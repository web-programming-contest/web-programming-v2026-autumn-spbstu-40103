import type {ReactNode} from 'react';
import type {Checkout} from '../../../../shared/types';

export function CheckoutOptions({
  form,
  onChange,
  children,
}: {
  form: Checkout;
  onChange: (form: Checkout) => void;
  children?: ReactNode;
}) {
  return (
    <>
      <div className="actions delivery">
        {(['pickup', 'delivery'] as const).map((value) => (
          <label className="check" key={value}>
            <input
              type="radio"
              name="delivery"
              checked={form.delivery === value}
              onChange={() => onChange({...form, delivery: value})}
            />
            {value === 'pickup' ? 'Самовывоз' : 'Доставка'}
          </label>
        ))}
      </div>
      {children}
      <label className="field">
        Способ оплаты
        <select
          value={form.payment}
          onChange={(event) =>
            onChange({
              ...form,
              payment: event.target.value as Checkout['payment'],
            })
          }
        >
          <option value="card">По карте</option>
          <option value="cash">Наличными</option>
        </select>
      </label>
      <label className="check packaging">
        <input
          type="checkbox"
          checked={form.packaging}
          onChange={(event) =>
            onChange({...form, packaging: event.target.checked})
          }
        />
        Нужна упаковка
      </label>
    </>
  );
}
