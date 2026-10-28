import {useNavigate} from 'react-router-dom'
import Rating from './Rating'
import QuantityControl from './QuantityControl'
import {useCart} from '../context/CartContext'
import {formatPrice} from '../utils/format'
import './ProductCard.css'

export default function ProductCard({good, onOpen, showCart = false}) {
  const {getQuantity, addItem, setQuantity} = useCart()
  const navigate = useNavigate()
  const quantity = getQuantity(good.id)

  return (
    <article
      className="product-card"
      tabIndex={0}
      onClick={() => onOpen?.(good)}
      onKeyDown={(e) => e.key === 'Enter' && e.target === e.currentTarget && onOpen?.(good)}
    >
      <div className="product-card__image-wrap">
        <img className="product-card__image" src={good.imageUrl} alt="" loading="lazy" />
        {(good.isNew || good.isHit) && (
          <div className="product-card__badges">
            {good.isNew && <span className="badge badge--new">Новинка</span>}
            {good.isHit && <span className="badge badge--hit">Хит</span>}
          </div>
        )}
      </div>

      <div className="product-card__price">{formatPrice(good.price)} ₽</div>
      <h3 className="product-card__title" title={good.title}>
        {good.title}
      </h3>
      <div className="product-card__rating">
        <Rating value={good.rating} />
      </div>

      {showCart && (
        <div className="product-card__action" onClick={(e) => e.stopPropagation()}>
          {quantity > 0 ? (
            <>
              <button type="button" className="btn btn--pink product-card__in-cart" onClick={() => navigate('/cart')}>
                {quantity} шт.
              </button>
              <QuantityControl quantity={quantity} onChange={(next) => setQuantity(good.id, next)} />
            </>
          ) : (
            <button type="button" className="btn btn--primary" onClick={() => addItem(good, 1)}>
              <span className="btn__cart-icon" aria-hidden="true" />В корзину
            </button>
          )}
        </div>
      )}
    </article>
  )
}
