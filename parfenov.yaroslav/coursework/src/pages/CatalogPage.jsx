import {useMemo, useState} from 'react';
import ProductCard from '../components/ProductCard.jsx';
import ProductModal from '../components/ProductModal.jsx';
import QuantityControl from '../components/QuantityControl.jsx';
import {useStore} from '../context/StoreContext.jsx';

const emptyFilters = {min: '', max: '', categories: [], colors: []};

function toggle(values, value) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function Pagination({current, total, onChange}) {
  if (total <= 1) return null;
  const pages = [];
  if (total <= 5) {
    for (let page = 1; page <= total; page += 1) pages.push({page});
  } else {
    const start = Math.max(2, current - 2);
    const end = Math.min(total - 1, current + 2);
    pages.push({page: 1});
    if (start > 2) pages.push({page: start - 1, dots: true});
    for (let page = start; page <= end; page += 1) pages.push({page});
    if (end < total - 1) pages.push({page: end + 1, dots: true});
    pages.push({page: total});
  }
  return (
    <nav className="pagination" aria-label="Страницы каталога">
      <button disabled={current === 1} onClick={() => onChange(current - 1)}>
        ←
      </button>
      {pages.map((item, index) => (
        <button
          key={`${item.page}-${index}`}
          className={`${item.page === current ? 'active' : ''} ${item.dots ? 'pagination-ellipsis' : ''}`}
          onClick={() => onChange(item.page)}
        >
          {item.dots ? '…' : item.page}
        </button>
      ))}
      <button
        disabled={current === total}
        onClick={() => onChange(current + 1)}
      >
        →
      </button>
    </nav>
  );
}

export default function CatalogPage() {
  const {goods} = useStore();
  const [sort, setSort] = useState('new-desc');
  const [draft, setDraft] = useState(emptyFilters);
  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);
  const [selectedGood, setSelectedGood] = useState(null);
  const categories = [...new Set(goods.map((good) => good.category))].sort();
  const colors = [...new Set(goods.map((good) => good.color))].sort();

  const results = useMemo(() => {
    const filtered = goods
      .filter((good) => !filters.min || good.price >= Number(filters.min))
      .filter((good) => !filters.max || good.price <= Number(filters.max))
      .filter(
        (good) =>
          !filters.categories.length ||
          filters.categories.includes(good.category),
      )
      .filter(
        (good) => !filters.colors.length || filters.colors.includes(good.color),
      );
    return filtered.sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating-desc') return b.rating - a.rating;
      if (sort === 'new-asc')
        return Number(a.isNew) - Number(b.isNew) || a.id - b.id;
      return Number(b.isNew) - Number(a.isNew) || b.id - a.id;
    });
  }, [goods, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(results.length / 6));
  const currentPage = Math.min(page, totalPages);
  const shown = results.slice((currentPage - 1) * 6, currentPage * 6);
  const applyFilters = (event) => {
    event.preventDefault();
    setFilters({...draft});
    setPage(1);
  };
  const reset = () => {
    setDraft(emptyFilters);
    setFilters(emptyFilters);
    setPage(1);
  };

  return (
    <section className="catalog-page container">
      <div className="page-heading">
        <div>
          <span className="eyebrow">{goods.length} полезных устройств</span>
          <h1>Каталог товаров</h1>
        </div>
        <p>Выберите гаджет, который подойдет именно вам.</p>
      </div>
      <div className="catalog-toolbar">
        <p>
          Найдено: <strong>{results.length}</strong>
        </p>
        <label className="sort-control">
          Сортировать
          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value);
              setPage(1);
            }}
          >
            <option value="new-desc">Сначала новинки</option>
            <option value="new-asc">Сначала проверенные</option>
            <option value="price-asc">Сначала дешевле</option>
            <option value="price-desc">Сначала дороже</option>
            <option value="rating-desc">По популярности</option>
          </select>
        </label>
      </div>
      <div className="catalog-layout">
        <div>
          {shown.length ? (
            <>
              <div className="catalog-grid">
                {shown.map((good) => (
                  <ProductCard
                    key={good.id}
                    good={good}
                    onClick={() => setSelectedGood(good)}
                  >
                    <div className="card-action">
                      <QuantityControl goodId={good.id} compact />
                    </div>
                  </ProductCard>
                ))}
              </div>
              <Pagination
                current={currentPage}
                total={totalPages}
                onChange={setPage}
              />
            </>
          ) : (
            <div className="empty-state">
              <h2>Товары не найдены</h2>
              <p>Измените или сбросьте фильтры.</p>
              <button className="button" onClick={reset}>
                Сбросить
              </button>
            </div>
          )}
        </div>
        <aside className="filters-panel">
          <form onSubmit={applyFilters}>
            <div className="filter-title">
              <h2>Фильтры</h2>
              <button type="button" onClick={reset}>
                Сбросить
              </button>
            </div>
            <fieldset>
              <legend>Цена, ₽</legend>
              <div className="price-range">
                <label>
                  <span>от</span>
                  <input
                    type="number"
                    value={draft.min}
                    onChange={(event) =>
                      setDraft({...draft, min: event.target.value})
                    }
                  />
                </label>
                <label>
                  <span>до</span>
                  <input
                    type="number"
                    value={draft.max}
                    onChange={(event) =>
                      setDraft({...draft, max: event.target.value})
                    }
                  />
                </label>
              </div>
            </fieldset>
            <fieldset>
              <legend>Тип товара</legend>
              <div className="filter-list">
                {categories.map((value) => (
                  <label className="check-row" key={value}>
                    <input
                      type="checkbox"
                      checked={draft.categories.includes(value)}
                      onChange={() =>
                        setDraft({
                          ...draft,
                          categories: toggle(draft.categories, value),
                        })
                      }
                    />
                    <span>{value}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Цвет</legend>
              <div className="filter-list">
                {colors.map((value) => (
                  <label className="check-row" key={value}>
                    <input
                      type="checkbox"
                      checked={draft.colors.includes(value)}
                      onChange={() =>
                        setDraft({
                          ...draft,
                          colors: toggle(draft.colors, value),
                        })
                      }
                    />
                    <span>{value}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <button className="button full">Показать</button>
          </form>
        </aside>
      </div>
      {selectedGood && (
        <ProductModal
          good={selectedGood}
          onClose={() => setSelectedGood(null)}
        />
      )}
    </section>
  );
}
