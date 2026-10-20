import Modal from './Modal'
import Rating from './Rating'
import QuantityControl from './QuantityControl'
import {useCart} from '../context/CartContext'
import {useAuth} from '../context/AuthContext'
import {formatPrice} from '../utils/format'
import './ProductModal.css'

export default function ProductModal({good, onClose, showCart = true}) {
  const {getQuantity, addItem, setQuantity} = useCart()
  const {isAuthenticated} = useAuth()
  if (!good) {
    return null
  }

  const quantity = getQuantity(good.id)
  const specs = good.specs && typeof good.specs === 'object' ? Object.entries(good.specs) : []

  return (
    <Modal onClose={onClose} width={1304} className="product-modal-box">
      <div className="product-modal">
        <div className="product-modal__image-wrap">
          <img src={good.imageUrl} alt={good.title} className="product-modal__image" />
        </div>

        <div className="product-modal__content">
          <h2 className="product-modal__title">{good.title}</h2>

          <div className="product-modal__meta">
            <Rating value={good.rating} />
            {good.isNew && <span className="badge badge--new">Новинка</span>}
            {good.isHit && <span className="badge badge--hit">Хит</span>}
          </div>

          {good.description && <p className="product-modal__description">{good.description}</p>}

          {specs.length > 0 && (
            <>
              <h3 className="product-modal__specs-title">Характеристики</h3>
              <dl className="product-modal__specs">
                {specs.map(([key, value]) => (
                  <div className="product-modal__spec" key={key}>
                    <dt>{key}</dt>
                    <span className="product-modal__leader" />
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}

          <div className="product-modal__price">{formatPrice(good.price)} ₽</div>

          {showCart && isAuthenticated && (
            <div className="product-modal__action">
              {quantity > 0 ? (
                <>
                  <QuantityControl quantity={quantity} onChange={(next) => setQuantity(good.id, next)} />
                  <span className="btn btn--pink product-modal__in-cart">
                    <span className="btn__cart-icon" aria-hidden="true" />В корзине {quantity} шт.
                  </span>
                </>
              ) : (
                <button type="button" className="btn btn--primary" onClick={() => addItem(good, 1)}>
                  <span className="btn__cart-icon" aria-hidden="true" />В корзину
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
