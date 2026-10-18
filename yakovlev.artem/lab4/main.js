import {User, getUniqueFriends, findUsersWithoutFriends} from './model.js';

const STORAGE_KEY = 'lab4-users';
const OPERATION_DELAY_MS = 300;

const form = document.querySelector('[data-testid="entity-form"]');
const list = document.querySelector('[data-testid="entity-list"]');
const statusLine = document.querySelector('[data-testid="status"]');
const emptyState = document.querySelector('[data-testid="empty-state"]');
const summary = document.querySelector('[data-testid="summary"]');

let users = loadUsers();

function isStoredUser(item) {
  return (
    item !== null &&
    typeof item === 'object' &&
    Number.isInteger(item.id) &&
    typeof item.name === 'string' &&
    Array.isArray(item.friends) &&
    item.friends.every(Number.isInteger)
  );
}

function loadUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(isStoredUser)
      .map((item) => new User(item.id, item.name, item.friends));
  } catch {
    return [];
  }
}

function saveUsers() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch {
    showStatus('Не удалось сохранить данные в localStorage', true);
  }
}

function runOperation(operation) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(operation());
      } catch (error) {
        reject(error);
      }
    }, OPERATION_DELAY_MS);
  });
}

async function perform(operation, successMessage) {
  showStatus('Выполняется…');

  try {
    await runOperation(operation);
    saveUsers();
    render();
    showStatus(successMessage);
    return true;
  } catch (error) {
    showStatus(error.message, true);
    return false;
  }
}

function parseId(value, label) {
  const text = String(value ?? '').trim();

  if (!/^\d+$/.test(text)) {
    throw new Error(`${label} должен быть целым неотрицательным числом`);
  }

  return Number(text);
}

function findUser(id) {
  const user = users.find((item) => item.id === id);

  if (!user) {
    throw new Error(`Пользователь с ID ${id} не найден`);
  }

  return user;
}

function addUser(rawId, rawName) {
  const id = parseId(rawId, 'ID');
  const name = String(rawName ?? '').trim();

  if (!name) {
    throw new Error('Имя не может быть пустым');
  }

  if (users.some((user) => user.id === id)) {
    throw new Error(`Пользователь с ID ${id} уже существует`);
  }

  users.push(new User(id, name));
}

function removeUser(userId) {
  findUser(userId);
  users = users.filter((user) => user.id !== userId);

  for (const user of users) {
    user.removeFriend(userId);
  }
}

function addFriend(userId, rawFriendId) {
  const user = findUser(userId);
  const friendId = parseId(rawFriendId, 'ID друга');

  if (friendId === userId) {
    throw new Error('Пользователь не может дружить сам с собой');
  }

  if (!user.addFriend(friendId)) {
    throw new Error(`Пользователь ${user.name} уже дружит с ID ${friendId}`);
  }
}

function removeFriend(userId, rawFriendId) {
  const user = findUser(userId);
  const friendId = parseId(rawFriendId, 'ID друга');

  if (!user.removeFriend(friendId)) {
    throw new Error(`ID ${friendId} нет в списке друзей ${user.name}`);
  }
}

function showStatus(message, isError = false) {
  statusLine.textContent = message;
  statusLine.dataset.state = isError ? 'error' : 'info';
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}

function describeFriend(friendId) {
  const friend = users.find((user) => user.id === friendId);
  return friend ? `${friend.name} (ID ${friendId})` : `ID ${friendId}`;
}

function createFriendList(user) {
  const friendList = createElement('ul', 'friend-list');

  if (user.friendCount === 0) {
    friendList.append(createElement('li', 'friend-empty', 'Друзей пока нет'));
    return friendList;
  }

  for (const friendId of user.friends) {
    friendList.append(createElement('li', 'friend', describeFriend(friendId)));
  }

  return friendList;
}

function createFriendForm(user) {
  const friendForm = createElement('form', 'friend-form');
  friendForm.dataset.testid = 'friend-form';

  const label = createElement('label', 'field');
  const labelText = createElement('span', 'field-label', 'ID друга');
  const input = createElement('input', 'field-input');
  input.type = 'number';
  input.name = 'friendId';
  input.min = '0';
  input.step = '1';
  input.required = true;
  label.append(labelText, input);

  const addButton = createElement(
    'button',
    'button button-primary',
    'Добавить друга',
  );
  addButton.type = 'submit';

  const removeButton = createElement('button', 'button', 'Удалить друга');
  removeButton.type = 'button';

  friendForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    await perform(
      () => addFriend(user.id, input.value),
      `Друг добавлен пользователю ${user.name}`,
    );
  });

  removeButton.addEventListener('click', () => {
    perform(
      () => removeFriend(user.id, input.value),
      `Друг удалён у пользователя ${user.name}`,
    );
  });

  const actions = createElement('div', 'friend-actions');
  actions.append(addButton, removeButton);
  friendForm.append(label, actions);

  return friendForm;
}

function createCard(user) {
  const card = createElement('li', 'user-card');
  card.dataset.testid = 'entity-card';
  card.dataset.userId = String(user.id);

  const header = createElement('div', 'card-header');
  header.append(
    createElement('h2', 'card-name', user.name),
    createElement('p', 'card-id', `ID: ${user.id}`),
  );

  const friendsTitle = createElement(
    'h3',
    'card-subtitle',
    `Друзья (${user.friendCount})`,
  );

  const deleteButton = createElement(
    'button',
    'button button-danger',
    'Удалить пользователя',
  );
  deleteButton.type = 'button';
  deleteButton.dataset.testid = 'delete-entity';
  deleteButton.addEventListener('click', () => {
    perform(() => removeUser(user.id), `Пользователь ${user.name} удалён`);
  });

  card.append(
    header,
    friendsTitle,
    createFriendList(user),
    createFriendForm(user),
    deleteButton,
  );

  return card;
}

function render() {
  list.replaceChildren(...users.map(createCard));
  emptyState.hidden = users.length > 0;
  summary.hidden = users.length === 0;
  summary.textContent =
    `Всего пользователей: ${users.length} · ` +
    `без друзей: ${findUsersWithoutFriends(users).length} · ` +
    `уникальных друзей: ${getUniqueFriends(users).length}`;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const added = await perform(
    () => addUser(data.get('id'), data.get('name')),
    'Пользователь добавлен',
  );

  if (added) {
    form.reset();
    form.elements.namedItem('id').focus();
  }
});

window.addEventListener('pagehide', saveUsers);
window.addEventListener('beforeunload', saveUsers);

render();
