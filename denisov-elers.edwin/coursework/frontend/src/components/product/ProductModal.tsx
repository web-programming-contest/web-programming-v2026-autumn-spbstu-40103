import type {Product} from '../../../../shared/types';
import {useStore} from '../../context/Store';
import {money} from '../../utils/format';
import {Modal} from '../Modal';
import {ProductLabels} from './ProductLabels';
import {Quantity} from './Quantity';
import {Rating} from './Rating';

export function ProductModal({
  product,
  close,
}: {
  product: Product;
  close: () => void;
}) {
  const {authenticated} = useStore();

  return (
    <Modal title={product.name} close={close} wide>
      <div className="product-detail">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
          <ProductLabels product={product} />
        </div>
        <div>
          <h2>{product.name}</h2>
          <Rating value={product.rating} />
          <p>{product.description}</p>
          <h3>Характеристики</h3>
          <dl>
            {Object.entries(product.characteristics).map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <div className="detail-buy">
            <strong className="price">{money(product.price)}</strong>
            {authenticated ? (
              <Quantity product={product} />
            ) : (
              <a href="/login">Войдите, чтобы добавить в корзину</a>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
