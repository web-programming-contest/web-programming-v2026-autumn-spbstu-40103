import type {Checkout} from '../../../../shared/types';
import type {CheckoutErrors} from './checkoutValidation';

type FieldName = 'phone' | 'email' | 'address';

interface CheckoutFieldProps {
  name: FieldName;
  title: string;
  required?: boolean;
  form: Checkout;
  errors: CheckoutErrors;
  onChange: (name: FieldName, value: string) => void;
}

export function CheckoutField(props: CheckoutFieldProps) {
  const {name, title, required = false, form, errors, onChange} = props;

  return (
    <label className={`field ${name === 'address' ? 'address-field' : ''}`}>
      {title}
      {required && <span className="required">*</span>}
      <input
        name={name}
        type={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'text'}
        autoComplete={
          name === 'phone'
            ? 'tel'
            : name === 'address'
              ? 'street-address'
              : 'email'
        }
        value={form[name]}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        onChange={(event) => onChange(name, event.target.value)}
      />
      {errors[name] && (
        <span className="error" id={`${name}-error`}>
          {errors[name]}
        </span>
      )}
    </label>
  );
}
