import styles from './Radio.module.css';

// options: [{ value, label }]. Стрелки на клавиатуре переключают варианты (это умеет сам браузер для radio с одним name).
export default function RadioGroup({legend, name, options, value, onChange}) {
  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.row}>
        {options.map((o) => (
          <label key={o.value} className={styles.radio}>
            <input
              type="radio"
              className={styles.input}
              name={name}
              value={o.value}
              checked={o.value === value}
              onChange={() => onChange(o.value)}
            />
            <span className={styles.circle} />
            <span className={styles.label}>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
