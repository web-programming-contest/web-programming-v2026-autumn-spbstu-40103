import {useEffect} from 'react';
import Labels from './Labels.jsx';
import RatingStars from './RatingStars.jsx';
import QuantityStepper from './QuantityStepper.jsx';
import {useCart} from '../hooks/CartContext.jsx';
import {useAuth} from '../hooks/AuthContext.jsx';

function ProductModal({product, onClose}) {
  const {items, increment, decrement} = useCart();
  const {user} = useAuth();
  const isOpen = product !== null;
  const quantityInCart = product ? (items[product.id] ?? 0) : 0;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  function handleOverlayMouseDown(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className={`modal-overlay ${isOpen ? 'modal-overlay--open' : ''}`}
      onMouseDown={handleOverlayMouseDown}
      aria-hidden={!isOpen}
    >
      <div className="product-modal" role="dialog" aria-modal="true">
        <button
          type="button"
          className="product-modal__close"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>

        {product && (
          <>
            <div className="product-modal__image-wrap">
              <Labels labels={product.labels} />
              <img
                src={product.image}
                alt={product.name}
                className="product-modal__image"
              />
            </div>

            <div className="product-modal__body">
              <h2 className="product-modal__title">{product.name}</h2>
              <RatingStars rating={product.rating} />
              <p className="product-modal__description">
                {product.description}
              </p>

              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="product-modal__specs">
                  <h3 className="product-modal__specs-title">Характеристики</h3>
                  <dl className="specs-list">
                    {Object.entries(product.specs).map(([label, value]) => (
                      <div className="specs-list__row" key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              <div className="product-modal__footer">
                <div className="product-modal__price">
                  {product.price.toLocaleString('ru-RU')} ₽
                </div>

                {user &&
                  (quantityInCart === 0 ? (
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
                    <div className="product-modal__stepper-row">
                      <QuantityStepper
                        quantity={quantityInCart}
                        onIncrement={() => increment(product.id)}
                        onDecrement={() => decrement(product.id)}
                      />
                      <span className="badge-pink">
                        В корзине {quantityInCart} шт.
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductModal;
