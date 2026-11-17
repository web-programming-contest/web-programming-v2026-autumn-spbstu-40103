import {useEffect, useState} from 'react';
import Carousel from '../components/Carousel.jsx';
import ProductModal from '../components/ProductModal.jsx';
import {api} from '../api/client.js';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .getGoods({pageSize: 100})
      .then((data) => {
        if (!cancelled) {
          setProducts(data.items);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            'Не удалось загрузить товары. Проверьте, что бекенд запущен на localhost:8080.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const hits = products.filter((p) => p.labels?.includes('Хит'));
  const newArrivals = products.filter((p) => p.labels?.includes('Новинка'));

  return (
    <div className="home-page">
      <div className="container hero">
        <img
          src="/images/banner.svg"
          alt="Super Sale — лучшие гаджеты по лучшим ценам"
          className="hero__image"
        />
      </div>

      <div className="container">
        {isLoading && <p className="home-page__status">Загрузка товаров…</p>}
        {error && (
          <p className="home-page__status home-page__status--error">{error}</p>
        )}

        {!isLoading && !error && (
          <>
            <Carousel
              title="Хиты продаж"
              description="Тысячи покупателей уже одобрили эти товары. Самые популярные, проверенные и надежные гаджеты!"
              icon="/images/icons/flame.svg"
              products={hits}
              onOpen={setSelectedProduct}
            />
            <Carousel
              title="Новинки"
              description="Их только произвели - они уже у нас! Все самое новое и свежее на рынке электроники"
              icon="/images/icons/sparkles.svg"
              products={newArrivals}
              onOpen={setSelectedProduct}
            />
          </>
        )}

        <h2 className="section-title">Преимущества</h2>
        <section className="advantages">
          <div className="advantage-card">
            <img
              src="/images/icons/rocket.svg"
              alt=""
              className="advantage-card__icon"
            />
            <p>Утром заказали, вечером получили</p>
          </div>
          <div className="advantage-card">
            <img
              src="/images/icons/refund.svg"
              alt=""
              className="advantage-card__icon"
            />
            <p>С товаром что-то не так? Вернем деньги</p>
          </div>
          <div className="advantage-card">
            <img
              src="/images/icons/certificate.svg"
              alt=""
              className="advantage-card__icon"
            />
            <p>Только оригинальные товары</p>
          </div>
        </section>

        <section className="contacts">
          <h2 className="contacts__title">Работаем 24/7</h2>
          <div className="contacts__row">
            <div className="contacts__item">
              <img
                src="/images/icons/mobile.svg"
                alt=""
                className="contacts__icon contacts__icon--phone"
              />
              <a href="tel:+78006783424">8 (800) 678-34-24</a>
            </div>
            <div className="contacts__item">
              <img
                src="/images/icons/mail.svg"
                alt=""
                className="contacts__icon"
              />
              <a href="mailto:gadget@hub.ru">gadget@hub.ru</a>
            </div>
            <div className="contacts__item">
              <img
                src="/images/icons/pin.svg"
                alt=""
                className="contacts__icon"
              />
              <span>Санкт-Петербург, ул. Барочная, д.7, корпус 2</span>
            </div>
          </div>
        </section>
      </div>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

export default HomePage;
