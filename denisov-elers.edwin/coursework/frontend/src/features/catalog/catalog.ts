import type {Product} from '../../../../shared/types';

export interface CatalogFilters {
  min: string;
  max: string;
  categories: string[];
  colors: string[];
}

export const defaultFilters: CatalogFilters = {
  min: '',
  max: '',
  categories: [],
  colors: [],
};

export function filterAndSortProducts(
  goods: Product[],
  filters: CatalogFilters,
  sort: string,
  direction: string,
) {
  return goods
    .filter(
      (product) =>
        (!filters.min || product.price >= Number(filters.min)) &&
        (!filters.max || product.price <= Number(filters.max)) &&
        (!filters.categories.length ||
          filters.categories.includes(product.category)) &&
        (!filters.colors.length || filters.colors.includes(product.color)),
    )
    .sort((a, b) => {
      const difference =
        sort === 'price'
          ? a.price - b.price
          : sort === 'popularity'
            ? a.popularity - b.popularity
            : Number(a.isNew) - Number(b.isNew) ||
              Date.parse(a.createdAt) - Date.parse(b.createdAt);
      return (
        (direction === 'asc' ? difference : -difference) ||
        a.id.localeCompare(b.id)
      );
    });
}

export function validatePriceRange(filters: CatalogFilters) {
  const invalidMinimum =
    filters.min &&
    (!Number.isFinite(Number(filters.min)) || Number(filters.min) < 0);
  const invalidMaximum =
    filters.max &&
    (!Number.isFinite(Number(filters.max)) || Number(filters.max) < 0);
  const reversedRange =
    filters.min && filters.max && Number(filters.min) > Number(filters.max);

  return invalidMinimum || invalidMaximum || reversedRange
    ? 'Укажите корректный диапазон цен'
    : '';
}

export function getPageNumbers(pages: number) {
  return Array.from({length: pages}, (_, index) => index + 1);
}
