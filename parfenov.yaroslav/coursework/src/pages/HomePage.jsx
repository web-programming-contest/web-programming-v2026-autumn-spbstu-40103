import {useState} from 'react';
import ProductCard from '../components/ProductCard.jsx';
import {useStore} from '../context/StoreContext.jsx';

function Carousel({title, goods}) {
  const [start, setStart] = useState(0);
  const visible = Array.from(
    {length: Math.min(4, goods.length)},
    (_, index) => goods[(start + index) % goods.length],
  );
  const move = (direction) =>
    setStart((value) => (value + direction + goods.length) % goods.length);
  return (
    <section className="product-section">
      <div className="section-heading">
        <h2>{title}</h2>
        <div className="carousel-controls">
          <button className="circle-button" onClick={() => move(-1)}>
            ←
          </button>
          <button className="circle-button" onClick={() => move(1)}>
            →
          </button>
        </div>
      </div>
      <div className="carousel-grid">
        {visible.map((good) => (
          <ProductCard key={good.id} good={good} compact />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const {goods, loading, error} = useStore();
  if (loading)
    return (
      <section className="state-page">
        <div className="loader" />
        <p>Загружаем витрину…</p>
      </section>
    );
  if (error)
    return (
      <section className="state-page">
        <h1>Не удалось открыть магазин</h1>
        <p>{error}</p>
      </section>
    );
  return (
    <>
      <section className="hero container">
        <img src="/assets/hero.png" alt="Суперраспродажа" />
      </section>
      <div className="container home-content">
        <Carousel
          title="Хиты продаж"
          goods={goods.filter((good) => good.isHit)}
        />
        <Carousel title="Новинки" goods={goods.filter((good) => good.isNew)} />
        <section className="benefits">
          <div className="section-heading">
            <h2>Почему Gadget Hub</h2>
          </div>
          <div className="benefits-grid">
            <article>
              <span className="benefit-icon">⚡</span>
              <h3>Доставка в день заказа</h3>
              <p>Привезем по Санкт-Петербургу за несколько часов.</p>
            </article>
            <article>
              <span className="benefit-icon">✓</span>
              <h3>Только оригиналы</h3>
              <p>Проверяем поставщиков и даем официальную гарантию.</p>
            </article>
            <article>
              <span className="benefit-icon">↻</span>
              <h3>30 дней на возврат</h3>
              <p>Простой возврат без лишних вопросов.</p>
            </article>
          </div>
        </section>
        <section className="contact-block">
          <div>
            <span className="eyebrow">Есть вопросы?</span>
            <h2>Поможем выбрать гаджет</h2>
            <p>Позвоните нам ежедневно с 9:00 до 21:00.</p>
          </div>
          <a className="button button-light" href="tel:+78006783424">
            8 (800) 678-34-24
          </a>
        </section>
      </div>
    </>
  );
}
