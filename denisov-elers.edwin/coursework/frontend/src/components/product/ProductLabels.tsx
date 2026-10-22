import type {Product} from '../../../../shared/types';

export function ProductLabels({product}: {product: Product}) {
  return (
    <div className="labels">
      {product.isNew && <span className="new">Новинка</span>}
      {product.isHit && <span className="hit">Хит</span>}
    </div>
  );
}
