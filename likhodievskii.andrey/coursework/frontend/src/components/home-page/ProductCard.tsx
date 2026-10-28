import {useState} from 'react';

import ratingIcon from '../../assets/images/icons/rating.svg';

import {Product} from '../Structures';

function ProductCard({type, dataImage}: {type: string; dataImage: Product}) {
  const [loaded, setLoaded] = useState(false);

  const isBestsellers = type === 'Хиты продаж';
  const isNovelty = type === 'Новинки';

  const ratingBlock =
    dataImage.rating !== 0.0 ? (
      <div className="rating-wrapper">
        <img src={ratingIcon} alt="rating icon" />
        <span>{dataImage.rating}</span>
      </div>
    ) : null;

  const backgroundStyle = {
    background: `${isBestsellers ? '#FF60C3' : isNovelty ? '#00E398' : 'white'}`,
  };

  return (
    <div className="product-card">
      <div className="img-wrapper">
        <div className="text-wrapper" style={backgroundStyle}>
          <p>{isBestsellers ? 'Хит' : isNovelty ? 'Новинка' : ''}</p>
        </div>
        <img
          src={require(`../../assets/images/goods/image_${dataImage.id}.png`)}
          alt="product img"
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
          onLoad={() => setLoaded(true)}
        />
      </div>
      <h2>{dataImage.price} ₽</h2>
      <p>{dataImage.name}</p>
      {ratingBlock}
    </div>
  );
}

export default ProductCard;
