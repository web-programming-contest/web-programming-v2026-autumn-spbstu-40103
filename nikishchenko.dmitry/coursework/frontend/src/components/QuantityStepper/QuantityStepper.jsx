import {MinusIcon, PlusIcon} from '../../icons';
import {MAX_QTY} from '../../context/cartReducer';
import styles from './QuantityStepper.module.css';

// «− 1 +». При value = 0 снаружи решают, что показывать (на карточке снова появится «В корзину»)
export default function QuantityStepper({value, onChange, max = MAX_QTY}) {
  return (
    <div className={styles.stepper}>
      <button
        type="button"
        className={styles.button}
        aria-label="Уменьшить количество"
        onClick={() => onChange(value - 1)}
      >
        <MinusIcon />
      </button>
      <span className={styles.value} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={styles.button}
        aria-label="Увеличить количество"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <PlusIcon />
      </button>
    </div>
  );
}
