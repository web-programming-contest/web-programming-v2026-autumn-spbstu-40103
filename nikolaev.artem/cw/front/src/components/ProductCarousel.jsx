import {useState} from 'react'
import ProductCard from './ProductCard'
import {ChevronIcon} from './Icons'
import './ProductCarousel.css'

const VISIBLE = 3

export default function ProductCarousel({icon, title, description, items, onOpen}) {
  const [start, setStart] = useState(0)
  if (!items?.length) {
    return null
  }

  const n = items.length
  const canScroll = n > VISIBLE
  const visible = Array.from({length: Math.min(VISIBLE, n)}, (_, i) => items[(start + i) % n])

  return (
    <section className="carousel">
      <div className="carousel__info">
        <img className="carousel__icon" src={icon} alt="" />
        <h2 className="carousel__title">{title}</h2>
        <p className="carousel__description">{description}</p>
      </div>

      {canScroll && (
        <button
          type="button"
          className="carousel__arrow carousel__arrow--prev"
          onClick={() => setStart((s) => (s - 1 + n) % n)}
          aria-label="Предыдущие товары"
        >
          <ChevronIcon dir="left" />
        </button>
      )}

      <div className="carousel__track">
        {visible.map((good) => (
          <ProductCard key={good.id} good={good} onOpen={onOpen} />
        ))}
      </div>

      {canScroll && (
        <button
          type="button"
          className="carousel__arrow carousel__arrow--next"
          onClick={() => setStart((s) => (s + 1) % n)}
          aria-label="Следующие товары"
        >
          <ChevronIcon dir="right" />
        </button>
      )}
    </section>
  )
}
