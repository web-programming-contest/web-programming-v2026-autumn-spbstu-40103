import {useEffect, useId, useRef, useState} from 'react';
import {ChevronDownIcon} from '../../icons';
import styles from './Select.module.css';

/**
 * Выпадающий список. Клавиатура: Enter, пробел и ↓ открывают; ↑ ↓ Home End двигаются по вариантам;
 * Enter или пробел выбирают; Esc и Tab закрывают. options: [{ value, label }].
 */
export default function Select({
  label,
  required = false,
  error,
  options,
  value,
  onChange,
  placeholder = 'Не выбрано',
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const selected = options.find((o) => o.value === value);

  // клик вне списка закрывает его
  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onDown = (e) => {
      if (!rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  function openList() {
    setActive(
      Math.max(
        0,
        options.findIndex((o) => o.value === value),
      ),
    );
    setOpen(true);
  }

  function choose(index) {
    onChange(options[index].value);
    setOpen(false);
    buttonRef.current.focus();
  }

  function handleKeyDown(e) {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    const last = options.length - 1;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActive((i) => Math.min(i + 1, last));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        setActive(0);
        break;
      case 'End':
        e.preventDefault();
        setActive(last);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (active >= 0) {
          choose(active);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
    }
  }

  const errorId = `${id}-error`;
  return (
    <div className={styles.field} ref={rootRef}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.control}>
        <button
          ref={buttonRef}
          id={id}
          type="button"
          className={`${styles.button} ${open ? styles.open : ''} ${selected ? styles.filled : ''}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          aria-required={required || undefined}
          aria-activedescendant={
            open && active >= 0 ? `${id}-option-${active}` : undefined
          }
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={handleKeyDown}
        >
          <span className={selected ? styles.value : styles.placeholder}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDownIcon
            className={`${styles.chevron} ${open ? styles['chevron-open'] : ''}`}
          />
        </button>

        {open && (
          <ul className={styles.list} role="listbox" aria-labelledby={id}>
            {options.map((o, i) => (
              <li
                key={o.value}
                id={`${id}-option-${i}`}
                role="option"
                aria-selected={o.value === value}
                className={`${styles.option} ${i === active ? styles['active-option'] : ''}`}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(i)}
              >
                {o.label}
              </li>
            ))}
          </ul>
        )}

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
}
