import closeCross from '../../assets/images/icons/cross.svg';

import {ProductCart} from '../../components/Structures';

function DeleteProductModalWindow({
  item,
  onConfirm,
  onCancel,
}: {
  item: ProductCart;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="delete-product-window">
      <div className="delete-wrapper">
        <button className="close-button" onClick={onCancel}>
          <img src={closeCross} alt="close cross" />
        </button>

        <div className="content">
          <h3>
            Вы действительно хотите удалить{' '}
            {item.name.charAt(0).toLowerCase() + item.name.slice(1)}?
          </h3>

          <div className="buttons">
            <button className="delete-button" onClick={onCancel}>
              <p>Отмена</p>
            </button>
            <button className="button-blue-template" onClick={onConfirm}>
              <span>Да, удалить</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteProductModalWindow;
