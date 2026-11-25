import {formatPrice, goodsWord} from '../format.js';
import QuantityStepper from './QuantityStepper.jsx';

export default function CartList({
  entries,
  selected,
  onToggle,
  onToggleAll,
  onQtyChange,
  onRemove,
  onRemoveSelected,
}) {
  const allSelected = entries.length > 0 && selected.size === entries.length;

  return (
    <div className="cart-list">
      <div className="cart-list-head">
        <label className="checkbox">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={() => onToggleAll(!allSelected)}
          />
          <span className="checkbox-box" />
          <span className="checkbox-label">Выбрать все</span>
        </label>
        {selected.size > 0 && (
          <button
            type="button"
            className="btn btn-text-pink cart-list-remove-selected"
            onClick={onRemoveSelected}
          >
            ✕ Удалить все
          </button>
        )}
      </div>
      {entries.map(({good, qty}) => (
        <div className="cart-item" key={good.id}>
          <label className="checkbox cart-item-checkbox">
            <input
              type="checkbox"
              checked={selected.has(good.id)}
              onChange={() => onToggle(good.id)}
            />
            <span className="checkbox-box" />
          </label>
          <div className="cart-item-image-wrap">
            <img src={good.image} alt={good.name} className="cart-item-image" />
          </div>
          <h3 className="cart-item-name">{good.name}</h3>
          <QuantityStepper
            qty={qty}
            onChange={(v) => onQtyChange(good.id, v)}
          />
          <p className="cart-item-total">{formatPrice(good.price * qty)}</p>
          <button
            type="button"
            className="btn btn-text-pink cart-item-remove"
            onClick={() => onRemove(good.id)}
          >
            ✕ Удалить
          </button>
        </div>
      ))}
    </div>
  );
}

export function CartSummary({entries}) {
  const count = entries.reduce((sum, e) => sum + e.qty, 0);
  const total = entries.reduce((sum, e) => sum + e.good.price * e.qty, 0);
  return (
    <p className="cart-summary">
      {count} {goodsWord(count)} на {formatPrice(total)}
    </p>
  );
}
