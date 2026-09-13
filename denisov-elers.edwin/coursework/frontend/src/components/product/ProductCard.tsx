import type {Product} from '../../../../shared/types';
import {money} from '../../utils/format';
import {ProductLabels} from './ProductLabels';
import {Quantity} from './Quantity';
import {Rating} from './Rating';

interface ProductCardProps {
  product: Product;
  open: () => void;
  carousel?: boolean;
}

export function ProductCard({
  product,
  open,
  carousel = false,
}: ProductCardProps) {
  return (
    <article className="product-card">
      <button
        className="product-open"
        onClick={open}
        aria-label={`Подробнее: ${product.name}`}
      >
        <div className="product-image">
          <img src={product.image} alt={product.name} />
          <ProductLabels product={product} />
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
