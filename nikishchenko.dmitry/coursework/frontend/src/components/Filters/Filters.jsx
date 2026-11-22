import Button from '../Button/Button';
import Checkbox from '../Checkbox/Checkbox';
import RangeSlider from '../RangeSlider/RangeSlider';
import TextField from '../TextField/TextField';
import {parsePrice} from '../../catalog/catalogLogic';
import styles from './Filters.module.css';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const digitsOnly = (value) => value.replace(/\D/g, '');

/**
 * Форма фильтров. Меняет «черновик»; в каталоге он применяется только по кнопке «Показать».
 * bounds — минимальная и максимальная цена среди всех товаров.
 */
export default function Filters({
  draft,
  bounds,
  options,
  onPriceChange,
  onToggle,
  onApply,
  onReset,
}) {
  // Значения ползунка: пустое поле = край диапазона, лишнее обрезается
  const from = clamp(
    parsePrice(draft.priceFrom) ?? bounds.min,
    bounds.min,
    bounds.max,
  );
  const to = clamp(
    parsePrice(draft.priceTo) ?? bounds.max,
    bounds.min,
    bounds.max,
  );

  return (
    <form
      className={styles.filters}
      onSubmit={(e) => {
        e.preventDefault();
        onApply();
      }}
    >
      <fieldset className={styles.group}>
        <legend className={styles.title}>Цена, ₽</legend>
        <div className={styles['price-row']}>
          <TextField
            label="От"
            inputMode="numeric"
            autoComplete="off"
            placeholder={String(bounds.min)}
            value={draft.priceFrom}
            onChange={(e) =>
              onPriceChange('priceFrom', digitsOnly(e.target.value))
            }
          />
          <TextField
            label="До"
            inputMode="numeric"
            autoComplete="off"
            placeholder={String(bounds.max)}
            value={draft.priceTo}
            onChange={(e) =>
              onPriceChange('priceTo', digitsOnly(e.target.value))
            }
          />
        </div>
        <div className={styles.slider}>
          <RangeSlider
            min={bounds.min}
            max={bounds.max}
            from={from}
            to={to}
            onChange={(r) => {
              onPriceChange('priceFrom', String(r.from));
              onPriceChange('priceTo', String(r.to));
            }}
          />
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.title}>Тип товара</legend>
        <div className={styles.list}>
          {options.types.map((type) => (
            <Checkbox
              key={type}
              label={type}
              checked={draft.types.includes(type)}
              onChange={() => onToggle('types', type)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.title}>Цвет</legend>
        <div className={styles.list}>
          {options.colors.map((color) => (
            <Checkbox
              key={color}
              label={color}
              checked={draft.colors.includes(color)}
              onChange={() => onToggle('colors', color)}
            />
          ))}
        </div>
      </fieldset>

      <div className={styles.actions}>
        <Button type="submit">Показать</Button>
        <button type="button" className={styles.reset} onClick={onReset}>
          Сбросить
        </button>
      </div>
    </form>
  );
}
