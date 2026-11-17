import {useEffect, useState} from 'react';
import ProductCard from '../components/ProductCard.jsx';
import ProductModal from '../components/ProductModal.jsx';
import {api} from '../api/client.js';

const SORT_OPTIONS = [
  {value: 'newest', label: 'Новые'},
  {value: 'popular', label: 'Популярные'},
  {value: 'priceAsc', label: 'Подешевле'},
  {value: 'priceDesc', label: 'Подороже'},
];

const CATEGORIES = [
  'Аксессуары',
  'Наушники',
  'Очки виртуальной реальности',
  'Портативная акустика',
];

const COLORS = [
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
  'Розовый',
  'Бежевый',
];

const emptyFilters = {priceFrom: '', priceTo: '', categories: [], colors: []};

function CatalogPage() {
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [draftFilters, setDraftFilters] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
  const [result, setResult] = useState({items: [], totalPages: 1, total: 0});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const minPrice = Number(result.minPrice ?? 0);
  const maxPrice = Number(result.maxPrice ?? 100000);
  const sliderFrom =
    draftFilters.priceFrom === ''
      ? minPrice
      : Math.max(minPrice, Number(draftFilters.priceFrom));
  const sliderTo =
    draftFilters.priceTo === ''
      ? maxPrice
      : Math.min(maxPrice, Number(draftFilters.priceTo));
  const priceRange = Math.max(1, maxPrice - minPrice);
  const leftPercent = ((sliderFrom - minPrice) / priceRange) * 100;
  const rightPercent = ((sliderTo - minPrice) / priceRange) * 100;

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    api
      .getGoods({
        sort,
        page,
        priceFrom: appliedFilters.priceFrom,
        priceTo: appliedFilters.priceTo,
        category: appliedFilters.categories.join(','),
        color: appliedFilters.colors.join(','),
      })
      .then((data) => {
        if (!cancelled) {
          setResult(data);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            'Не удалось загрузить товары. Проверьте, что бекенд запущен на localhost:8080.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [sort, page, appliedFilters]);

  function toggleDraftValue(key, value) {
    setDraftFilters((prev) => {
      const current = prev[key];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return {...prev, [key]: next};
    });
  }

  function handleApplyFilters() {
    setPage(1);
    setAppliedFilters(draftFilters);
  }

  function handleResetFilters() {
    setDraftFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setPage(1);
  }

  function handleSortChange(value) {
    setSort(value);
    setPage(1);
  }

  function handlePriceSlider(which, rawValue) {
    const value = Number(rawValue);
    setDraftFilters((prev) => {
      const currentFrom =
        prev.priceFrom === '' ? minPrice : Number(prev.priceFrom);
      const currentTo = prev.priceTo === '' ? maxPrice : Number(prev.priceTo);
      if (which === 'from') {
        return {...prev, priceFrom: String(Math.min(value, currentTo - 1))};
      }
      return {...prev, priceTo: String(Math.max(value, currentFrom + 1))};
    });
  }

  return (
    <div className="catalog-page">
      <div className="container">
        <h1 className="catalog-page__title">Каталог товаров</h1>

        <div className="catalog-page__sort">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`sort-tab ${sort === option.value ? 'sort-tab--active' : ''}`}
              onClick={() => handleSortChange(option.value)}
            >
              {option.label}
              {sort === option.value}
            </button>
          ))}
        </div>

        <div className="catalog-page__layout">
          <div className="catalog-page__grid-wrap">
            {isLoading && <p className="catalog-page__status">Загрузка…</p>}
            {error && (
              <p className="catalog-page__status catalog-page__status--error">
                {error}
              </p>
            )}
            {!isLoading && !error && result.items.length === 0 && (
              <p className="catalog-page__status">
                Товары по вашему запросу не найдены
              </p>
            )}
            {!isLoading && !error && result.items.length > 0 && (
              <div className="catalog-grid">
                {result.items.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpen={setSelectedProduct}
                  />
                ))}
              </div>
            )}
            {result.totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={result.totalPages}
                onChange={setPage}
              />
            )}
          </div>

          <aside className="filters">
            <div className="filters__group">
              <h3 className="filters__title">Цена, ₽</h3>
              <div className="filters__price-inputs">
                <label>
                  От
                  <input
                    type="number"
                    min="0"
                    value={draftFilters.priceFrom}
                    onChange={(event) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        priceFrom: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  До
                  <input
                    type="number"
                    min="0"
                    value={draftFilters.priceTo}
                    onChange={(event) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        priceTo: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>
              <div
                className="price-range"
                style={{
                  '--range-left': `${leftPercent}%`,
                  '--range-right': `${rightPercent}%`,
                }}
              >
                <div className="price-range__track" />
                <div className="price-range__selected" />
                <input
                  aria-label="Минимальная цена"
                  className="price-range__input price-range__input--from"
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  step="10"
                  value={Math.min(sliderFrom, sliderTo - 1)}
                  onChange={(event) =>
                    handlePriceSlider('from', event.target.value)
                  }
                />
                <input
                  aria-label="Максимальная цена"
                  className="price-range__input price-range__input--to"
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  step="10"
                  value={Math.max(sliderTo, sliderFrom + 1)}
                  onChange={(event) =>
                    handlePriceSlider('to', event.target.value)
                  }
                />
              </div>
            </div>

            <div className="filters__group">
              <h3 className="filters__title">Тип товара</h3>
              {CATEGORIES.map((cat) => (
                <label key={cat} className="filters__checkbox">
                  <input
                    type="checkbox"
                    checked={draftFilters.categories.includes(cat)}
                    onChange={() => toggleDraftValue('categories', cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>

            <div className="filters__group">
              <h3 className="filters__title">Цвет</h3>
              {COLORS.map((color) => (
                <label key={color} className="filters__checkbox">
                  <input
                    type="checkbox"
                    checked={draftFilters.colors.includes(color)}
                    onChange={() => toggleDraftValue('colors', color)}
                  />
                  {color}
                </label>
              ))}
            </div>

            <div className="filters__actions">
              <button
                type="button"
                className="button button--primary"
                onClick={handleApplyFilters}
              >
                Показать
              </button>
              <button
                type="button"
                className="button button--link"
                onClick={handleResetFilters}
              >
                Сбросить
              </button>
            </div>
          </aside>
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

function Pagination({page, totalPages, onChange}) {
  const pages = [];
  if (totalPages <= 3) {
    for (let i = 1; i <= totalPages; i += 1) {
      pages.push(i);
    }
  } else {
    pages.push(1, 2, 3, '...', totalPages);
  }

  return (
    <nav className="pagination" aria-label="Навигация по страницам">
      <button
        type="button"
        className="pagination__arrow"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Предыдущая страница"
      >
        ‹
      </button>

      {pages.map((p, index) =>
        p === '...' ? (
          <span key={`ellipsis-${index}`} className="pagination__ellipsis">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className={`pagination__page ${p === page ? 'pagination__page--active' : ''}`}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        className="pagination__arrow"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Следующая страница"
      >
        ›
      </button>
    </nav>
  );
}

export default CatalogPage;
