export class Product {
  constructor(id, name, suppliers = []) {
    this.id = id;
    this.name = name;
    this.suppliers = [];
    suppliers.forEach((supplier) => this.addSupplier(supplier));
  }

  get supplierCount() {
    return this.suppliers.length;
  }

  addSupplier(name) {
    const supplier = String(name).trim();
    if (!supplier || this.suppliers.includes(supplier)) {
      return false;
    }
    this.suppliers.push(supplier);
    return true;
  }

  removeSupplier(name) {
    const index = this.suppliers.indexOf(String(name).trim());
    if (index === -1) {
      return false;
    }
    this.suppliers.splice(index, 1);
    return true;
  }
}

const suppliersOf = (product) => product?.suppliers ?? [];

export function groupProductsBySupplier(products) {
  const result = {};
  for (const product of products) {
    for (const supplier of suppliersOf(product)) {
      (result[supplier] ??= []).push(product);
    }
  }
  return result;
}

export function getUniqueSuppliers(products) {
  return [...new Set(products.flatMap(suppliersOf))];
}

export function findProductsBySupplier(products, supplier) {
  return products.filter((product) => suppliersOf(product).includes(supplier));
}

export function groupProductsBySupplierCount(products) {
  const result = new Map();
  for (const product of products) {
    const count = suppliersOf(product).length;
    if (!result.has(count)) {
      result.set(count, []);
    }
    result.get(count).push(product);
  }
  return result;
}

export function findProductsWithMostSuppliers(products) {
  if (products.length === 0) {
    return [];
  }
  const max = Math.max(
    ...products.map((product) => suppliersOf(product).length),
  );
  return products.filter((product) => suppliersOf(product).length === max);
}
