import type {Product} from '../../../../shared/types';
import {useStore} from '../../context/Store';
import {asset} from '../../utils/assets';

export function Quantity({
  product,
  cartStatus,
}: {
  product: Product;
  cartStatus?: 'compact' | 'full';
}) {
  const {items, setQuantity} = useStore();
  const quantity =
    items.find((item) => item.productId === product.id)?.quantity || 0;
  const status = cartStatus && (
    <span className="primary cart-status" aria-live="polite">
      <img width="16" height="16" src={asset('cart-icon.svg')} alt="" />
      {cartStatus === 'full' ? `В корзине ${quantity} шт.` : `${quantity} шт.`}
    </span>
  );

  return (
    <div className="quantity" onClick={(event) => event.stopPropagation()}>
      {quantity ? (
        <>
          {cartStatus === 'compact' && status}
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
          {cartStatus === 'full' && status}
        </>
      ) : (
        <button className="primary" onClick={() => setQuantity(product.id, 1)}>
          <img width="16" height="16" src={asset('cart-icon.svg')} alt="" />В
          корзину
        </button>
      )}
    </div>
  );
}
