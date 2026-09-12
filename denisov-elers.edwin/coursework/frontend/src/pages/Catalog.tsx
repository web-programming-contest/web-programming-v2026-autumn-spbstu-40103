import {useState, type FormEvent} from 'react';
import type {Product} from '../../../shared/types';
import {useStore} from '../context/Store';
import {ProductCard, ProductModal} from '../components/Product';

interface Filters {
  min: string;
  max: string;
  categories: string[];
  colors: string[];
}

const defaults: Filters = {min: '', max: '', categories: [], colors: []};

export function Catalog() {
  const {goods} = useStore();
  const [draft, setDraft] = useState(defaults);
  const [filters, setFilters] = useState(defaults);
  const [sort, setSort] = useState('createdAt');
  const [direction, setDirection] = useState('desc');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const filtered = goods
    .filter(
      (p) =>
        (!filters.min || p.price >= Number(filters.min)) &&
        (!filters.max || p.price <= Number(filters.max)) &&
        (!filters.categories.length ||
          filters.categories.includes(p.category)) &&
        (!filters.colors.length || filters.colors.includes(p.color)),
    )
    .sort((a, b) => {
      const diff =
        sort === 'price'
          ? a.price - b.price
          : sort === 'popularity'
            ? a.popularity - b.popularity
            : Number(a.isNew) - Number(b.isNew) ||
              Date.parse(a.createdAt) - Date.parse(b.createdAt);
      return (direction === 'asc' ? diff : -diff) || a.id.localeCompare(b.id);
    });
  const pages = Math.ceil(filtered.length / 3);
  const visiblePages = Array.from(
    new Set([1, 2, 3, ...(page > 3 ? [page] : []), pages]),
  )
    .filter((p) => p > 0 && p <= pages)
    .sort((a, b) => a - b);

  function apply(e: FormEvent) {
    e.preventDefault();
    if (
      (draft.min &&
        (!Number.isFinite(Number(draft.min)) || Number(draft.min) < 0)) ||
      (draft.max &&
        (!Number.isFinite(Number(draft.max)) || Number(draft.max) < 0)) ||
      (draft.min && draft.max && Number(draft.min) > Number(draft.max))
    ) {
      setError('Укажите корректный диапазон цен');
      return;
    }
    setError('');
    setFilters(draft);
    setPage(1);
  }

  return (
    <main className="container catalog">
      <h1>Каталог товаров</h1>
      <div className="sorting">
        <label>
          Сортировка{' '}
          <select
            aria-label="Сортировка"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
            <option value="createdAt">Новизна</option>
            <option value="popularity">Популярность</option>
            <option value="price">Цена</option>
          </select>
        </label>
        <select
          aria-label="Порядок сортировки"
          value={direction}
          onChange={(e) => {
            setDirection(e.target.value);
            setPage(1);
          }}
        >
          <option value="desc">По убыванию</option>
          <option value="asc">По возрастанию</option>
        </select>
      </div>
      <div className="catalog-layout">
        <div>
          <div className="product-grid">
            {filtered.slice((page - 1) * 3, page * 3).map((p) => (
              <ProductCard key={p.id} product={p} open={() => setProduct(p)} />
            ))}
          </div>
          {!filtered.length && (
            <p role="status">
              Товары по вашему запросу не найдены. Попробуйте изменить фильтры.
            </p>
          )}
          {pages > 1 && (
            <nav className="pagination" aria-label="Страницы каталога">
              {visiblePages.map((p, i) => (
                <span key={p}>
                  {i > 0 &&
                    (p - visiblePages[i - 1] > 1 ||
                      (pages > 3 && p === pages && page <= 3)) && (
                      <span className="ellipsis">…</span>
                    )}
                  <button
                    aria-label={`Страница ${p}`}
                    aria-current={page === p ? 'page' : undefined}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                </span>
              ))}
              <button
                aria-label="Следующая страница"
                disabled={page === pages}
                onClick={() => setPage(page + 1)}
              >
                ›
              </button>
            </nav>
          )}
        </div>
        <form className="filters" noValidate onSubmit={apply}>
          <h3>Цена, ₽</h3>
          <div className="price-inputs">
            {(['min', 'max'] as const).map((name) => (
              <label className="field" key={name}>
                {name === 'min' ? 'От' : 'До'}
                <input
                  aria-label={name === 'min' ? 'Цена от' : 'Цена до'}
                  type="number"
                  min="0"
                  value={draft[name]}
                  aria-invalid={Boolean(error)}
                  onChange={(e) => setDraft({...draft, [name]: e.target.value})}
                />
              </label>
            ))}
          </div>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          {(['categories', 'colors'] as const).map((group) => (
            <fieldset key={group}>
              <legend>{group === 'categories' ? 'Тип товара' : 'Цвет'}</legend>
              {Array.from(
                new Set(
                  goods.map((p) =>
                    group === 'categories' ? p.category : p.color,
                  ),
                ),
              ).map((value) => (
                <label className="check" key={value}>
                  <input
                    type="checkbox"
                    checked={draft[group].includes(value)}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        [group]: e.target.checked
                          ? [...draft[group], value]
                          : draft[group].filter((v) => v !== value),
                      })
                    }
                  />
                  {value}
                </label>
              ))}
            </fieldset>
          ))}
          <div className="actions">
            <button className="primary">Показать</button>
            <button
              type="button"
              className="pink"
              onClick={() => {
                setDraft(defaults);
                setFilters(defaults);
                setPage(1);
                setError('');
              }}
            >
              Сбросить
            </button>
          </div>
        </form>
      </div>
      {product && (
        <ProductModal product={product} close={() => setProduct(null)} />
      )}
    </main>
  );
}
