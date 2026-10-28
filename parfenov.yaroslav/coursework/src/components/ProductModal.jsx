import Modal from './Modal.jsx';
import QuantityControl from './QuantityControl.jsx';
import {Labels, money} from './ProductCard.jsx';

export default function ProductModal({good, onClose}) {
  return (
    <Modal onClose={onClose}>
      <div className="product-modal">
        <div className="modal-media">
          <img
            className="product-image"
            src={`/assets/goods/image_${good.id}.png`}
            alt={good.name}
          />
        </div>
        <div className="modal-info">
          <Labels good={good} />
          <span className="eyebrow">{good.category}</span>
          <h2>{good.name}</h2>
          <div className="modal-price-row">
            <strong>{money.format(good.price)}</strong>
            <span className="rating">
              <span>★</span> {good.rating}
            </span>
          </div>
          <p>{good.description}</p>
          <h3>Характеристики</h3>
          <ul>
            {good.specs.map((spec) => (
              <li key={spec}>{spec}</li>
            ))}
          </ul>
          <div className="modal-action">
            <QuantityControl goodId={good.id} />
          </div>
        </div>
      </div>
    </Modal>
  );
}
