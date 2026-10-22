import type {Product} from '../../../../shared/types';
import {Modal} from '../../components/Modal';
import {asset} from '../../utils/assets';

interface CartDialogsProps {
  goods: Product[];
  deleting: string[];
  orderId: string | null;
  closeDeleting: () => void;
  confirmDeleting: () => void;
  closeSuccess: () => void;
}

export function CartDialogs(props: CartDialogsProps) {
  return (
    <>
      {props.deleting.length > 0 && (
        <Modal title="Подтвердите удаление" close={props.closeDeleting}>
          <h3>
            Вы действительно хотите удалить{' '}
            {props.deleting.length === 1
              ? props.goods.find((product) => product.id === props.deleting[0])
                  ?.name
              : `выбранные товары (${props.deleting.length})`}
            ?
          </h3>
          <div className="actions confirm-actions">
            <button className="pink" onClick={props.closeDeleting}>
              Отмена
            </button>
            <button className="primary" onClick={props.confirmDeleting}>
              Да, удалить
            </button>
          </div>
        </Modal>
      )}
      {props.orderId && (
        <Modal
          title="Спасибо за заказ!"
          close={props.closeSuccess}
          className="order-success"
        >
          <div className="order-success-content">
            <img src={asset('order.png')} width="76" height="51" alt="" />
            <h2>Спасибо за заказ!</h2>
            <p>
              Номер заказа {props.orderId}.
              <br />
              Мы свяжемся с вами в течение 10 минут, чтобы уточнить удобное для
              вас время доставки
            </p>
            <div className="order-success-actions">
              <button className="primary" onClick={props.closeSuccess}>
                Ок
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
