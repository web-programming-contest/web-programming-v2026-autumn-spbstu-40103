import {forwardRef, useId} from 'react';
import styles from './TextField.module.css';

// label — подпись, required — розовая звёздочка справа, error — текст ошибки под полем
const TextField = forwardRef(function TextFieldInput(
  {label, required = false, error, className = '', ...inputProps},
  ref,
) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={`${styles.field} ${className}`}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.control}>
        <input
          ref={ref}
          id={id}
          className={styles.input}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          aria-required={required || undefined}
          {...inputProps}
        />
        {required && (
          <span className={styles.asterisk} aria-hidden="true">
            *
          </span>
        )}
      </div>
      {error && (
        <div id={errorId} className={styles.error}>
          {error}
        </div>
      )}
    </div>
  );
});

export default TextField;
