import {Quantity} from '../../components/Product';
import {money} from '../../utils/format';
import type {CartLine} from './cartSummary';

interface CartItemsProps {
  lines: CartLine[];
  count: number;
  total: number;
  selected: string[];
  busy: boolean;
  onSelected: (ids: string[]) => void;
  onDelete: (ids: string[]) => void;
}

export function CartItems(props: CartItemsProps) {
  const {lines, selected, onSelected} = props;

  return (
    <section className="panel">
      <fieldset disabled={props.busy} className="cart-items">
        <div className="actions">
          <label className="check">
            <input
              type="checkbox"
              checked={selected.length === lines.length}
              onChange={(event) =>
                onSelected(
                  event.target.checked
                    ? lines.map((line) => line.productId)
                    : [],
                )
              }
            />
            Выбрать все
          </label>
          <button
            className="pink"
            disabled={!selected.length}
            onClick={() => props.onDelete(selected)}
          >
            Удалить выбранные
          </button>
        </div>
        {lines.map((line) => (
          <div className="cart-row" key={line.productId}>
            <input
              type="checkbox"
              aria-label={`Выбрать ${line.product.name}`}
              checked={selected.includes(line.productId)}
              onChange={(event) =>
                onSelected(
                  event.target.checked
                    ? [...selected, line.productId]
                    : selected.filter((id) => id !== line.productId),
                )
              }
            />
            <img
              className="cart-image"
              src={line.product.image}
              alt={line.product.name}
            />
            <span className="cart-name">{line.product.name}</span>
            <Quantity product={line.product} />
            <strong>{money(line.product.price * line.quantity)}</strong>
            <button
              className="pink"
              aria-label={`Удалить ${line.product.name}`}
              onClick={() => props.onDelete([line.productId])}
            >
              × Удалить
            </button>
          </div>
        ))}
        <p className="cart-total">
          Товаров: {props.count} на {money(props.total)}
        </p>
      </fieldset>
    </section>
  );
}
