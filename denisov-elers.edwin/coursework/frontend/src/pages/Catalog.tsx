import {useState, type FormEvent} from 'react';
import type {Product} from '../../../shared/types';
import {ProductCard, ProductModal} from '../components/Product';
import {useStore} from '../context/Store';
import {CatalogFilters} from '../features/catalog/CatalogFilters';
import {CatalogSorting} from '../features/catalog/CatalogSorting';
import {Pagination} from '../features/catalog/Pagination';
import {
  defaultFilters,
  filterAndSortProducts,
  validatePriceRange,
} from '../features/catalog/catalog';

export function Catalog() {
  const {goods} = useStore();
  const [draft, setDraft] = useState(defaultFilters);
  const [filters, setFilters] = useState(defaultFilters);
  const [sort, setSort] = useState('createdAt');
  const [direction, setDirection] = useState('desc');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const filtered = filterAndSortProducts(goods, filters, sort, direction);
  const pages = Math.ceil(filtered.length / 3);

  function apply(event: FormEvent) {
    event.preventDefault();
    const validationError = validatePriceRange(draft);
    setError(validationError);
    if (validationError) return;

    setFilters(draft);
    setPage(1);
  }

  function reset() {
    setDraft(defaultFilters);
    setFilters(defaultFilters);
    setPage(1);
    setError('');
  }

  const changeOrdering =
    (setter: (value: string) => void) => (value: string) => {
      setter(value);
      setPage(1);
    };

  return (
    <main className="container catalog">
      <h1>Каталог товаров</h1>
      <CatalogSorting
        sort={sort}
        direction={direction}
        onSort={changeOrdering(setSort)}
        onDirection={changeOrdering(setDirection)}
      />
      <div className="catalog-layout">
        <div>
          <div className="product-grid">
            {filtered.slice((page - 1) * 3, page * 3).map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                open={() => setProduct(item)}
              />
            ))}
          </div>
          {!filtered.length && (
            <p role="status">
              Товары по вашему запросу не найдены. Попробуйте изменить фильтры.
            </p>
          )}
          <Pagination page={page} pages={pages} onChange={setPage} />
        </div>
        <CatalogFilters
          goods={goods}
          value={draft}
          error={error}
          onChange={setDraft}
          onApply={apply}
          onReset={reset}
        />
      </div>
      {product && (
        <ProductModal product={product} close={() => setProduct(null)} />
      )}
    </main>
  );
}
