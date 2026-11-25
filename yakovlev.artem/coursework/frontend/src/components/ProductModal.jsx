import {useEffect} from 'react';
import {useCart} from '../context/CartContext.jsx';
import {formatPrice} from '../format.js';
import Rating from './Rating.jsx';
import Labels from './Labels.jsx';
import QuantityStepper from './QuantityStepper.jsx';
import {CartIcon} from './ProductCard.jsx';

export default function ProductModal({good, onClose}) {
  const {items, add, setQty} = useCart();
  const qty = items[good.id] || 0;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal product-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close"
          aria-label="Закрыть"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="product-modal-image-wrap">
          <img
            className="product-modal-image"
            src={good.image}
            alt={good.name}
          />
        </div>
        <div className="product-modal-info">
          <h3 className="product-modal-name">{good.name}</h3>
          <Labels isHit={good.isHit} isNew={good.isNew} />
          <Rating value={good.rating} />
          <p className="product-modal-description">{good.description}</p>
          <h4 className="product-modal-subtitle">Характеристики</h4>
          <dl className="spec-list">
            {good.characteristics.map((c) => (
              <div className="spec-list-row" key={c.name}>
                <dt className="spec-list-name">{c.name}</dt>
                <dd className="spec-list-value">{c.value}</dd>
              </div>
            ))}
          </dl>
          <div className="product-modal-footer">
            <p className="product-modal-price">{formatPrice(good.price)}</p>
            <div className="product-modal-actions">
              {qty === 0 ? (
                <button
                  type="button"
                  className="btn btn-blue"
                  onClick={() => add(good.id)}
                >
                  <CartIcon />В корзину
                </button>
              ) : (
                <>
                  <QuantityStepper
                    qty={qty}
                    onChange={(v) => setQty(good.id, v)}
                  />
                  <button type="button" className="btn btn-pink">
                    <CartIcon />В корзине {qty} шт.
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
