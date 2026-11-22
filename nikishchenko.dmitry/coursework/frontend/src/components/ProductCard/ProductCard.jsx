import {formatPrice, formatRating} from '../../utils/format';
import styles from './ProductCard.module.css';

/**
 * good — товар; onOpen — открыть окно с подробностями (в каталоге);
 * footer — кнопка корзины (в каталоге); на главной карточка без обоих.
 */
export default function ProductCard({good, footer, onOpen, lightTile = false}) {
  const body = (
    <>
      <div
        className={`${styles.tile} ${lightTile ? styles['light-tile'] : ''}`}
      >
        <img
          className={styles.photo}
          src={good.image}
          alt=""
          width="240"
          height="240"
          loading="lazy"
        />
        {(good.isNew || good.isHit) && (
          <div className={styles.labels}>
            {good.isNew && (
              <span className={`${styles.label} ${styles.new}`}>Новинка</span>
            )}
            {good.isHit && (
              <span className={`${styles.label} ${styles.hit}`}>Хит</span>
            )}
          </div>
        )}
      </div>
      <div className={styles.price}>{formatPrice(good.price)}</div>
      {/* длинное название обрезается многоточием, полный текст виден во всплывающей подсказке */}
      <h3 className={styles.name} title={good.name}>
        {good.name}
      </h3>
      <div className={styles.rating}>
        <img src="/images/icons/star.png" alt="" width="20" height="20" />
        <span aria-label={`Рейтинг ${formatRating(good.rating)} из 5`}>
          {formatRating(good.rating)}
        </span>
      </div>
    </>
  );

  return (
    <article className={styles.card}>
      {onOpen ? (
        <div
          className={`${styles.body} ${styles.clickable}`}
          role="button"
          tabIndex={0}
          aria-haspopup="dialog"
          onClick={onOpen}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpen();
            }
          }}
        >
          {body}
        </div>
      ) : (
        <div className={styles.body}>{body}</div>
      )}
      {footer && <div className={styles.footer}>{footer}</div>}
    </article>
  );
}
