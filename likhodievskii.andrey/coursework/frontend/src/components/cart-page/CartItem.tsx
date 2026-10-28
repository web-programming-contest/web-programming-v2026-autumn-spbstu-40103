import {useState, useEffect} from 'react';

import closeCross from '../../assets/images/icons/cross_pink.svg';

import PlusMinus from '../catalog-page/PlusMinus';
import DeleteProductModalWindow from '../../components/cart-page/DeleteProductModalWindow';
import {Product} from '../../components/Structures';
import {ProductCart} from '../../components/Structures';

function CartItem({
  item,
  card,
  cartItems,
  addToCart,
  removeFromCart,
  selected,
  onSelect,
}: {
  item: ProductCart;
  card: Product;
  cartItems: ProductCart[];
  addToCart: (item: Product) => void;
  removeFromCart: (id: number) => void;
  selected: boolean;
  onSelect: () => void;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const productQuantity =
    cartItems.find((cartItem) => cartItem.id === item.id)?.quantity ?? 0;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowConfirm(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="cart-item">
      <div className="check-with-img">
        <label className="check-item" tabIndex={0}>
          <input type="checkbox" checked={selected} onChange={onSelect} />
          <div className="checkmark" />
        </label>

        <div className="img-wrapper">
          <img
            src={require(`../../assets/images/goods/image_${item.id}.png`)}
            alt="product img"
          />
        </div>

        <p className="name">{item.name}</p>
      </div>

      <div className="add-more">
        <PlusMinus
          item={card}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          productQuantity={productQuantity}
        />
      </div>

      <h2>{card.price * productQuantity} ₽</h2>

      <button className="delete-button" onClick={() => setShowConfirm(true)}>
        <img src={closeCross} alt="close cross" />
        <p>Удалить</p>
      </button>

      {showConfirm && (
        <DeleteProductModalWindow
          item={item}
          onConfirm={() => {
            removeFromCart(item.id);
            if (selected) onSelect();
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

export default CartItem;
