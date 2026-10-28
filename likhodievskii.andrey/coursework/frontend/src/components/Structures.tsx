export interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  isBestseller: boolean;
  isNovelty: boolean;
  description: string;
  characteristics: {
    label: string;
    value: string;
  }[];
}

export interface ProductCart {
  id: number;
  name: string;
  quantity: number;
}

export interface FilterState {
  priceMin: number;
  priceMax: number;
  categories: Set<string>;
  colors: Set<string>;
}

export const categoryKeywords: Record<string, string[]> = {
  Смартфоны: ['смартфон'],
  'Фитнес браслеты': ['фитнес', 'браслет'],
  'Портативная акустика': ['акустика', 'колонка'],
  'Очки виртуальной реальности': ['очки', 'шлем', 'vr'],
  Электротранспорт: ['чемодан-скутер', 'скутер'],
  'Умные часы': ['часы'],
};

export const colorKeywords: Record<string, string[]> = {
  Красный: ['красн'],
  Оранжевый: ['оранж'],
  Желтый: ['желт'],
  Зеленый: ['зелен'],
  Голубой: ['голуб'],
  Синий: ['син'],
  Фиолетовый: ['фиолет'],
  Белый: ['бел'],
  Черный: ['черн'],
  Серый: ['сер'],
  Серебристый: ['серебр'],
  Бежевый: ['беж'],
};
