import {useState} from 'react';

import bestsellersIcon from '../../assets/images/home-page/bestsellers.svg';
import noveltyIcon from '../../assets/images/home-page/novelty.svg';

import leftArrowIcon from '../../assets/images/home-page/left-arrow.svg';
import rightArrowIcon from '../../assets/images/home-page/right-arrow.svg';

import ProductCard from './ProductCard';
import {Product} from '../../components/Structures';

function ProductSection({
  nameClass,
  title,
  description,
  data,
  isLoading,
}: {
  nameClass: string;
  title: string;
  description: string;
  data: Product[];
  isLoading: boolean;
}) {
  const isBestsellers = title === 'Хиты продаж';
  const isNovelty = title === 'Новинки';

  const getCard = (i: number) => data[i % data.length];

  const [leftIndex, setLeftIndex] = useState(0);

  const slideLeft = () => {
    setLeftIndex((leftIndex - 1 + data.length) % data.length);
  };

  const slideRight = () => {
    setLeftIndex((leftIndex + 1) % data.length);
  };

  return (
    <div className={nameClass}>
      <div className="description">
        <img
          src={isBestsellers ? bestsellersIcon : isNovelty ? noveltyIcon : ''}
          alt="description-icon"
        />
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="cards-wrapper">
        <img
          src={leftArrowIcon}
          className="arrow"
          onClick={slideLeft}
          alt="arrow left icon"
        />
        <div className="cards">
          {isLoading
            ? Array.from({length: 3}).map((_, i) => (
                <div key={i} className="product-card"></div>
              ))
            : [leftIndex, leftIndex + 1, leftIndex + 2].map((i) => {
                const card = getCard(i);
                return card ? (
                  <ProductCard key={card.id} type={title} dataImage={card} />
                ) : null;
              })}
        </div>
        <img
          src={rightArrowIcon}
          className="arrow"
          onClick={slideRight}
          alt="arrow right icon"
        />
      </div>
    </div>
  );
}

export default ProductSection;
