import Button from '../Button/Button';
import Modal, {ModalActions} from '../Modal/Modal';
import styles from './OrderSuccessModal.module.css';

export default function OrderSuccessModal({order, onClose}) {
  const when = order.delivery === 'delivery' ? 'доставки' : 'самовывоза';
  return (
    <Modal label="Заказ оформлен" onClose={onClose}>
      <img
        className={styles.picture}
        src="/images/thanks.png"
        alt=""
        width="76"
        height="51"
      />
      <h2 className={styles.title}>Спасибо за заказ!</h2>
      <p className={styles.text}>
        Ваш заказ успешно оформлен. Номер заказа {order.id}.
      </p>
      <p className={styles.text}>
        Мы свяжемся с вами в течение 10 минут, чтобы уточнить удобное для вас
        время {when}
      </p>
      <ModalActions>
        <Button onClick={onClose}>Ок</Button>
      </ModalActions>
    </Modal>
  );
}
