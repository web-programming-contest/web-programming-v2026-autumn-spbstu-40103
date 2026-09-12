import type {Product} from '../../../shared/types';
import {useStore} from '../context/Store';
import {asset, money} from '../api';
import {Modal} from './Modal';

export function Quantity({product}: {product: Product}) {
  const {items, setQuantity} = useStore();
  const quantity = items.find((i) => i.productId === product.id)?.quantity || 0;

  return (
    <div className="quantity" onClick={(e) => e.stopPropagation()}>
      {quantity ? (
        <>
          <button
            aria-label={`Уменьшить ${product.name}`}
            onClick={() => setQuantity(product.id, quantity - 1)}
          >
            −
          </button>
          <span aria-live="polite">{quantity}</span>
          <button
            disabled={quantity >= 99}
            aria-label={`Увеличить ${product.name}`}
            onClick={() => setQuantity(product.id, quantity + 1)}
          >
            +
          </button>
        </>
      ) : (
        <button className="primary" onClick={() => setQuantity(product.id, 1)}>
          <img
            width="16"
            height="16"
            src={asset('cart-icon.svg')}
            alt=""
          />
          В корзину
        </button>
      )}
    </div>
  );
}

export function ProductCard({
  product,
  open,
  carousel = false,
}: {
  product: Product;
  open: () => void;
  carousel?: boolean;
}) {
  return (
    <article className="product-card">
      <button
        className="product-open"
        onClick={open}
        aria-label={`Подробнее: ${product.name}`}
      >
        <div className="product-image">
          <img src={product.image} alt={product.name} />
          <Labels product={product} />
        </div>
        <strong className="price">{money(product.price)}</strong>
        <span className="product-name" title={product.name}>
          {product.name}
        </span>
        <Rating value={product.rating} />
      </button>
      {!carousel && <Quantity product={product} />}
    </article>
  );
}

export function ProductModal({
  product,
  close,
}: {
  product: Product;
  close: () => void;
}) {
  const {authenticated} = useStore();
  return (
    <Modal title={product.name} close={close} wide>
      <div className="product-detail">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
          <Labels product={product} />
        </div>
        <div>
          <h2>{product.name}</h2>
          <Rating value={product.rating} />
          <p>{product.description}</p>
          <h3>Характеристики</h3>
          <dl>
            {Object.entries(product.characteristics).map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <div className="detail-buy">
            <strong className="price">{money(product.price)}</strong>
            {authenticated ? (
              <Quantity product={product} />
            ) : (
              <a href="/login">Войдите, чтобы добавить в корзину</a>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function Labels({product}: {product: Product}) {
  return (
    <div className="labels">
      {product.isNew && <span className="new">Новинка</span>}
      {product.isHit && <span className="hit">Хит</span>}
    </div>
  );
}

function Rating({value}: {value: number}) {
  return (
    <div className="rating" aria-label={`Рейтинг ${value} из 5`}>
      <img src={asset('star-icon.svg')} alt="" width="20" height="20" />
      {value.toLocaleString('ru-RU')}
    </div>
  );
}
