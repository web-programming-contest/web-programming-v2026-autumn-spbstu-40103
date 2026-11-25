import {useEffect, useState} from 'react';
import {fetchGoods} from '../api.js';
import Carousel from '../components/Carousel.jsx';

function FlameIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <path
        fill="#F04438"
        d="M12 2c1 3-1.5 4.5-2.5 6C8.4 9.6 8 11 8 12.5A4.5 4.5 0 0 0 12.5 17c2.8 0 5-2.2 5-5 0-1.5-.5-2.6-1.2-3.7-.4 1-1 1.7-2 2.2.4-2.8-.3-6-2.3-8.5zM7 22h10v-1.5H7z"
      />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
      <path
        fill="#00E398"
        d="M12 3l1.7 4.6L18 9.2l-4.3 1.6L12 15.5l-1.7-4.7L6 9.2l4.3-1.6zm6 10l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9zM5 14l.8 2.2 2.2.8-2.2.8L5 20l-.8-2.2L2 17l2.2-.8z"
      />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true">
      <path
        fill="#FF60C3"
        d="M30 6c6 0 10 4 10 10 0 8-8 16-14 20l-4-4c4-6 12-14 8-26zM14 30c-3 1-5 5-5 9 4 0 8-2 9-5zm4-6l6 6-3 3-6-6z"
      />
      <circle cx="30" cy="16" r="3" fill="#fff" />
    </svg>
  );
}

function MoneyBackIcon() {
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true">
      <path
        fill="#115EFB"
        d="M24 6a18 18 0 1 0 18 18h-5a13 13 0 1 1-13-13v-5z"
        opacity="0.9"
      />
      <path fill="#115EFB" d="M24 6l8 5-8 5z" />
      <text
        x="17"
        y="30"
        fontSize="16"
        fontWeight="700"
        fill="#115EFB"
        fontFamily="Rubik, sans-serif"
      >
        ₽
      </text>
    </svg>
  );
}

function CertificateIcon() {
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true">
      <rect x="8" y="8" width="32" height="24" rx="3" fill="#00E398" />
      <rect x="12" y="13" width="16" height="3" rx="1.5" fill="#fff" />
      <rect x="12" y="19" width="12" height="3" rx="1.5" fill="#fff" />
      <circle
        cx="33"
        cy="30"
        r="7"
        fill="#00E398"
        stroke="#fff"
        strokeWidth="2.5"
      />
      <path d="M30 30l2 2 4-4" stroke="#fff" strokeWidth="2" fill="none" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <rect x="7" y="2" width="10" height="20" rx="2.5" fill="#0C368A" />
      <rect x="9" y="4" width="6" height="14" rx="1" fill="#fff" />
      <circle cx="12" cy="19.5" r="1" fill="#fff" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" fill="#0C368A" />
      <path d="M3 7l9 6 9-6" stroke="#fff" strokeWidth="1.6" fill="none" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="#0C368A"
        d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7z"
      />
      <circle cx="12" cy="9" r="2.6" fill="#fff" />
    </svg>
  );
}

const ADVANTAGES = [
  {icon: <RocketIcon />, text: 'Утром заказали, вечером получили'},
  {icon: <MoneyBackIcon />, text: 'С товаром что-то не так? Вернем деньги'},
  {icon: <CertificateIcon />, text: 'Только оригинальные товары'},
];

export default function MainPage() {
  const [goods, setGoods] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGoods()
      .then(setGoods)
      .catch(() =>
        setError('Не удалось загрузить товары. Проверьте, что бэкенд запущен.'),
      );
  }, []);

  const hits = goods.filter((g) => g.isHit);
  const news = goods.filter((g) => g.isNew);

  return (
    <div className="main-page">
      <section className="hero container">
        <div className="hero-banner">
          <div className="hero-content">
            <p className="hero-title">
              SUPER
              <br />
              SALE
            </p>
            <p className="hero-caption">
              Умный робот-друг Red solution Reddy Air
            </p>
          </div>
          <div className="hero-badge">
            <svg
              viewBox="0 0 120 120"
              className="hero-badge-star"
              aria-hidden="true"
            >
              <path
                fill="#FFEC41"
                d="M60 0l9 14 16-6 2 17 17 2-6 16 14 9-14 9 6 16-17 2-2 17-16-6-9 14-9-14-16 6-2-17-17-2 6-16L6 60l14-9-6-16 17-2 2-17 16 6z"
              />
            </svg>
            <span className="hero-badge-discount">-10%</span>
            <span className="hero-badge-price">27990 ₽</span>
            <span className="hero-badge-old">34190 ₽</span>
          </div>
          <img
            className="hero-robot"
            src="/images/promo/hero-robot.png"
            alt="Умный робот-друг"
          />
        </div>
      </section>

      {error && <p className="container page-error">{error}</p>}

      <section className="showcase container">
        <div className="showcase-head">
          <FlameIcon />
          <h2 className="showcase-title">Хиты продаж</h2>
          <p className="showcase-text">
            Тысячи покупателей уже одобрили эти товары. Самые популярные,
            проверенные и надежные гаджеты!
          </p>
        </div>
        <Carousel items={hits} />
      </section>

      <section className="showcase container">
        <div className="showcase-head">
          <SparklesIcon />
          <h2 className="showcase-title">Новинки</h2>
          <p className="showcase-text">
            Их только произвели - они уже у нас! Все самое новое и свежее на
            рынке электроники
          </p>
        </div>
        <Carousel items={news} />
      </section>

      <section className="advantages container">
        <h2 className="section-title">Преимущества</h2>
        <div className="advantages-grid">
          {ADVANTAGES.map((item) => (
            <div className="advantage-card" key={item.text}>
              {item.icon}
              <p className="advantage-card-text">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="contacts container">
        <h2 className="section-title">Работаем 24/7</h2>
        <div className="contacts-grid">
          <a className="contact-item" href="tel:88006783424">
            <PhoneIcon />
            <span>8 (800) 678-34-24</span>
          </a>
          <a className="contact-item" href="mailto:gadget@hub.ru">
            <MailIcon />
            <span>gadget@hub.ru</span>
          </a>
          <div className="contact-item">
            <PinIcon />
            <span>
              Санкт-Петербург, ул.
              <br />
              Барочная, д.7, корпус 2
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
