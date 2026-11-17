import './style.css';
const $ = s => document.querySelector(s);
const app = $('#app'), modal = $('#modal');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const money = n => n + ' ₽';
const ratingText = r => String(r).replace('.', ',');
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const PNG_ICONS = ['fire', 'sparkles', 'rocket', 'refund', 'certificate', 'phone', 'mail', 'pin'];
const icon = (name, cls = 'ico') => `<img class="${cls}" src="assets/images/icons/${name}.${PNG_ICONS.includes(name) ? 'png' : 'svg'}" alt="">`;

const plural = (n, forms) => {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return forms[0];
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return forms[1];
  return forms[2];
};
const goodsCount = n => `${n} ${plural(n, ['товар', 'товара', 'товаров'])}`;

const CART = '<svg class="ico" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><circle cx="6" cy="14" r="2"/><circle cx="12" cy="14" r="2"/><path d="M15.68 3.557A1.8 1.8 0 0 0 14.4 2.93H5.28L4.8 1.257C4.64.55 4 0 3.2 0H1.6C.72 0 0 .707 0 1.571s.72 1.572 1.6 1.572h.24L3.2 9.743C3.36 10.529 4 11 4.8 11h8c.72 0 1.28-.471 1.52-1.1l1.6-4.929c.16-.471.08-.942-.24-1.414z"/></svg>';

let goods = [], user = null, cart = {}, page = 1, sort = 'new', filter = {};
const reversed = {new: false, popular: false};
let unchecked = new Set();
const offset = {hit: 0, new: 0};
try { cart = JSON.parse(localStorage.getItem('gadget-cart') || '{}'); } catch {}

async function api(path, body) {
  const r = await fetch('http://localhost:8080' + path, {
    credentials: 'include',
    ...(body ? {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)} : {})
  });
  const data = await r.json();
  if (!r.ok) throw Error(data.error);
  return data;
}

function popup(html, cls = '') {
  modal.className = cls;
  modal.innerHTML = '<button class="close" aria-label="Закрыть"></button><div class="dlg">' + html + '</div>';
  modal.querySelector('.close').onclick = () => modal.close();
  if (!modal.open) modal.showModal();
}
function error(e) {
  popup(`<h2>Не удалось выполнить действие</h2><p>${esc(e.message)}</p><div class="actions"><button class="btn" id="errOk">Ок</button></div>`, 'small');
  $('#errOk').onclick = () => modal.close();
}

const route = () => location.hash.slice(1) || 'home';
const cartCount = () => Object.values(cart).reduce((a, b) => a + b, 0);

function save() {
  if (Object.keys(cart).length) localStorage.setItem('gadget-cart', JSON.stringify(cart));
  else localStorage.removeItem('gadget-cart');
  header();
}
function header() {
  const r = route(), count = cartCount();
  const link = (href, ico, text, active, extra = '') =>
    `<a class="navitem ${active ? 'active' : ''}" href="${href}">${icon(ico)}<span>${text}</span>${extra}</a>`;
  $('#header').innerHTML =
    '<a class="logo" href="#home"><span>Gadget</span> Hub</a><nav>' +
    link('#catalog', 'catalog', 'Каталог', r === 'catalog') +
    (user
      ? link('#cart', 'card', 'Корзина', r === 'cart' || r === 'orders', count ? `<em class="badge">${count}</em>` : '') +
        `<button id="logout" class="navitem">${icon('profile')}<span>Выйти</span></button>`
      : link('#login', 'profile', 'Войти', r === 'login')) +
    '</nav>';
  if (user) $('#logout').onclick = async () => {
    try { await api('/logout', {}); user = null; location.hash = 'home'; render(); } catch (e) { error(e); }
  };
}

const stepper = (g, q) =>
  `<div class="stepper"><button class="step" data-change="${g.id},-1" aria-label="Уменьшить количество">−</button><span>${q}</span><button class="step" data-change="${g.id},1" aria-label="Увеличить количество">+</button></div>`;

function controlsHtml(g, mode) {
  const q = cart[g.id];
  if (mode === 'cart') return stepper(g, q);
  if (!q) return `<button class="btn" data-change="${g.id},1">${CART}В корзину</button>`;
  const label = mode === 'modal' ? `В корзине ${q} шт.` : `${q} шт.`;
  const tag = `<span class="btn pink static">${label}</span>`;
  return mode === 'modal' ? stepper(g, q) + tag : tag + stepper(g, q);
}
const controls = (g, mode) => `<div class="ctl ctl-${mode}" data-controls="${g.id}" data-mode="${mode}">${controlsHtml(g, mode)}</div>`;
function refreshControls(id) {
  const g = goods.find(x => x.id === id);
  document.querySelectorAll(`[data-controls="${id}"]`).forEach(el => el.innerHTML = controlsHtml(g, el.dataset.mode));
}
function setQty(id, q) {
  if (q <= 0) { delete cart[id]; unchecked.delete(id); } else cart[id] = Math.min(99, q);
  save();
  refreshControls(id);
  if (route() === 'cart') renderList();
}

const badges = g => (g.new || g.hit) ? `<span class="badges">${g.new ? '<i>Новинка</i>' : ''}${g.hit ? '<i class="pink">Хит</i>' : ''}</span>` : '';
const ratingHtml = g => `<p class="rating">${icon('star', 'star')}<span>${ratingText(g.rating)}</span></p>`;

function card(g, withButton = true) {
  return `<article><button class="picture" data-product="${g.id}"><img src="${g.image}" alt="${esc(g.name)}">${badges(g)}</button>` +
    `<h3 class="price">${money(g.price)}</h3><button class="name" data-product="${g.id}">${esc(g.name)}</button>${ratingHtml(g)}` +
    (withButton ? controls(g, 'card') : '') + '</article>';
}

function home() {
  const featured = goods.find(g => g.id === 31) || goods[0];
  const block = k => {
    const list = goods.filter(g => g[k]);
    const hit = k === 'hit';
    const cards = Array.from({length: Math.min(3, list.length)}, (_, i) => card(list[(offset[k] + i) % list.length], false)).join('');
    return `<section class="carousel"><div class="intro">${icon(hit ? 'fire' : 'sparkles', 'ico-lg')}<h2>${hit ? 'Хиты продаж' : 'Новинки'}</h2>` +
      `<p>${hit ? 'Тысячи покупателей уже одобрили эти товары. Самые популярные, проверенные и надежные гаджеты!' : 'Их только произвели - они уже у нас! Все самое новое и свежее на рынке электроники'}</p></div>` +
      `<button class="arrow" data-slide="${k},-1" aria-label="Предыдущие товары">${icon('chevron-left')}</button>` +
      `<div class="grid">${cards}</div>` +
      `<button class="arrow" data-slide="${k},1" aria-label="Следующие товары">${icon('chevron-right')}</button></section>`;
  };
  app.innerHTML =
    `<a class="hero" href="#catalog" aria-label="Перейти в каталог"><h1>NEW<br>GADGET</h1>` +
    `<div class="sticker"><b class="off">Новинка</b><b class="new">${money(featured.price)}</b></div>` +
    `<img class="featured" src="assets/images/banner/featured.png" alt="${esc(featured.name)}">` +
    `<span class="caption">${esc(featured.name)} — уже в каталоге</span></a>` +
    block('hit') + block('new') +
    `<h2 class="section-title">Преимущества</h2><section class="benefits">` +
    `<div>${icon('rocket', 'ico-xl')}<h3>Утром заказали,<br>вечером получили</h3></div>` +
    `<div>${icon('refund', 'ico-xl')}<h3>С товаром что-то не так?<br>Вернем деньги</h3></div>` +
    `<div>${icon('certificate', 'ico-xl')}<h3>Только оригинальные<br>товары</h3></div></section>` +
    `<h2 class="section-title">Работаем 24/7</h2><section class="contacts">` +
    `<a href="tel:88006783424">${icon('phone', 'ico-c')}8 (800) 678-34-24</a>` +
    `<a href="mailto:gadget@hub.ru">${icon('mail', 'ico-c')}gadget@hub.ru</a>` +
    `<span>${icon('pin', 'ico-c')}<b>Санкт-Петербург, ул.<br>Барочная, д.7, корпус 2</b></span></section>`;
}

function catalog() {
  const prices = goods.map(g => g.price), MIN = Math.min(...prices), MAX = Math.max(...prices);
  let list = goods.filter(g =>
    (!filter.min || g.price >= +filter.min) && (!filter.max || g.price <= +filter.max) &&
    (!filter.type?.length || filter.type.includes(g.type)) && (!filter.color?.length || filter.color.includes(g.color)));
  const dir = k => reversed[k] ? -1 : 1;
  list.sort((a, b) => (sort === 'cheap' ? a.price - b.price : sort === 'expensive' ? b.price - a.price :
    sort === 'popular' ? dir('popular') * (b.rating - a.rating) : dir('new') * (Number(b.new) - Number(a.new))) || a.id - b.id);
  const pages = Math.ceil(list.length / 9) || 1;
  page = Math.max(1, Math.min(page, pages));
  const nums = pages > 3 ? [1, 2, 3, '…', ...(page > 3 && page < pages ? [page] : []), pages] : Array.from({length: pages}, (_, i) => i + 1);
  const group = (key, title) =>
    `<h3>${title}</h3>` + [...new Set(goods.map(g => g[key]))].sort((a, b) => a.localeCompare(b, 'ru')).map(v =>
      `<label class="check"><input type="checkbox" name="${key}" value="${esc(v)}" ${filter[key]?.includes(v) ? 'checked' : ''}>${esc(cap(v))}</label>`).join('');

  app.innerHTML = `<h1>Каталог товаров</h1><div class="catalog"><section>` +
    `<div class="sort">${[['new', reversed.new ? 'Старые' : 'Новые'], ['popular', reversed.popular ? 'Менее популярные' : 'Популярные'], ['cheap', 'Подешевле'], ['expensive', 'Подороже']].map(([k, v]) => {
      const flip = sort === k && k in reversed;
      return `<button data-sort="${k}" class="${sort === k ? 'active' : ''}" ${k in reversed ? 'title="Нажмите ещё раз, чтобы изменить порядок"' : ''}>${v}${flip ? (reversed[k] ? ' ↑' : ' ↓') : ''}</button>`;
    }).join('')}</div>` +
    `<div class="grid">${list.slice((page - 1) * 9, page * 9).map(g => card(g)).join('') || '<p class="notfound">Товары по вашему запросу не найдены</p>'}</div>` +
    `<nav class="pagination">${page > 1 ? `<button data-page="${page - 1}" aria-label="Назад">${icon('chevron-left')}</button>` : ''}` +
    nums.map(n => n === '…' ? '<span>…</span>' : `<button data-page="${n}" class="${n === page ? 'active' : ''}">${n}</button>`).join('') +
    `${page < pages ? `<button data-page="${page + 1}" aria-label="Вперёд">${icon('chevron-right')}</button>` : ''}</nav></section>` +
    `<form id="filters"><h3>Цена, ₽</h3><div class="prices">` +
    `<label>От<input name="min" type="number" min="0" placeholder="${MIN}" value="${esc(filter.min || '')}"></label>` +
    `<label>До<input name="max" type="number" min="0" placeholder="${MAX}" value="${esc(filter.max || '')}"></label></div>` +
    `<div class="range"><div class="rtrack"></div><div class="rfill" id="rfill"></div>` +
    `<input type="range" id="rmin" min="${MIN}" max="${MAX}" step="1" value="${filter.min || MIN}" aria-label="Минимальная цена">` +
    `<input type="range" id="rmax" min="${MIN}" max="${MAX}" step="1" value="${filter.max || MAX}" aria-label="Максимальная цена"></div>` +
    group('type', 'Тип товара') + group('color', 'Цвет') +
    `<div class="filter-actions"><button class="btn">Показать</button><button type="button" id="reset" class="textbtn">Сбросить</button></div>` +
    `<p id="filterError" class="error"></p></form></div>`;

  const form = $('#filters'), rmin = $('#rmin'), rmax = $('#rmax'), fill = $('#rfill');
  const paint = () => {
    const pos = v => (v - MIN) / (MAX - MIN) * 100;
    fill.style.left = pos(+rmin.value) + '%';
    fill.style.right = (100 - pos(+rmax.value)) + '%';
    rmin.style.zIndex = +rmin.value > MIN + (MAX - MIN) / 2 ? 3 : 1;
  };
  rmin.oninput = () => { if (+rmin.value > +rmax.value) rmin.value = rmax.value; form.elements.min.value = rmin.value; paint(); };
  rmax.oninput = () => { if (+rmax.value < +rmin.value) rmax.value = rmin.value; form.elements.max.value = rmax.value; paint(); };

  const fmin = form.elements.min, fmax = form.elements.max;
  const bounds = () => ({lo: MIN, hi: MAX, minTop: fmax.value === '' ? MAX : Math.min(+fmax.value, MAX), maxBottom: fmin.value === '' ? MIN : Math.max(+fmin.value, MIN)});
  const clamp = (el, lo, hi, final) => {
    if (el.value === '') return;
    let v = +el.value;
    if (v > hi) v = hi;
    if (final && v < lo) v = lo;
    if (String(v) !== el.value) el.value = v;
  };
  const sync = () => {
    rmin.value = fmin.value === '' ? MIN : Math.max(+fmin.value, MIN);
    rmax.value = fmax.value === '' ? MAX : Math.min(+fmax.value, MAX);
    paint();
  };
  fmin.min = MIN; fmin.max = MAX; fmax.min = MIN; fmax.max = MAX;
  [fmin, fmax].forEach(el => {
    el.addEventListener('input', e => {
      const b = bounds(), isMin = el === fmin;
      const spinner = !e.inputType;
      if (isMin) clamp(el, b.lo, b.minTop, spinner); else clamp(el, b.maxBottom, b.hi, spinner);
      sync();
    });
    el.addEventListener('change', () => {
      const b = bounds();
      if (el === fmin) clamp(el, b.lo, b.minTop, true); else clamp(el, b.maxBottom, b.hi, true);
      sync();
    });
  });
  paint();

  form.onsubmit = e => {
    e.preventDefault();
    const f = new FormData(form);
    if (f.get('max') && +f.get('min') > +f.get('max')) return $('#filterError').textContent = 'Цена «От» должна быть не больше цены «До»';
    filter = {min: f.get('min'), max: f.get('max'), type: f.getAll('type'), color: f.getAll('color')};
    page = 1; catalog();
  };
  $('#reset').onclick = () => { filter = {}; page = 1; catalog(); };
}

const field = (label, input, req = true) => `<label class="${req ? 'req' : ''}">${label}${input}<small class="error"></small></label>`;
function login() {
  app.innerHTML = `<div class="loginscene">` +
    `<h1 class="logintitle">Добро пожаловать!</h1><form id="login" class="card login" novalidate>` +
    field('Логин', '<input name="login" autocomplete="username" required>') +
    field('Пароль', '<input name="password" type="password" autocomplete="current-password" required>') +
    `<button class="btn">Войти</button></form></div>`;
  $('#login').onsubmit = async e => {
    e.preventDefault();
    if (!validate(e.target)) return;
    try { await api('/login', Object.fromEntries(new FormData(e.target))); user = 'student'; location.hash = 'home'; }
    catch (err) { error(err); }
  };
}
function validate(form) {
  let ok = true;
  form.querySelectorAll('input,select').forEach(el => {
    const empty = el.required && !el.value.trim();
    const valid = !empty && el.checkValidity();
    el.classList.toggle('invalid', !valid);
    const msg = el.parentElement.querySelector('small.error');
    if (msg) msg.textContent = valid ? '' : (empty ? 'Заполните обязательное поле' : 'Проверьте правильность заполнения');
    if (!valid) ok = false;
  });
  return ok;
}

const tabs = active => `<nav class="tabs"><a class="${active === 'cart' ? 'active' : ''}" href="#cart">Корзина</a><a class="${active === 'orders' ? 'active' : ''}" href="#orders">История заказов</a></nav>`;
const cartItems = () => goods.filter(g => cart[g.id]);
const isSelected = id => !unchecked.has(id);

function renderList() {
  const items = cartItems();
  if (!items.length) return basket();
  const sel = items.filter(g => isSelected(g.id));
  const qty = sel.reduce((s, g) => s + cart[g.id], 0), sum = sel.reduce((s, g) => s + g.price * cart[g.id], 0);
  $('#cartbox').innerHTML =
    `<div class="carttoolbar"><label class="check"><input id="all" type="checkbox" ${sel.length === items.length ? 'checked' : ''}>Выбрать все</label>` +
    (sel.length ? `<button class="delbtn" id="removeSelected">${icon('cross-pink', 'x')}${sel.length === items.length ? 'Удалить все' : 'Удалить выбранные'}</button>` : '') + '</div>' +
    items.map(g => `<div class="cartrow"><input type="checkbox" data-select="${g.id}" ${isSelected(g.id) ? 'checked' : ''} aria-label="Выбрать товар">` +
      `<span class="thumb"><img src="${g.image}" alt="${esc(g.name)}"></span><span class="cname">${esc(g.name)}</span>${controls(g, 'cart')}` +
      `<b class="cprice">${money(g.price * cart[g.id])}</b><button class="delbtn" data-remove="${g.id}">${icon('cross-pink', 'x')}Удалить</button></div>`).join('') +
    `<div class="total"><b>${goodsCount(qty)} на ${money(sum)}</b></div>`;
  $('#all').onchange = e => { unchecked = new Set(e.target.checked ? [] : items.map(g => g.id)); renderList(); };
  const rs = $('#removeSelected');
  if (rs) rs.onclick = () => confirmRemove(sel.map(g => g.id));
}

function basket() {
  if (!cartItems().length) {
    app.innerHTML = tabs('cart') + `<div class="empty"><h1>Пока пусто</h1>` +
      `<p>Ознакомьтесь с новинками и хитами на главной<br>или найдите нужное в каталоге</p>` +
      `<div class="actions"><a class="btn" href="#catalog">Перейти в каталог</a><a class="homelink" href="#home">Главная страница</a></div></div>`;
    return;
  }
  app.innerHTML = tabs('cart') + `<section class="card cartbox" id="cartbox"></section><h2 class="ordertitle">Оформление заказа</h2>` +
    `<form id="checkout" class="card" novalidate><div class="fields">` +
    field('Телефон', '<input name="phone" type="tel" required pattern="[\\d+ \\(\\)\\-]{7,25}">') +
    field('E-mail', '<input name="email" type="email">', false) + `</div>` +
    `<div class="delivery"><label class="check"><input type="radio" name="delivery" value="pickup" checked>Самовывоз</label>` +
    `<label class="check"><input type="radio" name="delivery" value="delivery">Доставка</label></div>` +
    `<label class="req wide" id="address" hidden>Адрес доставки<input name="address"><small class="error"></small></label>` +
    field('Способ оплаты', '<select required name="payment"><option value="">Не выбрано</option><option value="card">По карте</option><option value="cash">Наличными</option></select>', false) +
    `<label class="check pack"><input name="packaging" type="checkbox">Нужна упаковка</label>` +
    `<button class="btn">Оформить заказ</button><p class="error" id="orderError"></p></form>`;
  renderList();

  const form = $('#checkout');
  form.onchange = e => {
    if (e.target.name !== 'delivery') return;
    const delivery = form.elements.delivery.value === 'delivery';
    $('#address').hidden = !delivery;
    form.elements.address.required = delivery;
    if (!delivery) { form.elements.address.value = ''; form.elements.address.classList.remove('invalid'); $('#address small').textContent = ''; }
  };
  form.onsubmit = async e => {
    e.preventDefault();
    const sel = cartItems().filter(g => isSelected(g.id));
    if (!validate(form)) return;
    if (!sel.length) return $('#orderError').textContent = 'Выберите хотя бы один товар для заказа';
    $('#orderError').textContent = '';
    const button = form.querySelector('button.btn');
    button.disabled = true;
    try {
      const data = Object.fromEntries(new FormData(form));
      data.packaging = !!data.packaging;
      data.items = sel.map(g => ({id: g.id, quantity: cart[g.id]}));
      const order = await api('/orders', data);
      sel.forEach(g => { delete cart[g.id]; unchecked.delete(g.id); });
      save();
      basket();
      popup(`<img class="smile" src="assets/images/icons/smile.svg" alt=""><h2>Спасибо, ваш заказ успешно оформлен</h2>` +
        `<p>Номер заказа ${esc(order.number || order.id.slice(0, 8))}.</p>` +
        (data.delivery === 'delivery' ? '<p>Мы свяжемся с вами в течение 10 минут, чтобы уточнить удобное для вас время доставки</p>' : '') +
        `<div class="actions"><button class="btn" id="ok">Ок</button></div>`, 'small');
      $('#ok').onclick = () => modal.close();
    } catch (err) { $('#orderError').textContent = err.message; button.disabled = false; }
  };
}

function confirmRemove(ids) {
  const names = ids.map(id => goods.find(g => g.id === id).name);
  popup(`<p class="confirm-text">Вы уверены, что хотите удалить?</p>` +
    `<p class="confirm-items">${ids.length === 1 ? esc(names[0]) : `Выбранные товары: ${ids.length}`}</p>` +
    `<div class="actions"><button id="no" class="textbtn">Отмена</button><button id="yes" class="btn">Да, удалить</button></div>`, 'small');
  $('#no').onclick = () => modal.close();
  $('#yes').onclick = () => {
    ids.forEach(id => { delete cart[id]; unchecked.delete(id); });
    save(); modal.close(); basket();
  };
}

async function orders() {
  app.innerHTML = tabs('orders') + '<p>Загрузка…</p>';
  try {
    const list = await api('/orders');
    if (route() !== 'orders') return;
    app.innerHTML = tabs('orders') + (list.length
      ? `<section class="card orders">${list.map(o => `<div class="order"><span>№ ${esc(o.number || o.id.slice(0, 8))} от ${new Date(o.date).toLocaleDateString('ru-RU')}</span>` +
        `<span>${goodsCount(o.items.reduce((s, i) => s + i.quantity, 0))}</span><span>${money(o.total)}</span></div>`).join('')}</section>`
      : '<p class="notfound">У вас пока нет заказов</p>');
  } catch (e) { error(e); }
}

function product(id) {
  if (!user) { location.hash = 'login'; return; }
  const g = goods.find(x => x.id === id);
  popup(`<div class="pm"><div class="pm-img"><img src="${g.image}" alt="${esc(g.name)}">${badges(g)}</div><div class="pm-info">` +
    `<h2>${esc(g.name)}</h2>${ratingHtml(g)}<p class="pm-desc">${esc(g.description)}</p><h3>Характеристики</h3>` +
    Object.entries(g.specs).map(([k, v]) => `<p class="spec"><span>${esc(k)}</span><i></i><span class="val">${esc(v)}</span></p>`).join('') +
    `<div class="pm-foot"><b class="pm-price">${money(g.price)}</b>${controls(g, 'modal')}</div></div></div>`, 'product');
}

function render() {
  const r = route();
  if (['catalog', 'cart', 'orders'].includes(r) && !user) { location.hash = 'login'; return; }
  document.body.dataset.page = r;
  header();
  ({home, catalog, login, cart: basket, orders}[r] || home)();
}

document.addEventListener('click', e => {
  if (e.target === modal) return modal.close();
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.product) product(+b.dataset.product);
  if (b.dataset.change) {
    if (!user) { location.hash = 'login'; return; }
    const [id, delta] = b.dataset.change.split(',').map(Number);
    if (delta < 0 && cart[id] === 1 && b.closest('.cartrow')) return confirmRemove([id]);
    setQty(id, (cart[id] || 0) + delta);
  }
  if (b.dataset.slide) {
    const [k, d] = b.dataset.slide.split(',');
    const n = goods.filter(g => g[k]).length;
    offset[k] = (offset[k] + +d + n) % n;
    home();
  }
  if (b.dataset.sort) {
    const k = b.dataset.sort;
    if (sort === k && k in reversed) reversed[k] = !reversed[k]; else sort = k;
    page = 1; catalog();
  }
  if (b.dataset.page) { page = +b.dataset.page; catalog(); window.scrollTo(0, 0); }
  if (b.dataset.remove) confirmRemove([+b.dataset.remove]);
});
document.addEventListener('change', e => {
  if (e.target.dataset.select) {
    const id = +e.target.dataset.select;
    e.target.checked ? unchecked.delete(id) : unchecked.add(id);
    renderList();
  }
});
document.addEventListener('input', e => {
  const el = e.target;
  if (el.classList?.contains('invalid') && el.checkValidity() && el.value.trim()) {
    el.classList.remove('invalid');
    const msg = el.parentElement.querySelector('small.error');
    if (msg) msg.textContent = '';
  }
});
window.addEventListener('hashchange', () => { modal.close(); render(); window.scrollTo(0, 0); });

try {
  [goods, {user}] = await Promise.all([api('/goods'), api('/session')]);
  cart = Object.fromEntries(Object.entries(cart).filter(([id, q]) => goods.some(g => g.id === +id) && Number.isInteger(q) && q > 0 && q <= 99));
  render();
} catch (e) {
  app.innerHTML = '<h1>Сервер недоступен</h1><p>Запустите проект командой npm start и обновите страницу.</p>';
}
