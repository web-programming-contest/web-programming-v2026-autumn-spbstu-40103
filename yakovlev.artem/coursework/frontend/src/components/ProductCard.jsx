import {useCart} from '../context/CartContext.jsx';
import {formatPrice} from '../format.js';
import Rating from './Rating.jsx';
import Labels from './Labels.jsx';
import QuantityStepper from './QuantityStepper.jsx';

export default function ProductCard({good, onOpen}) {
  const {items, add, setQty} = useCart();
  const qty = items[good.id] || 0;

  return (
    <article className="product-card" onClick={() => onOpen?.(good)}>
      <div className="product-card-image-wrap">
        <Labels isHit={good.isHit} isNew={good.isNew} />
        <img
          className="product-card-image"
          src={good.image}
          alt={good.name}
          loading="lazy"
        />
      </div>
      <div className="product-card-body">
        <p className="product-card-price">{formatPrice(good.price)}</p>
        <h3 className="product-card-name">{good.name}</h3>
        <Rating value={good.rating} />
        <div
          className="product-card-actions"
          onClick={(e) => e.stopPropagation()}
        >
          {qty === 0 ? (
            <button
              type="button"
              className="btn btn-blue product-card-add"
              onClick={() => add(good.id)}
            >
              <CartIcon />В корзину
            </button>
          ) : (
            <span className="product-card-in-cart">
              <span className="in-cart-chip">
                <CartIcon />
                {qty} шт.
              </span>
              <QuantityStepper
                qty={qty}
                onChange={(v) => setQty(good.id, v)}
                small
              />
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export function CartIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden="true"
      className="cart-icon"
    >
      <path
        fill="currentColor"
        d="M1.5 1.5h1.6l.5 2h11l-1.3 6.5H4.1L2.9 3H1.5v-.5zm3 9.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zm7.5 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z"
      />
    </svg>
  );
}
