export const COLOR_SWATCHES = {
  черный: '#2B2B2B',
  белый: '#FFFFFF',
  серый: '#9AA0A6',
  красный: '#F04438',
  оранжевый: '#FF8A00',
  желтый: '#FFEC41',
  зеленый: '#12B76A',
  голубой: '#84ADFF',
  синий: '#115EFB',
  фиолетовый: '#7A5AF8',
  розовый: '#FF60C3',
  бежевый: '#E8D3B5',
};

export default function Filters({
  draft,
  onDraftChange,
  bounds,
  categories,
  colors,
  onApply,
  onReset,
}) {
  const update = (patch) => onDraftChange({...draft, ...patch});

  const toggleListValue = (field, value) => {
    const list = draft[field].includes(value)
      ? draft[field].filter((v) => v !== value)
      : [...draft[field], value];
    update({[field]: list});
  };

  const from = draft.priceFrom === '' ? bounds.min : Number(draft.priceFrom);
  const to = draft.priceTo === '' ? bounds.max : Number(draft.priceTo);
  const span = bounds.max - bounds.min || 1;
  const fillLeft = ((Math.min(from, to) - bounds.min) / span) * 100;
  const fillRight = 100 - ((Math.max(from, to) - bounds.min) / span) * 100;

  return (
    <aside className="filters">
      <section className="filters-section">
        <h3 className="filters-title">Цена, ₽</h3>
        <div className="filters-price-inputs">
          <label className="filters-price-field">
            <span>От</span>
            <input
              className="filters-price-input"
              type="number"
              value={draft.priceFrom}
              placeholder={bounds.min}
              min={bounds.min}
              max={bounds.max}
              onChange={(e) => update({priceFrom: e.target.value})}
            />
          </label>
          <label className="filters-price-field">
            <span>До</span>
            <input
              className="filters-price-input"
              type="number"
              value={draft.priceTo}
              placeholder={bounds.max}
              min={bounds.min}
              max={bounds.max}
              onChange={(e) => update({priceTo: e.target.value})}
            />
          </label>
        </div>
        <div className="range-slider">
          <div className="range-slider-rail" />
          <div
            className="range-slider-fill"
            style={{left: `${fillLeft}%`, right: `${fillRight}%`}}
          />
          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            value={from}
            aria-label="Цена от"
            onChange={(e) => update({priceFrom: e.target.value})}
          />
          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            value={to}
            aria-label="Цена до"
            onChange={(e) => update({priceTo: e.target.value})}
          />
        </div>
      </section>

      <section className="filters-section">
        <h3 className="filters-title">Тип товара</h3>
        <ul className="filters-list">
          {categories.map((category) => (
            <li key={category}>
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={draft.types.includes(category)}
                  onChange={() => toggleListValue('types', category)}
                />
                <span className="checkbox-box" />
                <span className="checkbox-label">{category}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="filters-section">
        <h3 className="filters-title">Цвет</h3>
        <ul className="filters-list">
          {colors.map((color) => (
            <li key={color}>
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={draft.colors.includes(color)}
                  onChange={() => toggleListValue('colors', color)}
                />
                <span className="checkbox-box" />
                <span
                  className="color-dot"
                  style={{background: COLOR_SWATCHES[color] || '#ccc'}}
                />
                <span className="checkbox-label">{color}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <div className="filters-actions">
        <button type="button" className="btn btn-blue" onClick={onApply}>
          Показать
        </button>
        <button type="button" className="btn btn-text-pink" onClick={onReset}>
          Сбросить
        </button>
      </div>
    </aside>
  );
}
