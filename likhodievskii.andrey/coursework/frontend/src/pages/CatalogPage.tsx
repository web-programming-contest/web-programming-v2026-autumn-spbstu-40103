import {useState, useEffect} from 'react';

import '../styles/catalogStyle.scss';

import Pagination from '../components/catalog-page/Pagination';
import Filter from '../components/catalog-page/Filter';
import ProductCard from '../components/catalog-page/ProductCard';
import ProductModalWindow from '../components/catalog-page/ProductModalWindow';

import {Product} from '../components/Structures';
import {ProductCart} from '../components/Structures';
import {FilterState} from '../components/Structures';
import {categoryKeywords} from '../components/Structures';
import {colorKeywords} from '../components/Structures';

function getPages(current: number, total: number): (number | '...')[] {
  if (total <= 5) {
    return Array.from({length: total}, (_, i) => i + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, '...', total];
  }
  if (current >= total - 2) {
    return [1, '...', total - 2, total - 1, total];
  }
  return [1, '...', current - 1, current, current + 1, '...', total];
}

function getMinPrice(products: Product[]): number {
  if (products.length === 0) return 0;
  return products.reduce(
    (min, p) => (p.price < min ? p.price : min),
    products[0].price,
  );
}

function getMaxPrice(products: Product[]): number {
  if (products.length === 0) return 0;
  return products.reduce(
    (max, p) => (p.price > max ? p.price : max),
    products[0].price,
  );
}

function sortProducts(sortType: string, defaultProducts: Product[]): Product[] {
  switch (sortType) {
    case 'Новые':
      return [...defaultProducts].sort((a, b) =>
        b.isNovelty === a.isNovelty ? 0 : b.isNovelty ? 1 : -1,
      );
    case 'Популярные':
      return [...defaultProducts].sort((a, b) =>
        b.isBestseller === a.isBestseller ? 0 : b.isBestseller ? 1 : -1,
      );
    case 'Подешевле':
      return [...defaultProducts].sort((a, b) => a.price - b.price);
    case 'Подороже':
      return [...defaultProducts].sort((a, b) => b.price - a.price);
    default:
      return [...defaultProducts];
  }
}

function filterProducts(products: Product[], filters: FilterState): Product[] {
  return products.filter((p) => {
    const nameLower = p.name.toLowerCase();

    if (p.price < filters.priceMin || p.price > filters.priceMax) return false;

    if (filters.categories.size > 0) {
      const match = [...filters.categories].some((cat) =>
        categoryKeywords[cat]?.some((kw) => nameLower.includes(kw)),
      );
      if (!match) return false;
    }

    if (filters.colors.size > 0) {
      const match = [...filters.colors].some((color) =>
        colorKeywords[color]?.some((kw) => nameLower.includes(kw)),
      );
      if (!match) return false;
    }

    return true;
  });
}

function CatalogPage({
  cards,
  cartItems,
  setCards,
  isLoading,
  addToCart,
  removeFromCart,
}: {
  cards: Product[];
  cartItems: ProductCart[];
  setCards: React.Dispatch<React.SetStateAction<Product[]>>;
  isLoading: boolean;
  addToCart: (item: Product) => void;
  removeFromCart: (id: number) => void;
}) {
  const [filters, setFilters] = useState<FilterState>({
    priceMin: 0,
    priceMax: 999999,
    categories: new Set(),
    colors: new Set(),
  });

  const filteredCards = filterProducts(cards, filters);

  const [originalCards, setOriginalCards] = useState<Product[]>([]);
  useEffect(() => {
    if (cards.length > 0 && originalCards.length === 0) {
      setOriginalCards([...cards]);
    }
  }, [cards, originalCards]);

  const [activeSort, setActiveSort] = useState('');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const countOfPages = Math.ceil(filteredCards.length / 9);
  const [currentPage, setCurrentPage] = useState(1);
  const pages = getPages(currentPage, countOfPages);

  const startIndex = (currentPage - 1) * 9;
  const endIndex = startIndex + 9;
  const currentCards = filteredCards.slice(startIndex, endIndex);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveProduct(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="catalog">
      <h1>Каталог товаров</h1>

      <div className="sorting">
        {['Новые', 'Популярные', 'Подешевле', 'Подороже'].map((item) => (
          <div
            key={item}
            className={activeSort === item ? 'active' : ''}
            onClick={() => {
              setCards(() =>
                sortProducts(activeSort === item ? '' : item, originalCards),
              );
              setActiveSort((prev) => (prev === item ? '' : item));
            }}
          >
            <span>{item}</span>
          </div>
        ))}
      </div>

      <div className="wrapper">
        <div className="catalog-goods">
          {currentCards.length === 0 ? (
            <h1 style={{position: 'absolute', left: '33%', top: '33%'}}>
              Товары не найдены
            </h1>
          ) : null}
          {isLoading
            ? Array.from({length: 9}).map((_, i) => (
                <div key={i} className="product-card"></div>
              ))
            : currentCards.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  cartItems={cartItems}
                  setActiveProduct={setActiveProduct}
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                />
              ))}
        </div>

        <Filter
          MIN={getMinPrice(cards)}
          MAX={getMaxPrice(cards)}
          onFilter={setFilters}
        />
      </div>

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        countOfPages={countOfPages}
        pages={pages}
      />

      {activeProduct && (
        <ProductModalWindow
          cartItems={cartItems}
          activeProduct={activeProduct}
          setActiveProduct={setActiveProduct}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />
      )}
    </div>
  );
}

export default CatalogPage;
