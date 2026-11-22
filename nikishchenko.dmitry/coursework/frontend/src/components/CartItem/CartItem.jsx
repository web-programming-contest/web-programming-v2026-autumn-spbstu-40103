import {CloseIcon} from '../../icons';
import {formatPrice} from '../../utils/format';
import Checkbox from '../Checkbox/Checkbox';
import LinkButton from '../LinkButton/LinkButton';
import QuantityStepper from '../QuantityStepper/QuantityStepper';
import styles from './CartItem.module.css';

// onQtyChange(next): при next < 1 страница сама спросит, удалять ли товар
export default function CartItem({
  row,
  selected,
  onToggle,
  onQtyChange,
  onRemove,
}) {
  const {good, qty, sum} = row;
  return (
    <div className={styles.item}>
      <div className={styles.check}>
        <Checkbox
          label=""
          checked={selected}
          onChange={onToggle}
          ariaLabel={`Выбрать: ${good.name}`}
        />
      </div>
      <div className={styles.photo}>
        <img src={good.image} alt="" width="148" height="148" loading="lazy" />
      </div>
      <h3 className={styles.name} title={good.name}>
        {good.name}
      </h3>
      <div className={styles.cell}>
        <QuantityStepper value={qty} onChange={onQtyChange} />
      </div>
      <div className={`${styles.cell} ${styles.sum}`}>{formatPrice(sum)}</div>
      <div className={styles.cell}>
        <LinkButton
          icon={<CloseIcon size={12} strokeWidth={3.6} />}
          onClick={onRemove}
          aria-label={`Удалить: ${good.name}`}
        >
          Удалить
        </LinkButton>
      </div>
    </div>
  );
}
