import { getGoods } from './api.js';
import { requireAuth, initLayout } from './layout.js';
import { bindCartControls, labelsMarkup, productCardMarkup, quantityControlMarkup } from './product-card.js';
import { formatPrice, formatRating, escapeHtml } from './utils.js';

if (!(await requireAuth())) throw new Error('redirect');
await initLayout('catalog');

const grid = document.querySelector('[data-product-grid]');
const filterForm = document.querySelector('[data-filter-form]');
const typeRoot = document.querySelector('[data-type-filters]');
const colorRoot = document.querySelector('[data-color-filters]');
const pagination = document.querySelector('[data-pagination]');
const empty = document.querySelector('[data-empty]');
const modal = document.querySelector('[data-product-modal]');
const modalBody = document.querySelector('[data-product-modal-body]');

let products = [];
let currentPage = 1;
let currentSort = 'new';
let appliedFilters = { min: '', max: '', types: [], colors: [] };
const perPage = 9;

function checkboxMarkup(name, value) {
  return `<label class="check-row"><input type="checkbox" name="${name}" value="${escapeHtml(value)}" /><span>${escapeHtml(value)}</span></label>`;
}

function buildFilters() {
  const types = [...new Set(products.map((product) => product.category))].sort();
  const colors = [...new Set(products.map((product) => product.color))].sort();
  typeRoot.innerHTML = types.map((value) => checkboxMarkup('type', value)).join('');
  colorRoot.innerHTML = colors.map((value) => checkboxMarkup('color', value)).join('');

  const prices = products.map((product) => product.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  filterForm.elements.min.placeholder = String(min);
  filterForm.elements.max.placeholder = String(max);
}

function filteredProducts() {
  let list = [...products];
  const min = Number(appliedFilters.min);
  const max = Number(appliedFilters.max);

  if (appliedFilters.min !== '' && Number.isFinite(min)) list = list.filter((p) => p.price >= min);
  if (appliedFilters.max !== '' && Number.isFinite(max)) list = list.filter((p) => p.price <= max);
  if (appliedFilters.types.length) list = list.filter((p) => appliedFilters.types.includes(p.category));
  if (appliedFilters.colors.length) list = list.filter((p) => appliedFilters.colors.includes(p.color));

  if (currentSort === 'new') {
    list.sort((a, b) => Number(b.isNew) - Number(a.isNew) || a.newRank - b.newRank);
  } else if (currentSort === 'popular') {
    list.sort((a, b) => b.popularity - a.popularity);
  } else if (currentSort === 'cheap') {
    list.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'expensive') {
    list.sort((a, b) => b.price - a.price);
  }
  return list;
}

function renderPagination(totalPages) {
  pagination.replaceChildren();
  if (totalPages <= 1) return;

  let pages;
  if (totalPages > 3) pages = [1, 2, 3, '…', totalPages];
  else pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  for (const page of pages) {
    if (page === '…') {
      const span = document.createElement('span');
      span.className = 'pagination-gap';
      span.textContent = '…';
      pagination.append(span);
      continue;
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = String(page);
    button.className = `pagination-button ${page === currentPage ? 'active' : ''}`;
    button.addEventListener('click', () => {
      currentPage = Number(page);
      renderProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    pagination.append(button);
  }
}

function openProduct(product) {
  modalBody.innerHTML = `
    <div class="modal-product-image">
      ${labelsMarkup(product)}
      <img src="./assets/images/goods/${product.image}" alt="${escapeHtml(product.name)}" />
    </div>
    <div class="modal-product-info">
      <h2>${escapeHtml(product.name)}</h2>
      <div class="product-rating"><span>★</span> ${formatRating(product.rating)}</div>
      <p>${escapeHtml(product.description)}</p>
      <h3>Характеристики</h3>
      <dl class="specs">
        ${Object.entries(product.specs).map(([key, value]) => `<div><dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}
      </dl>
      <strong class="modal-price">${formatPrice(product.price)}</strong>
      <div class="modal-cart-controls">${quantityControlMarkup(product.id)}</div>
    </div>`;
  bindCartControls(modalBody, () => openProduct(product));
  modal.showModal();
}

function renderProducts() {
  const list = filteredProducts();
  const totalPages = Math.max(1, Math.ceil(list.length / perPage));
  if (currentPage > totalPages) currentPage = totalPages;
  const pageItems = list.slice((currentPage - 1) * perPage, currentPage * perPage);

  grid.innerHTML = pageItems.map((p) => productCardMarkup(p, { cartControls: true })).join('');
  grid.hidden = pageItems.length === 0;
  empty.hidden = pageItems.length !== 0;
  renderPagination(list.length ? totalPages : 0);

  grid.querySelectorAll('.product-card').forEach((card) => {
    const product = products.find((p) => p.id === Number(card.dataset.productId));
    const open = () => openProduct(product);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  });
  bindCartControls(grid, renderProducts);
}

document.querySelectorAll('[data-sort]').forEach((button) => {
  button.addEventListener('click', () => {
    currentSort = button.dataset.sort;
    currentPage = 1;
    document.querySelectorAll('[data-sort]').forEach((item) => item.classList.toggle('active', item === button));
    renderProducts();
  });
});

filterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(filterForm);
  appliedFilters = {
    min: String(data.get('min') ?? '').trim(),
    max: String(data.get('max') ?? '').trim(),
    types: data.getAll('type').map(String),
    colors: data.getAll('color').map(String),
  };
  currentPage = 1;
  renderProducts();
});

document.querySelector('[data-reset-filters]').addEventListener('click', () => {
  filterForm.reset();
  appliedFilters = { min: '', max: '', types: [], colors: [] };
  currentPage = 1;
  renderProducts();
});

document.querySelector('[data-product-modal-close]').addEventListener('click', () => modal.close());
modal.addEventListener('click', (event) => {
  if (event.target === modal) modal.close();
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.open) modal.close();
});

try {
  products = await getGoods();
  buildFilters();
  renderProducts();
} catch (error) {
  grid.innerHTML = `<p class="error-box">Не удалось загрузить каталог: ${error.message}</p>`;
}
