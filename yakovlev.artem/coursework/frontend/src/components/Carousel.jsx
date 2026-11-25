import {useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {formatPrice} from '../format.js';
import Rating from './Rating.jsx';
import Labels from './Labels.jsx';

const VISIBLE = 3;
const CARD_WIDTH = 264;
const GAP = 24;

export default function Carousel({items}) {
  const navigate = useNavigate();
  const [pos, setPos] = useState(VISIBLE);
  const [animate, setAnimate] = useState(true);

  const extended = useMemo(
    () => [...items.slice(-VISIBLE), ...items, ...items.slice(0, VISIBLE)],
    [items],
  );

  if (items.length === 0) {
    return null;
  }

  const looped = items.length > VISIBLE;

  const go = (dir) => {
    setAnimate(true);
    setPos((p) => p + dir);
  };

  const handleTransitionEnd = (e) => {
    if (e.propertyName !== 'transform') {
      return;
    }
    if (pos >= items.length + VISIBLE) {
      setAnimate(false);
      setPos(VISIBLE);
    } else if (pos < VISIBLE) {
      setAnimate(false);
      setPos(items.length + VISIBLE - 1);
    }
  };

  return (
    <div className="carousel">
      {looped && (
        <button
          type="button"
          className="carousel-arrow carousel-arrow-prev"
          aria-label="Назад"
          onClick={() => go(-1)}
        >
          ‹
        </button>
      )}
      <div
        className="carousel-viewport"
        style={{width: VISIBLE * CARD_WIDTH + (VISIBLE - 1) * GAP}}
      >
        <div
          className="carousel-track"
          style={{
            transform: `translateX(${-pos * (CARD_WIDTH + GAP)}px)`,
            transition: animate ? 'transform 0.4s ease' : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extended.map((good, index) => (
            <article
              className="carousel-card"
              key={`${good.id}-${index}`}
              style={{width: CARD_WIDTH}}
              onClick={() => navigate('/catalog')}
            >
              <div className="carousel-card-image-wrap">
                <Labels isHit={good.isHit} isNew={good.isNew} />
                <img
                  className="carousel-card-image"
                  src={good.image}
                  alt={good.name}
                  loading="lazy"
                />
              </div>
              <p className="carousel-card-price">{formatPrice(good.price)}</p>
              <h3 className="carousel-card-name">{good.name}</h3>
              <Rating value={good.rating} />
            </article>
          ))}
        </div>
      </div>
      {looped && (
        <button
          type="button"
          className="carousel-arrow carousel-arrow-next"
          aria-label="Вперед"
          onClick={() => go(1)}
        >
          ›
        </button>
      )}
    </div>
  );
}
