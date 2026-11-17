import {
  addProgrammer,
  removeProgrammer,
  Programmer,
  groupProgrammersByLanguage,
  getUniqueLanguages,
  groupProgrammersByLanguageCount,
  findTopPolyglots,
} from './model.js';

const STORAGE_KEY = 'programmers';

const programmers = loadProgrammers();

function loadProgrammers() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (raw === null) {
    return [];
  }

  try {
    const data = JSON.parse(raw);

    return data.map(
      (item) => new Programmer(item.id, item.name, item.languages),
    );
  } catch {
    return [];
  }
}

function saveProgrammers() {
  const snapshot = programmers.map((p) => ({
    id: p.id,
    name: p.name,
    languages: [...p.languages],
  }));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

function getNextId() {
  if (programmers.length === 0) {
    return 1;
  }

  return Math.max(...programmers.map((p) => p.id)) + 1;
}

/* ── Card rendering ── */

function renderCards() {
  const section = document.querySelector('section[data-testid="entity-list"]');
  section.innerHTML = '';

  if (programmers.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'Список пуст.';
    section.appendChild(empty);

    return;
  }

  for (const programmer of programmers) {
    const card = document.createElement('article');
    card.setAttribute('data-testid', 'entity-card');

    const title = document.createElement('h3');
    title.textContent = `${programmer.name} (id: ${programmer.id})`;
    card.appendChild(title);

    const langs = document.createElement('div');
    langs.className = 'card-lang-list';

    if (programmer.languages.length === 0) {
      langs.textContent = 'Нет языков.';
    } else {
      for (const lang of programmer.languages) {
        const badge = document.createElement('span');
        badge.className = 'lang-badge';
        badge.textContent = lang;
        langs.appendChild(badge);
      }
    }

    card.appendChild(langs);

    const count = document.createElement('p');
    count.className = 'card-lang-count';
    count.textContent = `Всего языков: ${programmer.languageCount}`;
    card.appendChild(count);

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const langBtn = document.createElement('button');
    langBtn.className = 'btn btn-sm btn-primary';
    langBtn.textContent = 'Языки';
    langBtn.addEventListener('click', () => {
      openLangModal(programmer);
    });
    actions.appendChild(langBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-sm btn-danger';
    deleteBtn.setAttribute('data-testid', 'delete-entity');
    deleteBtn.textContent = 'Удалить';
    deleteBtn.addEventListener('click', async () => {
      await removeProgrammer(programmers, programmer.id);
      saveProgrammers();
      renderAll();
    });
    actions.appendChild(deleteBtn);

    card.appendChild(actions);
    section.appendChild(card);
  }
}

/* ── Grouping rendering ── */

function renderGroupings() {
  renderGroupByLang();
  renderUniqueLangs();
  renderGroupByCount();
  renderTopPolyglots();
}

function renderGroupByLang() {
  const grouped = groupProgrammersByLanguage(programmers);
  const tbody = document.querySelector('.group-by-lang');
  tbody.innerHTML = '';

  if (grouped.size === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.textContent = 'Нет данных.';
    row.appendChild(cell);
    tbody.appendChild(row);

    return;
  }

  for (const [lang, list] of grouped) {
    const row = document.createElement('tr');
    const cellLang = document.createElement('td');
    cellLang.textContent = lang;
    row.appendChild(cellLang);

    const cellNames = document.createElement('td');
    cellNames.textContent = list.map((p) => p.name).join(', ');
    row.appendChild(cellNames);

    tbody.appendChild(row);
  }
}

function renderUniqueLangs() {
  const langs = getUniqueLanguages(programmers);
  const container = document.querySelector('.unique-langs');
  container.innerHTML = '';

  if (langs.size === 0) {
    container.textContent = 'Нет данных.';

    return;
  }

  for (const lang of langs) {
    const badge = document.createElement('span');
    badge.className = 'lang-badge';
    badge.textContent = lang;
    container.appendChild(badge);
  }
}

function renderGroupByCount() {
  const grouped = groupProgrammersByLanguageCount(programmers);
  const tbody = document.querySelector('.group-by-count');
  tbody.innerHTML = '';

  if (grouped.size === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.textContent = 'Нет данных.';
    row.appendChild(cell);
    tbody.appendChild(row);

    return;
  }

  for (const [count, list] of grouped) {
    const row = document.createElement('tr');
    const cellCount = document.createElement('td');
    cellCount.textContent = String(count);
    row.appendChild(cellCount);

    const cellNames = document.createElement('td');
    cellNames.textContent = list.map((p) => p.name).join(', ');
    row.appendChild(cellNames);

    tbody.appendChild(row);
  }
}

function renderTopPolyglots() {
  const top = findTopPolyglots(programmers);
  const container = document.querySelector('.top-polyglots');
  container.innerHTML = '';

  if (top.length === 0) {
    container.textContent = 'Нет данных.';

    return;
  }

  for (const programmer of top) {
    const badge = document.createElement('span');
    badge.className = 'lang-badge';
    badge.textContent = `${programmer.name} (${programmer.languageCount})`;
    container.appendChild(badge);
  }
}

function renderAll() {
  renderCards();
  renderGroupings();
}

/* ── Modal ── */

const langModal = document.getElementById('lang-modal');
const langForm = document.getElementById('lang-form');
const langInput = document.getElementById('lang-input');
const btnRemoveLang = document.getElementById('btn-remove-lang');
const btnCloseLang = document.getElementById('btn-close-lang');

function openLangModal(programmer) {
  langForm.setAttribute('data-programmer-id', String(programmer.id));
  langInput.value = '';
  langModal.classList.add('active');
}

function closeLangModal() {
  langModal.classList.remove('active');
}

langForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const programmerId = Number(langForm.getAttribute('data-programmer-id'));
  const programmer = programmers.find((p) => p.id === programmerId);

  if (!programmer) {
    return;
  }

  try {
    await programmer.addLanguage(langInput.value);
    saveProgrammers();
    renderAll();
    closeLangModal();
  } catch {
    /* ignore duplicate / empty */
  }
});

btnRemoveLang.addEventListener('click', async (event) => {
  event.preventDefault();

  const programmerId = Number(langForm.getAttribute('data-programmer-id'));
  const programmer = programmers.find((p) => p.id === programmerId);

  if (!programmer) {
    return;
  }

  try {
    await programmer.removeLanguage(langInput.value);
    saveProgrammers();
    renderAll();
    closeLangModal();
  } catch {
    /* ignore not found */
  }
});

btnCloseLang.addEventListener('click', (event) => {
  event.preventDefault();
  closeLangModal();
});

langModal.addEventListener('click', (event) => {
  if (event.target === langModal) {
    closeLangModal();
  }
});

/* ── Main form: add programmer ── */

const form = document.querySelector('form[data-testid="entity-form"]');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = Number(form.elements.id.value) || getNextId();
  const name = form.elements.name.value.trim();

  if (name.length === 0) {
    return;
  }

  const programmer = new Programmer(id, name);
  await addProgrammer(programmers, programmer);
  saveProgrammers();
  renderAll();
  form.reset();
});

/* ── Initial render ── */

renderAll();
