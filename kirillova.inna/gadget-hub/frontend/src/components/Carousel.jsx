import {useState} from 'react';
import ProductCard from './ProductCard.jsx';

const VISIBLE_COUNT = 3;

function Carousel({title, description, icon, products, onOpen}) {
  const [startIndex, setStartIndex] = useState(0);

  if (products.length === 0) {
    return null;
  }

  function goPrev() {
    setStartIndex((prev) => (prev - 1 + products.length) % products.length);
  }

  function goNext() {
    setStartIndex((prev) => (prev + 1) % products.length);
  }

  const visibleProducts = Array.from(
    {length: Math.min(VISIBLE_COUNT, products.length)},
    (_, offset) => products[(startIndex + offset) % products.length],
  );

  return (
    <section className="carousel">
      <div className="carousel__header">
        <img src={icon} alt="" className="carousel__icon" />
        <div>
          <h2 className="carousel__title">{title}</h2>
          <p className="carousel__description">{description}</p>
        </div>
      </div>

      <div className="carousel__row">
        <button
          type="button"
          className="carousel__arrow"
          onClick={goPrev}
          aria-label="Предыдущие товары"
          disabled={products.length <= VISIBLE_COUNT}
        >
          <ChevronIcon direction="left" />
        </button>

        <div className="carousel__items">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} onOpen={onOpen} />
          ))}
        </div>

        <button
          type="button"
          className="carousel__arrow"
          onClick={goNext}
          aria-label="Следующие товары"
          disabled={products.length <= VISIBLE_COUNT}
        >
          <ChevronIcon direction="right" />
        </button>
      </div>
    </section>
  );
}

function ChevronIcon({direction}) {
  return (
    <svg
      width="10"
      height="16"
      viewBox="0 0 10 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={direction === 'left' ? 'M8 2L2 8l6 6' : 'M2 2l6 6-6 6'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Carousel;
