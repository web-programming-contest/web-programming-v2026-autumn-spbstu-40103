import {formatPrice, formatRating} from '../../utils/format';
import CartControl from '../CartControl/CartControl';
import Modal from '../Modal/Modal';
import styles from './ProductModal.module.css';

export default function ProductModal({good, onClose}) {
  return (
    <Modal
      label={good.name}
      onClose={onClose}
      width={1304}
      padding="106px 138px 93px"
    >
      <div className={styles.layout}>
        <div className={styles.photo}>
          <img src={good.image} alt="" width="392" height="392" />
        </div>

        <div className={styles.info}>
          <h2 className={styles.title}>{good.name}</h2>

          <div className={styles.meta}>
            <img src="/images/icons/star.png" alt="" width="20" height="20" />
            <span aria-label={`Рейтинг ${formatRating(good.rating)} из 5`}>
              {formatRating(good.rating)}
            </span>
            {good.isNew && (
              <span className={`${styles.label} ${styles.new}`}>Новинка</span>
            )}
            {good.isHit && (
              <span className={`${styles.label} ${styles.hit}`}>Хит</span>
            )}
          </div>

          <p className={styles.description}>{good.description}</p>

          <h3 className={styles['specs-title']}>Характеристики</h3>
          <dl className={styles.specs}>
            {good.specs.map((spec) => (
              <div key={spec.name} className={styles.spec}>
                <dt>{spec.name}</dt>
                <span className={styles.leader} aria-hidden="true" />
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.buy}>
            <div className={styles.price}>{formatPrice(good.price)}</div>
            <CartControl good={good} variant="modal" />
          </div>
        </div>
      </div>
    </Modal>
  );
}
