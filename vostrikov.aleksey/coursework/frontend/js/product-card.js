import { addToCart, getQuantity, setQuantity } from './cart-store.js';
import { formatPrice, formatRating, escapeHtml } from './utils.js';

export function labelsMarkup(product) {
  return `
    <div class="product-labels">
      ${product.isNew ? '<span class="label label-new">Новинка</span>' : ''}
      ${product.isHit ? '<span class="label label-hit">Хит</span>' : ''}
    </div>`;
}

export function quantityControlMarkup(productId) {
  const quantity = getQuantity(productId);
  if (!quantity) {
    return `<button class="btn btn-blue product-cart-button" type="button" data-add-cart="${productId}">В корзину</button>`;
  }
  return `
    <div class="quantity-control" data-quantity-control="${productId}">
      <button type="button" data-dec="${productId}" aria-label="Уменьшить">−</button>
      <span>${quantity} шт.</span>
      <button type="button" data-inc="${productId}" aria-label="Увеличить">+</button>
    </div>`;
}

export function productCardMarkup(product, { compact = false, cartControls = false } = {}) {
  return `
    <article class="product-card ${compact ? 'product-card-compact' : ''}" data-product-id="${product.id}" tabindex="0">
      <div class="product-image-wrap">
        ${labelsMarkup(product)}
        <img src="./assets/images/goods/${product.image}" alt="${escapeHtml(product.name)}" />
      </div>
      <strong class="product-price">${formatPrice(product.price)}</strong>
      <h3 class="product-name" title="${escapeHtml(product.name)}">${escapeHtml(product.name)}</h3>
      <div class="product-rating"><span>★</span> ${formatRating(product.rating)}</div>
      ${cartControls ? `<div class="product-card-actions">${quantityControlMarkup(product.id)}</div>` : ''}
    </article>`;
}

export function bindCartControls(root, onChanged = () => {}) {
  root.querySelectorAll('[data-add-cart]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      addToCart(Number(button.dataset.addCart));
      onChanged(Number(button.dataset.addCart));
    });
  });

  root.querySelectorAll('[data-inc]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const id = Number(button.dataset.inc);
      setQuantity(id, getQuantity(id) + 1);
      onChanged(id);
    });
  });

  root.querySelectorAll('[data-dec]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const id = Number(button.dataset.dec);
      setQuantity(id, getQuantity(id) - 1);
      onChanged(id);
    });
  });
}
