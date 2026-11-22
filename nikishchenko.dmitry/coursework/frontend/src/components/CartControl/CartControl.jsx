import {Link} from 'react-router-dom';
import {CartIcon} from '../../icons';
import {useCart} from '../../context/CartContext';
import Button from '../Button/Button';
import buttonStyles from '../Button/Button.module.css';
import QuantityStepper from '../QuantityStepper/QuantityStepper';
import styles from './CartControl.module.css';

// variant="card": розовая плашка «N шт.» слева от степпера (карточка в каталоге)
// variant="modal": степпер слева, справа плашка «В корзине N шт.» (окно товара)
export default function CartControl({good, variant = 'card'}) {
  const {getQty, add, setQty} = useCart();
  const qty = getQty(good.id);

  if (qty === 0) {
    return (
      <Button icon={<CartIcon />} onClick={() => add(good.id)}>
        В корзину
      </Button>
    );
  }

  const badge = (
    <Link
      to="/cart"
      className={`${buttonStyles.button} ${buttonStyles.pink}`}
      title="Перейти в корзину"
    >
      <CartIcon />
      {variant === 'modal' ? `В корзине ${qty} шт.` : `${qty} шт.`}
    </Link>
  );
  const stepper = (
    <QuantityStepper value={qty} onChange={(next) => setQty(good.id, next)} />
  );

  return (
    <div className={styles.row}>
      {variant === 'modal' ? (
        <>
          {stepper}
          {badge}
        </>
      ) : (
        <>
          {badge}
          {stepper}
        </>
      )}
    </div>
  );
}
