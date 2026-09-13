import type {Product} from '../../../../shared/types';
import {useStore} from '../../context/Store';
import {asset} from '../../utils/assets';

export function Quantity({
  product,
  showCartStatus = false,
}: {
  product: Product;
  showCartStatus?: boolean;
}) {
  const {items, setQuantity} = useStore();
  const quantity =
    items.find((item) => item.productId === product.id)?.quantity || 0;

  return (
    <div className="quantity" onClick={(event) => event.stopPropagation()}>
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
          {showCartStatus && (
            <span className="primary cart-status" aria-live="polite">
              <img width="16" height="16" src={asset('cart-icon.svg')} alt="" />
              В корзине {quantity} шт.
            </span>
          )}
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
