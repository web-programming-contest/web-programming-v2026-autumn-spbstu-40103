export class Restaurant {
  constructor(name, menu = []) {
    this.name = name;
    this.menu = menu;
  }

  addDish(dish) {
    this.menu.push(dish);
  }

  removeDish(dishName) {
    this.menu = this.menu.filter((d) => d.name !== dishName);
  }

  get menuSize() {
    return this.menu.length;
  }
}

export function groupRestaurantsByMenuSize(restaurants) {
  const result = new Map();

  for (const r of restaurants) {
    const menuSize = r.menu.length;

    if (!result.has(menuSize)) {
      result.set(menuSize, []);
    }

    result.get(menuSize).push(r);
  }

  return result;
}

export function getUniqueDishes(restaurants) {
  const set = new Set();

  for (const r of restaurants) {
    for (const dish of r.menu) {
      if (!set.has(dish.name)) {
        set.add(dish.name);
      }
    }
  }

  return set;
}

export function findRestaurantsByDish(restaurants, dishName) {
  const result = [];

  for (const r of restaurants) {
    for (const dish of r.menu) {
      if (dishName === dish.name) {
        result.push(r);
        break;
      }
    }
  }

  return result;
}

export function groupDishesByPriceRange(restaurants) {
  const ranges = new Map();

  for (const r of restaurants) {
    for (const dish of r.menu) {
      const costRange = (Math.floor((dish.price - 1) / 100) + 1) * 100;

      if (!ranges.has(costRange)) {
        ranges.set(costRange, []);
      }
      ranges.get(costRange).push(dish.name);
    }
  }

  return ranges;
}

export function findRestaurantsWithMostExpensiveDish(restaurants) {
  let maxPrice = -1;
  let result = [];

  for (const r of restaurants) {
    for (const dish of r.menu) {
      if (dish.price > maxPrice) {
        maxPrice = dish.price;
        result = [r.name];
      } else if (dish.price === maxPrice && !result.includes(r.name)) {
        result.push(r.name);
      }
    }
  }

  return result;
}
