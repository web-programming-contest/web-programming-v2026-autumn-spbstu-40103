const CART_KEY = 'gadget-hub-cart';

function normalize(raw) {
  if (!raw || typeof raw !== 'object') return {};
  const result = {};
  for (const [key, value] of Object.entries(raw)) {
    const id = Number(key);
    const quantity = Number(value);
    if (Number.isInteger(id) && Number.isInteger(quantity) && quantity > 0) {
      result[id] = Math.min(quantity, 99);
    }
  }
  return result;
}

export function getCart() {
  try {
    return normalize(JSON.parse(localStorage.getItem(CART_KEY) ?? '{}'));
  } catch {
    return {};
  }
}

export function saveCart(cart) {
  const normalized = normalize(cart);
  localStorage.setItem(CART_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent('cart-changed'));
  return normalized;
}

export function getQuantity(productId) {
  return getCart()[Number(productId)] ?? 0;
}

export function setQuantity(productId, quantity) {
  const cart = getCart();
  const id = Number(productId);
  const next = Number(quantity);
  if (!Number.isInteger(next) || next <= 0) {
    delete cart[id];
  } else {
    cart[id] = Math.min(next, 99);
  }
  return saveCart(cart);
}

export function addToCart(productId) {
  return setQuantity(productId, getQuantity(productId) + 1);
}

export function removeFromCart(productId) {
  const cart = getCart();
  delete cart[Number(productId)];
  return saveCart(cart);
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new CustomEvent('cart-changed'));
}

export function cartItemsCount() {
  return Object.values(getCart()).reduce((sum, quantity) => sum + quantity, 0);
}
