import { getSession, logout } from './api.js';
import { cartItemsCount } from './cart-store.js';

let currentSession = { authenticated: false, username: null };
let currentActive = '';

function headerMarkup(session, active) {
  const count = cartItemsCount();
  const catalogClass = active === 'catalog' ? 'nav-link active' : 'nav-link';
  const cartClass = active === 'cart' ? 'nav-link active' : 'nav-link';

  return `
    <header class="site-header">
      <div class="container header-inner">
        <a class="brand" href="./index.html" aria-label="Gadget Hub — главная">
          <span class="brand-wordmark"><span>Gadget</span> Hub</span>
        </a>
        <nav class="main-nav" aria-label="Основная навигация">
          <a class="${catalogClass}" href="./catalog.html">
            <img src="./assets/images/icons/catalog.svg" alt="" />
            Каталог
          </a>
          ${
            session.authenticated
              ? `<a class="${cartClass}" href="./cart.html">
                  <img src="./assets/images/icons/card.svg" alt="" />
                  Корзина <span class="cart-badge" data-cart-count ${count ? '' : 'hidden'}>${count}</span>
                </a>
                <button class="nav-link nav-button" type="button" data-logout>
                  <img src="./assets/images/icons/profile.svg" alt="" />
                  Выйти
                </button>`
              : `<a class="nav-link" href="./login.html">
                  <img src="./assets/images/icons/profile.svg" alt="" />
                  Войти
                </a>`
          }
        </nav>
      </div>
    </header>`;
}

function footerMarkup() {
  return `
    <footer class="site-footer">
      <div class="container footer-inner">
        <div>
          <strong>Gadget Hub</strong>
          <p>Магазин надежных гаджетов</p>
          <small>© 2024 ООО «Гаджет Хаб». Все права защищены</small>
        </div>
        <a class="footer-phone" href="tel:88006783424">
          <img src="./assets/images/icons/mobile.svg" alt="" />
          8 (800) 678-34-24
        </a>
        <div class="socials" aria-label="Социальные сети">
          <a href="#" aria-label="VK"><img src="./assets/images/social/vk.png" alt="" /></a>
          <a href="#" aria-label="Telegram"><img src="./assets/images/social/telegram.png" alt="" /></a>
          <a href="#" aria-label="WhatsApp"><img src="./assets/images/social/whatsapp.png" alt="" /></a>
        </div>
      </div>
    </footer>`;
}

function mountLayout(session, active) {
  const header = document.querySelector('[data-site-header]');
  const footer = document.querySelector('[data-site-footer]');
  if (header) header.innerHTML = headerMarkup(session, active);
  if (footer) footer.innerHTML = footerMarkup();

  document.querySelector('[data-logout]')?.addEventListener('click', async () => {
    await logout();
    window.location.href = './index.html';
  });
}

export async function initLayout(active = '') {
  currentActive = active;
  try {
    currentSession = await getSession();
  } catch {
    currentSession = { authenticated: false, username: null };
  }
  mountLayout(currentSession, currentActive);
  window.addEventListener('cart-changed', updateCartBadge);
  return currentSession;
}

export function updateCartBadge() {
  const badge = document.querySelector('[data-cart-count]');
  if (badge) {
    const count = cartItemsCount();
    badge.textContent = String(count);
    badge.hidden = count === 0;
  }
}

export async function requireAuth() {
  let session;
  try {
    session = await getSession();
  } catch {
    session = { authenticated: false };
  }
  if (!session.authenticated) {
    const next = encodeURIComponent(window.location.pathname.split('/').pop() || 'index.html');
    window.location.href = `./login.html?next=${next}`;
    return null;
  }
  currentSession = session;
  return session;
}
