// Модель данных канбан-доски: состояние, localStorage и чистые функции.

const STORAGE_KEY = 'lab5.kanban.board';

let idCounter = 0;

function nextId(prefix) {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

// Начальное состояние, если в localStorage пусто.
export function createInitialState() {
  const first = {id: nextId('card'), text: 'Сверстать шапку'};
  const second = {id: nextId('card'), text: 'Настроить drag-and-drop'};
  const third = {id: nextId('card'), text: 'Сохранить в localStorage'};

  return {
    cards: {
      [first.id]: first,
      [second.id]: second,
      [third.id]: third,
    },
    columns: [
      {id: 'todo', title: 'Сделать', cardIds: [first.id, second.id]},
      {id: 'in-progress', title: 'В процессе', cardIds: [third.id]},
      {id: 'done', title: 'Готово', cardIds: []},
    ],
  };
}

function isValidBoard(state) {
  return (
    state !== null &&
    typeof state === 'object' &&
    Array.isArray(state.columns) &&
    typeof state.cards === 'object' &&
    state.cards !== null
  );
}

// Загрузка состояния из localStorage с фолбэком на начальное.
export function loadBoard() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return createInitialState();
    }
    const parsed = JSON.parse(raw);
    if (!isValidBoard(parsed)) {
      return createInitialState();
    }
    return parsed;
  } catch {
    return createInitialState();
  }
}

export function saveBoard(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Переполнение хранилища игнорируется: интерфейс продолжает работать.
  }
}

// Добавление карточки в конец колонки.
export function addCard(state, columnId, text) {
  const trimmed = text.trim();
  if (trimmed === '') {
    return state;
  }
  const card = {id: nextId('card'), text: trimmed};
  return {
    cards: {...state.cards, [card.id]: card},
    columns: state.columns.map((column) =>
      column.id === columnId
        ? {...column, cardIds: [...column.cardIds, card.id]}
        : column,
    ),
  };
}

// Удаление карточки из колонок и из реестра.
export function removeCard(state, cardId) {
  const cards = {...state.cards};
  delete cards[cardId];
  return {
    cards,
    columns: state.columns.map((column) => ({
      ...column,
      cardIds: column.cardIds.filter((id) => id !== cardId),
    })),
  };
}

// Изменение текста карточки.
export function updateCardText(state, cardId, text) {
  const card = state.cards[cardId];
  if (!card) {
    return state;
  }
  return {
    ...state,
    cards: {...state.cards, [cardId]: {...card, text}},
  };
}

// Перемещение карточки в целевую колонку на указанную позицию.
export function moveCard(state, cardId, toColumnId, toIndex) {
  if (!state.cards[cardId]) {
    return state;
  }

  const columns = state.columns.map((column) => ({
    ...column,
    cardIds: column.cardIds.filter((id) => id !== cardId),
  }));

  const target = columns.find((column) => column.id === toColumnId);
  if (!target) {
    return state;
  }

  const index = Math.max(0, Math.min(toIndex, target.cardIds.length));
  target.cardIds.splice(index, 0, cardId);

  return {...state, columns};
}

// Колонка-приёмник "Готово" для тестового контракта.
export const DONE_COLUMN_ID = 'done';
