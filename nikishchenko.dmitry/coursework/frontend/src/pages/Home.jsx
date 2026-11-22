import ProductRow from '../components/ProductRow/ProductRow';
import {useGoods} from '../hooks/useGoods';
import {pickHits, pickNew} from '../utils/goodsSelectors';
import {MailIcon, PhoneIcon, PinIcon} from '../icons';
import styles from './Home.module.css';
import {usePageTitle} from '../hooks/usePageTitle';

const ICONS = {
  flame: {src: '/images/icons/flame.png', width: 35, height: 41, frame: 44},
  sparkles: {
    src: '/images/icons/sparkles.png',
    width: 45,
    height: 46,
    frame: 47,
  },
};

const ADVANTAGES = [
  {
    icon: {src: '/images/icons/rocket.png', width: 63, height: 63},
    text: ['Утром заказали,', 'вечером получили'],
  },
  {
    icon: {src: '/images/icons/ruble.png', width: 66, height: 72, shift: -2},
    text: ['С товаром что-то не так?', 'Вернем деньги'],
  },
  {
    icon: {src: '/images/icons/cert.png', width: 64, height: 56, shift: 4},
    text: ['Только оригинальные товары'],
  },
];

export default function Home() {
  usePageTitle();
  const {goods, status, reload} = useGoods();

  return (
    <div className={`container ${styles.page}`}>
      <img
        className={styles.banner}
        src="/images/banner.webp"
        width="1240"
        height="560"
        alt="Суперраспродажа: умный робот-друг Red solution Reddy Air за 27990 ₽ вместо 31100 ₽, скидка 10%"
      />

      <div className={styles.rows}>
        <ProductRow
          icon={ICONS.flame}
          title="Хиты продаж"
          text="Тысячи покупателей уже одобрили эти товары. Самые популярные, проверенные и надежные гаджеты!"
          goods={pickHits(goods)}
          status={status}
          onRetry={reload}
        />
        <ProductRow
          icon={ICONS.sparkles}
          title="Новинки"
          text="Их только произвели - они уже у нас! Все самое новое и свежее на рынке электроники"
          goods={pickNew(goods)}
          status={status}
          onRetry={reload}
          lightTiles
          introTop={43}
        />
      </div>

      <section className={styles.block} aria-labelledby="advantages-title">
        <h2 id="advantages-title" className={styles.heading}>
          Преимущества
        </h2>
        <ul className={styles.advantages}>
          {ADVANTAGES.map(({icon, text}) => (
            <li key={text[0]} className={styles.advantage}>
              <span className={styles['advantage-icon']}>
                <img
                  src={icon.src}
                  width={icon.width}
                  height={icon.height}
                  alt=""
                  style={
                    icon.shift
                      ? {transform: `translateY(${icon.shift}px)`}
                      : undefined
                  }
                />
              </span>
              <p className={styles['advantage-text']}>
                {text.map((line, i) => (
                  <span key={line}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section
        className={`${styles.block} ${styles['contacts-block']}`}
        aria-labelledby="contacts-title"
      >
        <h2 id="contacts-title" className={styles.heading}>
          Работаем 24/7
        </h2>
        <ul className={styles.contacts}>
          <li>
            <a className={styles.contact} href="tel:88006783424">
              <span className={styles['contact-icon']}>
                <PhoneIcon size={40} />
              </span>
              8 (800) 678-34-24
            </a>
          </li>
          <li>
            <a className={styles.contact} href="mailto:gadget@hub.ru">
              <span className={styles['contact-icon']}>
                <MailIcon />
              </span>
              gadget@hub.ru
            </a>
          </li>
          <li>
            <address className={styles.contact}>
              <span className={styles['contact-icon']}>
                <PinIcon />
              </span>
              Санкт-Петербург, ул. Барочная, д.7, корпус 2
            </address>
          </li>
        </ul>
      </section>
    </div>
  );
}
