import {useEffect, useRef, useState} from 'react';

import CheckBox from './CheckBox';
import RangePrice from './RangePrice';
import {FilterState} from '../Structures';

function Filter({
  MIN,
  MAX,
  onFilter,
}: {
  MIN: number;
  MAX: number;
  onFilter: (filters: FilterState) => void;
}) {
  useEffect(() => {
    if (MIN === 0 && MAX === 0) return;
    setPriceMin(MIN);
    setPriceMax(MAX);
  }, [MIN, MAX]);

  const [priceMin, setPriceMin] = useState(MIN);
  const [priceMax, setPriceMax] = useState(MAX);
  const sliderInstance = useRef<any>(null);
  const [styleFont, setStyleFont] = useState('#B9B9B9');

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set());

  const categories = [
    'Смартфоны',
    'Фитнес браслеты',
    'Портативная акустика',
    'Очки виртуальной реальности',
    'Электротранспорт',
    'Умные часы',
  ];
  const colors = [
    'Красный',
    'Оранжевый',
    'Желтый',
    'Зеленый',
    'Голубой',
    'Синий',
    'Фиолетовый',
    'Белый',
    'Черный',
    'Серый',
    'Серебристый',
    'Бежевый',
  ];

  const toggleCategory = (title: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      next.has(title) ? next.delete(title) : next.add(title);
      return next;
    });
  };

  const toggleColor = (title: string) => {
    setSelectedColors((prev) => {
      const next = new Set(prev);
      next.has(title) ? next.delete(title) : next.add(title);
      return next;
    });
  };

  const handleApply = () => {
    onFilter({
      priceMin,
      priceMax,
      categories: selectedCategories,
      colors: selectedColors,
    });
  };

  const handleReset = () => {
    setSelectedCategories(new Set());
    setSelectedColors(new Set());
    setPriceMin(MIN);
    setPriceMax(MAX);
    sliderInstance.current?.set([MIN, MAX]);
    onFilter({
      priceMin: MIN,
      priceMax: MAX,
      categories: new Set(),
      colors: new Set(),
    });
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value);
    if (val < MIN) val = MIN;
    if (val >= priceMax) val = priceMax - 1;
    setPriceMin(val);
    sliderInstance.current?.set([val, null]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value);
    if (val > MAX) val = MAX;
    if (val <= priceMin) val = priceMin + 1;
    setPriceMax(val);
    sliderInstance.current?.set([null, val]);
  };

  return (
    <div className="filter">
      <div className="section">
        <h2>Цена, ₽</h2>
        <div className="price-inputs">
          <div className="input-template">
            <label htmlFor="priceMin">От</label>
            <input
              style={{color: styleFont}}
              id="priceMin"
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(Number(e.target.value))}
              onFocus={() => setStyleFont('#000')}
              onBlur={(e) => {
                setStyleFont('#B9B9B9');
                handleMinChange(e);
              }}
              min="0"
              max={MAX}
            />
          </div>
          <div className="input-template">
            <label htmlFor="priceMax">До</label>
            <input
              style={{color: styleFont}}
              id="priceMax"
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              onFocus={() => setStyleFont('#000')}
              onBlur={(e) => {
                setStyleFont('#B9B9B9');
                handleMaxChange(e);
              }}
              min="0"
              max={MAX}
            />
          </div>
        </div>
        <RangePrice
          MIN={MIN}
          MAX={MAX}
          onUpdate={(min, max) => {
            setPriceMin(min);
            setPriceMax(max);
          }}
          sliderInstance={sliderInstance}
        />
      </div>

      <div className="section">
        <h2>Тип товара</h2>
        <div className="check-list">
          {categories.map((cat) => (
            <CheckBox
              key={cat}
              title={cat}
              checked={selectedCategories.has(cat)}
              onChange={() => toggleCategory(cat)}
            />
          ))}
        </div>
      </div>

      <div className="section">
        <h2>Цвет</h2>
        <div className="check-list">
          {colors.map((color) => (
            <CheckBox
              key={color}
              title={color}
              checked={selectedColors.has(color)}
              onChange={() => toggleColor(color)}
            />
          ))}
        </div>
      </div>

      <div className="buttons">
        <button className="button-blue-template" onClick={handleApply}>
          <span>Показать</span>
        </button>
        <button className="button-pink-template" onClick={handleReset}>
          <span>Сбросить</span>
        </button>
      </div>
    </div>
  );
}

export default Filter;
