import type {FormEvent} from 'react';
import type {Product} from '../../../../shared/types';
import type {CatalogFilters as Filters} from './catalog';

interface CatalogFiltersProps {
  goods: Product[];
  value: Filters;
  error: string;
  onChange: (value: Filters) => void;
  onApply: (event: FormEvent) => void;
  onReset: () => void;
}

export function CatalogFilters(props: CatalogFiltersProps) {
  const setGroupValue = (
    group: 'categories' | 'colors',
    value: string,
    checked: boolean,
  ) =>
    props.onChange({
      ...props.value,
      [group]: checked
        ? [...props.value[group], value]
        : props.value[group].filter((item) => item !== value),
    });

  return (
    <form className="filters" noValidate onSubmit={props.onApply}>
      <h3>Цена, ₽</h3>
      <div className="price-inputs">
        {(['min', 'max'] as const).map((name) => (
          <label className="field" key={name}>
            {name === 'min' ? 'От' : 'До'}
            <input
              aria-label={name === 'min' ? 'Цена от' : 'Цена до'}
              type="number"
              min="0"
              value={props.value[name]}
              aria-invalid={Boolean(props.error)}
              onChange={(event) =>
                props.onChange({...props.value, [name]: event.target.value})
              }
            />
          </label>
        ))}
      </div>
      {props.error && (
        <p role="alert" className="error">
          {props.error}
        </p>
      )}
      {(['categories', 'colors'] as const).map((group) => (
        <fieldset key={group}>
          <legend>{group === 'categories' ? 'Тип товара' : 'Цвет'}</legend>
          {getOptions(props.goods, group).map((value) => (
            <label className="check" key={value}>
              <input
                type="checkbox"
                checked={props.value[group].includes(value)}
                onChange={(event) =>
                  setGroupValue(group, value, event.target.checked)
                }
              />
              {value}
            </label>
          ))}
        </fieldset>
      ))}
      <div className="actions">
        <button className="primary">Показать</button>
        <button type="button" className="pink" onClick={props.onReset}>
          Сбросить
        </button>
      </div>
    </form>
  );
}

function getOptions(goods: Product[], group: 'categories' | 'colors') {
  return Array.from(
    new Set(
      goods.map((product) =>
        group === 'categories' ? product.category : product.color,
      ),
    ),
  );
}
