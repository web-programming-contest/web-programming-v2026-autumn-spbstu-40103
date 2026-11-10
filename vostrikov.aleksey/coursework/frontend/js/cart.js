import { createOrder, getGoods, getOrders } from './api.js';
import { clearCart, getCart, removeFromCart, setQuantity } from './cart-store.js';
import { requireAuth, initLayout } from './layout.js';
import { formatDate, formatPrice, escapeHtml } from './utils.js';

if (!(await requireAuth())) throw new Error('redirect');
await initLayout('cart');

const cartPanel = document.querySelector('[data-cart-panel]');
const ordersPanel = document.querySelector('[data-orders-panel]');
const cartList = document.querySelector('[data-cart-list]');
const cartEmpty = document.querySelector('[data-cart-empty]');
const checkout = document.querySelector('[data-checkout]');
const checkoutForm = document.querySelector('[data-checkout-form]');
const ordersList = document.querySelector('[data-orders-list]');
const confirmModal = document.querySelector('[data-confirm-modal]');
const confirmText = document.querySelector('[data-confirm-text]');
const successModal = document.querySelector('[data-success-modal]');
const successText = document.querySelector('[data-success-text]');
const selectAll = document.querySelector('[data-select-all]');
const bulkDelete = document.querySelector('[data-bulk-delete]');

let products = [];
let selected = new Set();
let pendingDeleteIds = [];

function cartRows() {
  const cart = getCart();
  return Object.entries(cart)
    .map(([id, quantity]) => ({
      product: products.find((product) => product.id === Number(id)),
      quantity,
    }))
    .filter((entry) => entry.product);
}

function renderCart() {
  const rows = cartRows();
  cartEmpty.hidden = rows.length > 0;
  cartList.hidden = rows.length === 0;
  checkout.hidden = rows.length === 0;

  if (!rows.length) {
    cartList.innerHTML = '';
    selected.clear();
    selectAll.checked = false;
    bulkDelete.hidden = true;
    return;
  }

  cartList.innerHTML = rows
    .map(({ product, quantity }) => `
      <div class="cart-row" data-cart-row="${product.id}">
        <input class="cart-select" type="checkbox" value="${product.id}" ${selected.has(product.id) ? 'checked' : ''} aria-label="Выбрать ${escapeHtml(product.name)}" />
        <img class="cart-product-image" src="./assets/images/goods/${product.image}" alt="${escapeHtml(product.name)}" />
        <div class="cart-product-name">${escapeHtml(product.name)}</div>
        <div class="quantity-control">
          <button type="button" data-cart-dec="${product.id}">−</button>
          <span>${quantity}</span>
          <button type="button" data-cart-inc="${product.id}">+</button>
        </div>
        <strong>${formatPrice(product.price * quantity)}</strong>
        <button class="link-danger" type="button" data-delete-one="${product.id}">Удалить</button>
      </div>`)
    .join('');

  const totalItems = rows.reduce((sum, row) => sum + row.quantity, 0);
  const totalPrice = rows.reduce((sum, row) => sum + row.product.price * row.quantity, 0);
  cartList.insertAdjacentHTML('beforeend', `<div class="cart-total"><strong>${totalItems} ${word(totalItems, 'товар', 'товара', 'товаров')} на ${formatPrice(totalPrice)}</strong></div>`);

  selectAll.checked = rows.length > 0 && rows.every((row) => selected.has(row.product.id));
  bulkDelete.hidden = selected.size === 0;

  cartList.querySelectorAll('.cart-select').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const id = Number(checkbox.value);
      if (checkbox.checked) selected.add(id);
      else selected.delete(id);
      renderCart();
    });
  });
  cartList.querySelectorAll('[data-cart-inc]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.cartInc);
      const cart = getCart();
      setQuantity(id, (cart[id] ?? 0) + 1);
      renderCart();
    });
  });
  cartList.querySelectorAll('[data-cart-dec]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.cartDec);
      const cart = getCart();
      setQuantity(id, (cart[id] ?? 0) - 1);
      if (!getCart()[id]) selected.delete(id);
      renderCart();
    });
  });
  cartList.querySelectorAll('[data-delete-one]').forEach((button) => {
    button.addEventListener('click', () => requestDelete([Number(button.dataset.deleteOne)]));
  });
}

function word(value, one, few, many) {
  const mod10 = value % 10;
  const mod100 = value % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return few;
  return many;
}

function requestDelete(ids) {
  pendingDeleteIds = ids;
  const names = ids.map((id) => products.find((p) => p.id === id)?.name).filter(Boolean);
  confirmText.textContent = ids.length === 1
    ? `Вы действительно хотите удалить «${names[0]}»?`
    : `Вы действительно хотите удалить выбранные товары (${ids.length})?`;
  confirmModal.showModal();
}

selectAll.addEventListener('change', () => {
  const rows = cartRows();
  if (selectAll.checked) selected = new Set(rows.map((row) => row.product.id));
  else selected.clear();
  renderCart();
});

bulkDelete.addEventListener('click', () => requestDelete([...selected]));
document.querySelector('[data-confirm-cancel]').addEventListener('click', () => confirmModal.close());
document.querySelector('[data-confirm-ok]').addEventListener('click', () => {
  for (const id of pendingDeleteIds) {
    removeFromCart(id);
    selected.delete(id);
  }
  pendingDeleteIds = [];
  confirmModal.close();
  renderCart();
});

document.querySelectorAll('[data-tab]').forEach((button) => {
  button.addEventListener('click', async () => {
    document.querySelectorAll('[data-tab]').forEach((item) => item.classList.toggle('active', item === button));
    const tab = button.dataset.tab;
    cartPanel.hidden = tab !== 'cart';
    ordersPanel.hidden = tab !== 'orders';
    if (tab === 'orders') await renderOrders();
  });
});

checkoutForm.addEventListener('change', () => {
  const delivery = checkoutForm.elements.deliveryType.value === 'delivery';
  document.querySelector('[data-address-field]').hidden = !delivery;
});

function clearFormErrors() {
  checkoutForm.querySelectorAll('.form-field').forEach((field) => field.classList.remove('has-error'));
  checkoutForm.querySelectorAll('.field-error').forEach((node) => (node.textContent = ''));
}

function formError(name, message) {
  const input = checkoutForm.querySelector(`[name="${name}"]`);
  const field = input?.closest('.form-field');
  if (!field) return;
  field.classList.add('has-error');
  field.querySelector('.field-error').textContent = message;
}

checkoutForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearFormErrors();
  const data = new FormData(checkoutForm);
  const phone = String(data.get('phone') ?? '').trim();
  const email = String(data.get('email') ?? '').trim();
  const deliveryType = String(data.get('deliveryType') ?? 'pickup');
  const address = String(data.get('address') ?? '').trim();
  const payment = String(data.get('payment') ?? '').trim();

  let valid = true;
  if (!phone) {
    formError('phone', 'Заполните обязательное поле');
    valid = false;
  }
  if (deliveryType === 'delivery' && !address) {
    formError('address', 'Заполните обязательное поле');
    valid = false;
  }
  if (!payment) {
    formError('payment', 'Выберите способ оплаты');
    valid = false;
  }
  if (!valid) return;

  const items = Object.entries(getCart()).map(([productId, quantity]) => ({
    productId: Number(productId),
    quantity,
  }));

  try {
    const order = await createOrder({
      items,
      customer: {
        phone,
        email,
        deliveryType,
        address,
        payment,
        packaging: data.get('packaging') === 'on',
      },
    });
    clearCart();
    selected.clear();
    checkoutForm.reset();
    document.querySelector('[data-address-field]').hidden = true;
    renderCart();
    successText.innerHTML = `<strong>Спасибо за заказ!</strong><br />Номер заказа ${order.id}.<br />Мы свяжемся с вами в течение 10 минут, чтобы уточнить удобное время.`;
    successModal.showModal();
  } catch (error) {
    successText.textContent = error.message;
    successModal.showModal();
  }
});

document.querySelector('[data-success-close]').addEventListener('click', () => successModal.close());

async function renderOrders() {
  ordersList.innerHTML = '<p>Загрузка…</p>';
  try {
    const orders = await getOrders();
    if (!orders.length) {
      ordersList.innerHTML = '<p class="muted">История заказов пока пуста.</p>';
      return;
    }
    ordersList.innerHTML = orders
      .map((order) => `<div class="order-row"><strong>№ ${order.id} от ${formatDate(order.createdAt)}</strong><span>${order.itemsCount} ${word(order.itemsCount, 'товар', 'товара', 'товаров')}</span><strong>${formatPrice(order.total)}</strong></div>`)
      .join('');
  } catch (error) {
    ordersList.innerHTML = `<p class="error-box">${escapeHtml(error.message)}</p>`;
  }
}

try {
  products = await getGoods();
  renderCart();
} catch (error) {
  cartList.innerHTML = `<p class="error-box">Не удалось загрузить товары: ${escapeHtml(error.message)}</p>`;
}
