import {User} from './model.js';

const storageKey = 'users';
const delay = 300;

const form = document.querySelector('[data-testid="entity-form"]');
const list = document.querySelector('[data-testid="entity-list"]');

let users = loadUsers();

function loadUsers() {
  try {
    const items = JSON.parse(localStorage.getItem(storageKey)) || [];

    return items.map((item) => new User(item.id, item.name, item.friends));
  } catch {
    return [];
  }
}

function saveUsers() {
  localStorage.setItem(storageKey, JSON.stringify(users));
}

function runLater(action) {
  return new Promise((resolve) => {
    setTimeout(() => {
      action();
      saveUsers();
      render();
      resolve();
    }, delay);
  });
}

function addUser(user) {
  return runLater(() => {
    users.push(user);
  });
}

function deleteUser(id) {
  return runLater(() => {
    users = users.filter((user) => String(user.id) !== String(id));

    for (const user of users) {
      user.removeFriend(id);
    }
  });
}

function createText(tag, className, text) {
  const element = document.createElement(tag);

  element.className = className;
  element.textContent = text;

  return element;
}

function createCard(user) {
  const card = document.createElement('li');
  const deleteButton = createText('button', 'button button-danger', 'Удалить');

  card.className = 'user-card';
  card.dataset.testid = 'entity-card';

  deleteButton.type = 'button';
  deleteButton.dataset.testid = 'delete-entity';
  deleteButton.addEventListener('click', () => {
    deleteUser(user.id);
  });

  card.append(
    createText('h3', 'user-name', user.name),
    createText('p', 'user-text', `ID: ${user.id}`),
    createText('p', 'user-text', `Друзей: ${user.friendCount}`),
    deleteButton,
  );

  return card;
}

function render() {
  list.replaceChildren(...users.map((user) => createCard(user)));
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = String(data.get('name')).trim();

  if (name === '') {
    return;
  }

  let id = String(data.get('id')).trim();

  if (id === '' || users.some((user) => String(user.id) === id)) {
    id = String(Date.now());
  }

  const friends = String(data.get('friends'))
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== '');

  addUser(new User(id, name, friends));
  form.reset();
});

render();
