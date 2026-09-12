import {useState} from 'react';
import {Link} from 'react-router-dom';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, A11y} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import type {Product} from '../../../shared/types';
import {useStore} from '../context/Store';
import {ProductCard, ProductModal} from '../components/Product';
import {asset} from '../api';

export function Home() {
  const {goods} = useStore();
  const [product, setProduct] = useState<Product | null>(null);

  return (
    <main className="container home">
      <h1 className="sr-only">Gadget Hub — магазин надежных гаджетов</h1>
      <Link to="/catalog">
        <img
          className="banner"
          src={asset('banner.png')}
          width="1240"
          height="560"
          alt="Умный робот-друг Red solution Reddy Air — 27 990 рублей, скидка 10%"
        />
      </Link>
      {[true, false].map((hit) => (
        <section className="carousel-section" key={String(hit)}>
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
              .filter((p) => (hit ? p.isHit : p.isNew))
              .sort((a, b) => {
                const order = hit
                  ? ['p8', 'p7', 'p10', 'p6', 'p1']
                  : ['p2', 'p3', 'p4', 'p1', 'p5'];
                return order.indexOf(a.id) - order.indexOf(b.id);
              })
              .map((p) => (
                <SwiperSlide key={p.id}>
                  <ProductCard
                    product={p}
                    open={() => setProduct(p)}
                    carousel
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        </section>
      ))}
      <section className="advantages">
        <h2>Преимущества</h2>
        <div>
          {[
            ['rocket-icon.svg', 'Утром заказали, вечером получили'],
            ['rouble-icon.svg', 'С товаром что-то не так? Вернем деньги'],
            ['license-icon.svg', 'Только оригинальные товары'],
          ].map(([src, text]) => (
            <article key={src}>
              <img src={asset(src)} width="72" height="72" alt="" />
              <h3>{text}</h3>
            </article>
          ))}
        </div>
      </section>
      <section className="contacts">
        <h2>Работаем 24/7</h2>
        <div>
          <a href="tel:88006783424">
            <span className="contact-icon phone">
              <img src={asset('mobile-icon.svg')} alt="" />
            </span>
            8 (800) 678-34-24
          </a>
          <a href="mailto:gadget@hub.ru">
            <span className="contact-icon">
              <img src={asset('email-icon.svg')} alt="" />
            </span>
            gadget@hub.ru
          </a>
          <p>
            <span className="contact-icon">
              <img src={asset('map-pin-icon.svg')} alt="" />
            </span>
            Санкт-Петербург, ул. Барочная, д.7, корпус 2
          </p>
        </div>
      </section>
      {product && (
        <ProductModal product={product} close={() => setProduct(null)} />
      )}
    </main>
  );
}
