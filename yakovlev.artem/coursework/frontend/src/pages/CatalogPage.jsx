import {useEffect, useMemo, useState} from 'react';
import {fetchGoods} from '../api.js';
import SortTabs from '../components/SortTabs.jsx';
import Filters from '../components/Filters.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductModal from '../components/ProductModal.jsx';
import Pagination from '../components/Pagination.jsx';

const PER_PAGE = 6;

const DEFAULT_FILTERS = {priceFrom: '', priceTo: '', types: [], colors: []};

function applyFilters(goods, filters) {
  const from = filters.priceFrom === '' ? -Infinity : Number(filters.priceFrom);
  const to = filters.priceTo === '' ? Infinity : Number(filters.priceTo);
  return goods.filter((g) => {
    if (g.price < Math.min(from, to) || g.price > Math.max(from, to)) {
      return false;
    }
    if (filters.types.length > 0 && !filters.types.includes(g.category)) {
      return false;
    }
    if (filters.colors.length > 0 && !filters.colors.includes(g.color)) {
      return false;
    }
    return true;
  });
}

function applySort(goods, sort) {
  const list = [...goods];
  switch (sort) {
    case 'popular':
      return list.sort((a, b) => b.rating - a.rating);
    case 'cheap':
      return list.sort((a, b) => a.price - b.price);
    case 'expensive':
      return list.sort((a, b) => b.price - a.price);
    case 'new':
    default:
      return list.sort(
        (a, b) => Number(b.isNew) - Number(a.isNew) || b.id - a.id,
      );
  }
}

export default function CatalogPage() {
  const [goods, setGoods] = useState([]);
  const [error, setError] = useState('');
  const [sort, setSort] = useState('new');
  const [draft, setDraft] = useState(DEFAULT_FILTERS);
  const [applied, setApplied] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [opened, setOpened] = useState(null);

  useEffect(() => {
    fetchGoods()
      .then(setGoods)
      .catch(() =>
        setError('Не удалось загрузить товары. Проверьте, что бэкенд запущен.'),
      );
  }, []);

  const bounds = useMemo(() => {
    if (goods.length === 0) {
      return {min: 0, max: 0};
    }
    const prices = goods.map((g) => g.price);
    return {min: Math.min(...prices), max: Math.max(...prices)};
  }, [goods]);

  const categories = useMemo(
    () => [...new Set(goods.map((g) => g.category))],
    [goods],
  );
  const colors = useMemo(
    () => [...new Set(goods.map((g) => g.color))],
    [goods],
  );

  const visible = useMemo(
    () => applySort(applyFilters(goods, applied), sort),
    [goods, applied, sort],
  );

  const pages = Math.max(1, Math.ceil(visible.length / PER_PAGE));
  const currentPage = Math.min(page, pages);
  const pageItems = visible.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const handleApply = () => {
    setApplied(draft);
    setPage(1);
  };

  const handleReset = () => {
    setDraft(DEFAULT_FILTERS);
    setApplied(DEFAULT_FILTERS);
    setPage(1);
  };

  const handleSort = (value) => {
    setSort(value);
    setPage(1);
  };

  return (
    <div className="catalog-page container">
      <h1 className="page-title">Каталог товаров</h1>
      {error && <p className="page-error">{error}</p>}
      <div className="catalog-page-layout">
        <div className="catalog-page-content">
          <SortTabs value={sort} onChange={handleSort} />
          {pageItems.length === 0 ? (
            <p className="catalog-page-empty">
              По вашему запросу товары не найдены
            </p>
          ) : (
            <div className="catalog-page-grid">
              {pageItems.map((good) => (
                <ProductCard key={good.id} good={good} onOpen={setOpened} />
              ))}
            </div>
          )}
          <Pagination page={currentPage} pages={pages} onChange={setPage} />
        </div>
        <Filters
          draft={draft}
          onDraftChange={setDraft}
          bounds={bounds}
          categories={categories}
          colors={colors}
          onApply={handleApply}
          onReset={handleReset}
        />
      </div>
      {opened && <ProductModal good={opened} onClose={() => setOpened(null)} />}
    </div>
  );
}
