export const money = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

export function Labels({good}) {
  if (!good.isNew && !good.isHit) return null;
  return (
    <div className="labels">
      {good.isNew && <span className="label label-new">Новинка</span>}
      {good.isHit && <span className="label label-hit">Хит</span>}
    </div>
  );
}

export default function ProductCard({
  good,
  onClick,
  children,
  compact = false,
}) {
  return (
    <article
      className={`product-card ${compact ? 'compact' : 'catalog-card'}`}
      onClick={onClick}
    >
      <Labels good={good} />
      <div className="product-image-wrap">
        <img
          className="product-image"
          src={`/assets/goods/image_${good.id}.png`}
          alt={good.name}
        />
      </div>
      <h3>{good.name}</h3>
      <div className="card-meta">
        <strong>{money.format(good.price)}</strong>
        <span className="rating">
          <span>★</span> {good.rating}
        </span>
      </div>
      {children}
    </article>
  );
}
