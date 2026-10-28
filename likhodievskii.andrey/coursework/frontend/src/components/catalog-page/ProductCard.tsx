import {useState} from 'react';

import ratingIcon from '../../assets/images/icons/rating.svg';

import ButtonCard from './ButtonCard';
import {Product} from '../../components/Structures';
import {ProductCart} from '../../components/Structures';

function ProductCard({
  item,
  cartItems,
  setActiveProduct,
  addToCart,
  removeFromCart,
}: {
  item: Product;
  cartItems: ProductCart[];
  setActiveProduct: (product: Product | null) => void;
  addToCart: (item: Product) => void;
  removeFromCart: (id: number) => void;
}) {
  const [loaded, setLoaded] = useState(false);

  const ratingBlock =
    item.rating !== 0.0 ? (
      <div className="rating-wrapper">
        <img src={ratingIcon} alt="rating icon" />
        <span>{item.rating}</span>
      </div>
    ) : null;

  return (
    <div className="product-card">
      <div onClick={() => setActiveProduct(item)} style={{cursor: 'pointer'}}>
        <div className="img-wrapper">
          <div className="text-wrapper">
            {item.isNovelty ? (
              <div className="label novelty">
                <p>Новинка</p>
              </div>
            ) : null}

            {item.isBestseller ? (
              <div className="label bestseller">
                <p>Хит</p>
              </div>
            ) : null}
          </div>
          <img
            src={require(`../../assets/images/goods/image_${item.id}.png`)}
            alt="product img"
            style={{
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
            onLoad={() => setLoaded(true)}
          />
        </div>
        <h2>{item.price} ₽</h2>
        <p>{item.name}</p>
        {ratingBlock}
      </div>

      <ButtonCard
        item={item}
        cartItems={cartItems}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
      />
    </div>
  );
}

export default ProductCard;
