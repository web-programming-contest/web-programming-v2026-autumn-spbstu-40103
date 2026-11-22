import styles from './RangeSlider.module.css';

// Два ползунка на одной полосе. Значения from и to не могут «перепрыгнуть» друг друга.
export default function RangeSlider({min, max, from, to, onChange, step = 10}) {
  const span = Math.max(max - min, 1);
  const ratioFrom = (from - min) / span;
  const ratioTo = (to - min) / span;
  // Если ползунки сошлись у правого края, верхним должен быть левый, иначе его не сдвинуть влево
  const fromOnTop = ratioFrom > 0.5;

  return (
    <div
      className={styles.slider}
      style={{'--from': ratioFrom, '--to': ratioTo}}
    >
      <div className={styles.track}>
        <div className={styles.range} />
      </div>
      <input
        type="range"
        className={styles.input}
        style={{zIndex: fromOnTop ? 2 : 1}}
        aria-label="Минимальная цена"
        min={min}
        max={max}
        step={step}
        value={from}
        onChange={(e) =>
          onChange({from: Math.min(Number(e.target.value), to), to})
        }
      />
      <input
        type="range"
        className={styles.input}
        style={{zIndex: fromOnTop ? 1 : 2}}
        aria-label="Максимальная цена"
        min={min}
        max={max}
        step={step}
        value={to}
        onChange={(e) =>
          onChange({from, to: Math.max(Number(e.target.value), from)})
        }
      />
    </div>
  );
}
