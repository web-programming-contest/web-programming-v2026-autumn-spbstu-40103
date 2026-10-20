import {useState, useEffect} from 'react'
import {CATEGORY_OPTIONS, COLOR_OPTIONS, DEFAULT_PRICE_MIN, DEFAULT_PRICE_MAX} from '../utils/constants'
import PriceRangeSlider from './PriceRangeSlider'
import {Checkbox} from './Checkbox'
import './FilterPanel.css'

export default function FilterPanel({initialFilters, priceBounds, onApply, onReset}) {
  const boundsMin = priceBounds?.min ?? DEFAULT_PRICE_MIN
  const boundsMax = priceBounds?.max ?? DEFAULT_PRICE_MAX

  const [minPrice, setMinPrice] = useState(initialFilters.minPrice ?? boundsMin)
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice ?? boundsMax)
  const [categories, setCategories] = useState(initialFilters.category ?? [])
  const [colors, setColors] = useState(initialFilters.color ?? [])

  useEffect(() => {
    setMinPrice(initialFilters.minPrice ?? boundsMin)
    setMaxPrice(initialFilters.maxPrice ?? boundsMax)
    setCategories(initialFilters.category ?? [])
    setColors(initialFilters.color ?? [])
  }, [initialFilters, boundsMin, boundsMax])

  const sliderMin = clampNumber(minPrice, boundsMin, boundsMax)
  const sliderMax = clampNumber(maxPrice, boundsMin, boundsMax)

  function clampNumber(value, lo, hi) {
    const n = Number(value)
    if (Number.isNaN(n)) {
      return lo
    }
    return Math.min(Math.max(n, lo), hi)
  }

  const handleSliderChange = ([nextMin, nextMax]) => {
    setMinPrice(nextMin)
    setMaxPrice(nextMax)
  }

  const toggle = (list, setList, value) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  const handleApply = () => {
    onApply({
      minPrice: minPrice === '' ? undefined : Number(minPrice),
      maxPrice: maxPrice === '' ? undefined : Number(maxPrice),
      category: categories,
      color: colors,
    })
  }

  const handleReset = () => {
    setMinPrice(boundsMin)
    setMaxPrice(boundsMax)
    setCategories([])
    setColors([])
    onReset()
  }

  return (
    <aside className="filter-panel">
      <div className="filter-panel__section">
        <h3 className="filter-panel__title">Цена, ₽</h3>
        <div className="filter-panel__price-row">
          <div className="field">
            <label className="field__label" htmlFor="price-from">
              От
            </label>
            <input
              className="field__input"
              type="text"
              inputMode="numeric"
              id="price-from"
              placeholder={String(boundsMin)}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ''))}
              onBlur={() => setMinPrice(clampNumber(minPrice, boundsMin, boundsMax))}
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="price-to">
              До
            </label>
            <input
              className="field__input"
              type="text"
              inputMode="numeric"
              id="price-to"
              placeholder={String(boundsMax)}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ''))}
              onBlur={() => setMaxPrice(clampNumber(maxPrice, boundsMin, boundsMax))}
            />
          </div>
        </div>

        <PriceRangeSlider
          min={boundsMin}
          max={boundsMax}
          value={[sliderMin, sliderMax]}
          onChange={handleSliderChange}
        />
      </div>

      <div className="filter-panel__section">
        <h3 className="filter-panel__title">Тип товара</h3>
        <div className="filter-panel__options">
          {CATEGORY_OPTIONS.map((opt) => (
            <Checkbox
              key={opt.value}
              checked={categories.includes(opt.value)}
              onChange={() => toggle(categories, setCategories, opt.value)}
            >
              {opt.label}
            </Checkbox>
          ))}
        </div>
      </div>

      <div className="filter-panel__section">
        <h3 className="filter-panel__title">Цвет</h3>
        <div className="filter-panel__options">
          {COLOR_OPTIONS.map((opt) => (
            <Checkbox
              key={opt.value}
              checked={colors.includes(opt.value)}
              onChange={() => toggle(colors, setColors, opt.value)}
            >
              {opt.label}
            </Checkbox>
          ))}
        </div>
      </div>

      <div className="filter-panel__actions">
        <button type="button" className="btn btn--primary" onClick={handleApply}>
          Показать
        </button>
        <button type="button" className="filter-panel__reset" onClick={handleReset}>
          Сбросить
        </button>
      </div>
    </aside>
  )
}
