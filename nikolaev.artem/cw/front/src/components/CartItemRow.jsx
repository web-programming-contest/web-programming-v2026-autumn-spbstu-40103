import QuantityControl from './QuantityControl'
import {Checkbox} from './Checkbox'
import {CrossIcon} from './Icons'
import {formatPrice} from '../utils/format'
import './CartItemRow.css'

export default function CartItemRow({item, checked, onToggle, onQuantityChange, onRemove}) {
  return (
    <div className="cart-item">
      <div className="cart-item__check">
        <Checkbox checked={checked} onChange={onToggle} aria-label={`Выбрать: ${item.title}`} />
      </div>

      <div className="cart-item__image">
        <img src={item.imageUrl} alt="" />
      </div>

      <div className="cart-item__title">{item.title}</div>

      <div className="cart-item__qty">
        <QuantityControl quantity={item.quantity} onChange={onQuantityChange} />
      </div>

      <div className="cart-item__price">{formatPrice(item.price * item.quantity)} ₽</div>

      <button type="button" className="cart-item__remove" onClick={onRemove}>
        <CrossIcon />
        Удалить
      </button>
    </div>
  )
}
