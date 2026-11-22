import {useState} from 'react';
import CartControl from '../components/CartControl/CartControl';
import Filters from '../components/Filters/Filters';
import Pagination from '../components/Pagination/Pagination';
import ProductCard from '../components/ProductCard/ProductCard';
import ProductModal from '../components/ProductModal/ProductModal';
import SortChips from '../components/SortChips/SortChips';
import {SORTS} from '../catalog/catalogLogic';
import {useCatalog} from '../hooks/useCatalog';
import {useGoods} from '../hooks/useGoods';
import styles from './Catalog.module.css';
import {usePageTitle} from '../hooks/usePageTitle';

export default function Catalog() {
  usePageTitle('Каталог товаров');
  const {goods, status, reload} = useGoods();
  const catalog = useCatalog(goods);
  const [openedId, setOpenedId] = useState(null);
  const opened = goods.find((g) => g.id === openedId);

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Каталог товаров</h1>
      <SortChips
        options={SORTS}
        value={catalog.sort}
        onChange={catalog.changeSort}
      />

      <div className={styles.layout}>
        <div className={styles.main}>
          {status === 'loading' && (
            <p className={styles.message}>Загружаем товары…</p>
          )}

          {status === 'error' && (
            <div className={styles.message}>
              <p>Не удалось загрузить товары</p>
              <button type="button" className={styles.retry} onClick={reload}>
                Повторить
              </button>
            </div>
          )}

          {status === 'ready' && catalog.items.length === 0 && (
            <div className={styles.message}>
              <p className={styles['empty-title']}>
                Товары по вашему запросу не найдены
              </p>
              <p>Попробуйте изменить параметры фильтра</p>
            </div>
          )}

          {status === 'ready' && catalog.items.length > 0 && (
            <>
              <ul className={styles.grid}>
                {catalog.items.map((good) => (
                  <li key={good.id}>
                    <ProductCard
                      good={good}
                      onOpen={() => setOpenedId(good.id)}
                      footer={<CartControl good={good} />}
                    />
                  </li>
                ))}
              </ul>
              <div className={styles.pagination}>
                <Pagination
                  page={catalog.page}
                  totalPages={catalog.totalPages}
                  onChange={catalog.setPage}
                />
              </div>
            </>
          )}
        </div>

        {status === 'ready' && (
          <Filters
            draft={catalog.draft}
            bounds={catalog.bounds}
            options={catalog.options}
            onPriceChange={catalog.setPrice}
            onToggle={catalog.toggle}
            onApply={catalog.apply}
            onReset={catalog.reset}
          />
        )}
      </div>

      {opened && (
        <ProductModal good={opened} onClose={() => setOpenedId(null)} />
      )}
    </div>
  );
}
