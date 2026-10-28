import Plus from '../../assets/images/icons/plus.svg';
import Minus from '../../assets/images/icons/minus.svg';

import {Product} from '../../components/Structures';

function PlusMinus({
  item,
  addToCart,
  removeFromCart,
  productQuantity,
}: {
  item: Product;
  addToCart: (item: Product) => void;
  removeFromCart: (id: number) => void;
  productQuantity: number;
}) {
  return (
    <div>
      <button className="plus-minus" onClick={() => removeFromCart(item.id)}>
        <img src={Minus} alt="minus" />
      </button>
      <p>{productQuantity}</p>
      <button className="plus-minus" onClick={() => addToCart(item)}>
        <img src={Plus} alt="plus" />
      </button>
    </div>
  );
}

export default PlusMinus;
