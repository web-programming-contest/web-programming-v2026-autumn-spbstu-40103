import { getGoods } from './api.js';
import { initLayout } from './layout.js';
import { productCardMarkup } from './product-card.js';

await initLayout('');

const hitsRoot = document.querySelector('[data-hits]');
const newRoot = document.querySelector('[data-new]');
const hitsPrev = document.querySelector('[data-hits-prev]');
const hitsNext = document.querySelector('[data-hits-next]');
const newPrev = document.querySelector('[data-new-prev]');
const newNext = document.querySelector('[data-new-next]');

let products = [];
let hitIndex = 0;
let newIndex = 0;

function circularSlice(items, start, count) {
  if (!items.length) return [];
  return Array.from({ length: Math.min(count, items.length) }, (_, offset) => {
    return items[(start + offset) % items.length];
  });
}

function renderCarousel(root, items, start) {
  root.innerHTML = circularSlice(items, start, 3)
    .map((product) => productCardMarkup(product, { compact: true }))
    .join('');
}

function render() {
  const hits = products.filter((product) => product.isHit);
  const newest = products.filter((product) => product.isNew);
  renderCarousel(hitsRoot, hits, hitIndex);
  renderCarousel(newRoot, newest, newIndex);
}

function shift(kind, delta) {
  const list = products.filter((product) => (kind === 'hit' ? product.isHit : product.isNew));
  if (!list.length) return;
  if (kind === 'hit') hitIndex = (hitIndex + delta + list.length) % list.length;
  else newIndex = (newIndex + delta + list.length) % list.length;
  render();
}

hitsPrev.addEventListener('click', () => shift('hit', -1));
hitsNext.addEventListener('click', () => shift('hit', 1));
newPrev.addEventListener('click', () => shift('new', -1));
newNext.addEventListener('click', () => shift('new', 1));

try {
  products = await getGoods();
  render();
} catch (error) {
  hitsRoot.innerHTML = `<p class="error-box">Не удалось загрузить товары: ${error.message}</p>`;
  newRoot.innerHTML = '';
}
