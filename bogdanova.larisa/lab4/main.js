import {
  Product,
  getUniqueSuppliers,
  groupProductsBySupplierCount,
  findProductsWithMostSuppliers,
} from './model.js';

const STORAGE_KEY = 'lab4-products';
const DELAY_MS = 300;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const list = document.querySelector('[data-testid="entity-list"]');
const form = document.querySelector('form[data-testid="entity-form"]');
const messageEl = document.getElementById('message');
const emptyEl = document.getElementById('empty');

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(raw)) {
      return [];
    }
    return raw.map(
      (item) => new Product(item.id, item.name, item.suppliers ?? []),
    );
  } catch {
    return [];
  }
}

let products = load();

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function showMessage(text) {
  messageEl.textContent = text;
}

function createCard(product) {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.testid = 'entity-card';
  card.dataset.productId = String(product.id);

  const title = document.createElement('h3');
  title.textContent = `${product.name} (№${product.id})`;

  const ul = document.createElement('ul');
  ul.className = 'suppliers';
  for (const supplier of product.suppliers) {
    const li = document.createElement('li');
    li.textContent = supplier;
    ul.append(li);
  }
  if (product.suppliers.length === 0) {
    const li = document.createElement('li');
    li.className = 'muted';
    li.textContent = 'нет поставщиков';
    ul.append(li);
  }

  const count = document.createElement('p');
  count.textContent = `Поставщиков: ${product.supplierCount}`;

  const supplierForm = document.createElement('form');
  supplierForm.className = 'supplier-form';
  supplierForm.autocomplete = 'off';
  supplierForm.innerHTML = `
    <input type="text" name="supplier" placeholder="Имя поставщика" required>
    <button type="submit" data-action="add">Добавить поставщика</button>
    <button type="submit" data-action="remove">Удалить поставщика</button>`;

  const del = document.createElement('button');
  del.type = 'button';
  del.className = 'danger';
  del.dataset.testid = 'delete-entity';
  del.textContent = 'Удалить товар';

  card.append(title, ul, count, supplierForm, del);
  return card;
}

function renderStats() {
  const suppliers = getUniqueSuppliers(products);
  document.getElementById('stat-suppliers').textContent =
    suppliers.join(', ') || '—';

  const max = findProductsWithMostSuppliers(products);
  document.getElementById('stat-max').textContent =
    max.map((product) => product.name).join(', ') || '—';

  const groups = groupProductsBySupplierCount(products);
  document.getElementById('stat-groups').textContent =
    [...groups]
      .map(
        ([count, items]) =>
          `${count}: ${items.map((product) => product.name).join(', ')}`,
      )
      .join(' | ') || '—';
}

function render() {
  list.replaceChildren(...products.map(createCard));
  emptyEl.hidden = products.length > 0;
  renderStats();
}

function commit() {
  save();
  render();
}

async function addProduct({id, name, suppliers}) {
  await delay(DELAY_MS);
  products = [...products, new Product(id, name, suppliers)];
  commit();
}

async function deleteProduct(id) {
  await delay(DELAY_MS);
  products = products.filter((product) => product.id !== id);
  commit();
}

async function changeSupplier(id, supplier, action) {
  await delay(DELAY_MS);
  const product = products.find((item) => item.id === id);
  if (!product) {
    return;
  }
  if (action === 'add') {
    product.addSupplier(supplier);
  } else {
    product.removeSupplier(supplier);
  }
  commit();
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get('name') ?? '').trim();
  if (!name) {
    showMessage('Введите название товара');
    return;
  }

  const rawId = String(data.get('id') ?? '').trim();
  const id =
    rawId === ''
      ? Math.max(0, ...products.map((product) => product.id)) + 1
      : Number(rawId);
  if (!Number.isFinite(id)) {
    showMessage('Номер должен быть числом');
    return;
  }
  if (products.some((product) => product.id === id)) {
    showMessage(`Товар с номером ${id} уже есть`);
    return;
  }

  const suppliers = String(data.get('suppliers') ?? '')
    .split(',')
    .map((supplier) => supplier.trim())
    .filter(Boolean);

  showMessage('');
  form.reset();
  await addProduct({id, name, suppliers});
});

list.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-testid="delete-entity"]');
  if (!button) {
    return;
  }
  const card = button.closest('[data-testid="entity-card"]');
  await deleteProduct(Number(card.dataset.productId));
});

list.addEventListener('submit', async (event) => {
  const supplierForm = event.target.closest('.supplier-form');
  if (!supplierForm) {
    return;
  }
  event.preventDefault();
  const card = supplierForm.closest('[data-testid="entity-card"]');
  const supplier = new FormData(supplierForm).get('supplier');
  const action = event.submitter?.dataset.action ?? 'add';
  supplierForm.reset();
  await changeSupplier(
    Number(card.dataset.productId),
    String(supplier),
    action,
  );
});

render();
