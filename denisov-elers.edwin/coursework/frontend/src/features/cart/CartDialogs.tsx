import type {Product} from '../../../../shared/types';
import {Modal} from '../../components/Modal';

interface CartDialogsProps {
  goods: Product[];
  deleting: string[];
  success: boolean;
  closeDeleting: () => void;
  confirmDeleting: () => void;
  closeSuccess: () => void;
  showHistory: () => void;
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
      {props.success && (
        <Modal title="Заказ оформлен" close={props.closeSuccess}>
          <h2>Спасибо, ваш заказ успешно оформлен</h2>
          <button className="primary" onClick={props.showHistory}>
            История заказов
          </button>
        </Modal>
      )}
    </>
  );
}
