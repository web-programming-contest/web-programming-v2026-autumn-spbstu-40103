import {Link} from 'react-router-dom';
import buttonStyles from '../Button/Button.module.css';
import styles from './EmptyCart.module.css';

export default function EmptyCart() {
  return (
    <section className={styles.empty} aria-labelledby="empty-cart-title">
      <img
        className={styles.picture}
        src="/images/empty-cart.png"
        alt=""
        width="148"
        height="134"
      />
      <h2 id="empty-cart-title" className={styles.title}>
        Пока пусто
      </h2>
      <p className={styles.text}>
        Ознакомьтесь с новинками и хитами на главной или найдите нужное в
        каталоге
      </p>
      <div className={styles.actions}>
        <Link
          to="/catalog"
          className={`${buttonStyles.button} ${buttonStyles.blue}`}
        >
          Перейти в каталог
        </Link>
        <Link to="/" className={styles.home}>
          Главная страница
        </Link>
      </div>
    </section>
  );
}
