import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, A11y} from 'swiper/modules';
import type {Product} from '../../../../shared/types';
import {ProductCard} from '../../components/Product';
import {asset} from '../../utils/assets';

const productOrder = {
  hit: ['p8', 'p7', 'p10', 'p6', 'p1'],
  new: ['p2', 'p3', 'p4', 'p1', 'p5'],
};

export function ProductCarousel({
  goods,
  hit,
  open,
}: {
  goods: Product[];
  hit: boolean;
  open: (product: Product) => void;
}) {
  const order = hit ? productOrder.hit : productOrder.new;

  return (
    <section className="carousel-section">
      <div className="carousel-intro">
        <img
          className={hit ? 'hit-icon' : 'new-icon'}
          src={asset(hit ? 'fire-icon.svg' : 'stars-icon.svg')}
          alt=""
        />
        <h2>{hit ? 'Хиты продаж' : 'Новинки'}</h2>
        <p>
          {hit
            ? 'Тысячи покупателей уже одобрили эти товары. Самые популярные, проверенные и надежные гаджеты!'
            : 'Их только произвели - они уже у нас! Все самое новое и свежее на рынке электроники'}
        </p>
      </div>
      <Swiper
        modules={[Navigation, A11y]}
        slidesPerView={3}
        spaceBetween={32}
        loop
        navigation
        a11y={{
          prevSlideMessage: 'Предыдущие товары',
          nextSlideMessage: 'Следующие товары',
        }}
      >
        {goods
          .filter((product) => (hit ? product.isHit : product.isNew))
          .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
          .map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard
                product={product}
                open={() => open(product)}
                carousel
              />
            </SwiperSlide>
          ))}
      </Swiper>
    </section>
  );
}
