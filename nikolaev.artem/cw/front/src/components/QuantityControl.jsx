import {MinusIcon, PlusIcon} from './Icons'
import './QuantityControl.css'

export default function QuantityControl({quantity, onChange}) {
  return (
    <div className="qty">
      <button
        type="button"
        className="qty__btn"
        onClick={() => onChange(quantity - 1)}
        aria-label="Уменьшить количество"
      >
        <MinusIcon />
      </button>
      <span className="qty__value">{quantity}</span>
      <button
        type="button"
        className="qty__btn"
        onClick={() => onChange(quantity + 1)}
        aria-label="Увеличить количество"
      >
        <PlusIcon />
      </button>
    </div>
  )
}
