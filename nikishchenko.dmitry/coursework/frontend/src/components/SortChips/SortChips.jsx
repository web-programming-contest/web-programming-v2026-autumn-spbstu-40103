import styles from './SortChips.module.css';

// Переключатель сортировки: выбран ровно один вариант (Chips из UI-кита)
export default function SortChips({options, value, onChange}) {
  return (
    <div className={styles.chips} role="group" aria-label="Сортировка">
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            className={`${styles.chip} ${active ? styles.active : ''}`}
            aria-pressed={active}
            onClick={() => onChange(o.id)}
          >
            <span className={styles.label}>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
