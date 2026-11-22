import {CheckIcon} from '../../icons';
import styles from './Checkbox.module.css';

export default function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  ariaLabel,
}) {
  return (
    <label className={`${styles.checkbox} ${disabled ? styles.disabled : ''}`}>
      <input
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        aria-label={ariaLabel}
      />
      <span className={styles.box}>
        <CheckIcon />
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
