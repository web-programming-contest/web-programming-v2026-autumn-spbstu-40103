import Labels from './Labels.jsx';
import RatingStars from './RatingStars.jsx';
import QuantityStepper from './QuantityStepper.jsx';
import {useCart} from '../hooks/CartContext.jsx';
import {useAuth} from '../hooks/AuthContext.jsx';

function ProductCard({product, onOpen, showCart = true}) {
  const {items, increment, decrement} = useCart();
  const {user} = useAuth();
  const quantityInCart = items[product.id] ?? 0;

  function handleCardClick(event) {
    if (!onOpen) {
      return;
    }
    if (event.target.closest('button')) {
      return;
    }
    onOpen(product);
  }

  return (
    <article
      className={`product-card ${onOpen ? 'product-card--clickable' : ''}`}
      onClick={handleCardClick}
    >
      <div className="product-card__image-wrap">
        <Labels labels={product.labels} />
        <img
          src={product.image}
          alt={product.name}
          className="product-card__image"
        />
      </div>

      <div className="product-card__price">
        {product.price.toLocaleString('ru-RU')} ₽
      </div>
      <p className="product-card__name">{product.name}</p>
      <RatingStars rating={product.rating} />

      {user && showCart && (
        <div className="product-card__action">
          {quantityInCart === 0 ? (
            <button
              type="button"
              className="button button--primary"
              onClick={() => increment(product.id)}
            >
              <img
                src="/images/icons/card.svg"
                alt=""
                className="button__icon"
              />
              В корзину
            </button>
          ) : (
            <div className="product-card__in-cart">
              <span className="product-card__cart-count">
                <img src="/images/icons/card.svg" alt="" />
                {quantityInCart} шт.
              </span>
              <QuantityStepper
                quantity={quantityInCart}
                onIncrement={() => increment(product.id)}
                onDecrement={() => decrement(product.id)}
              />
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default ProductCard;
