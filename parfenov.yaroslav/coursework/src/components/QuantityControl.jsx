import {useStore} from '../context/StoreContext.jsx';

export default function QuantityControl({goodId, compact = false}) {
  const {cart, changeQuantity} = useStore();
  const quantity = Number(cart[goodId] || 0);
  const stop = (callback) => (event) => {
    event.stopPropagation();
    callback();
  };

  if (!quantity)
    return (
      <button
        className={`button ${compact ? 'small' : ''}`}
        type="button"
        onClick={stop(() => changeQuantity(goodId, 1))}
      >
        В корзину
      </button>
    );
  return (
    <div
      className={`quantity ${compact ? 'small' : ''}`}
      onClick={(event) => event.stopPropagation()}
    >
      <button type="button" onClick={() => changeQuantity(goodId, -1)}>
        −
      </button>
      <span>{quantity}</span>
      <button type="button" onClick={() => changeQuantity(goodId, 1)}>
        +
      </button>
    </div>
  );
}
