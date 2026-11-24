import { User } from './model.js';

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

function findUser(id) {
  return users.find((user) => String(user.id) === String(id));
}

function isFriend(user, id) {
  return user.friends.some((friendId) => String(friendId) === String(id));
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

function addFriend(userId, friendId) {
  return runLater(() => {
    const user = findUser(userId);

    if (user) {
      user.addFriend(friendId);
    }
  });
}

function removeFriend(userId, friendId) {
  return runLater(() => {
    const user = findUser(userId);

    if (user) {
      user.removeFriend(friendId);
    }
  });
}

function createText(tag, className, text) {
  const element = document.createElement(tag);

  element.className = className;
  element.textContent = text;

  return element;
}

function createFriendItem(user, friendId) {
  const item = document.createElement('li');
  const friend = findUser(friendId);
  const button = createText('button', 'button button-small', 'Удалить друга');

  item.className = 'friend-item';
  item.append(friend ? friend.name : friendId);

  button.type = 'button';
  button.addEventListener('click', () => {
    removeFriend(user.id, friendId);
  });

  item.append(button);

  return item;
}

function createFriendRow(user) {
  const others = users.filter(
    (other) => other.id !== user.id && !isFriend(user, other.id),
  );

  if (others.length === 0) {
    return null;
  }

  const row = document.createElement('div');
  const select = document.createElement('select');
  const button = createText('button', 'button', 'Добавить друга');

  row.className = 'friend-row';
  select.className = 'input friend-select';
  select.setAttribute('aria-label', `Новый друг для ${user.name}`);

  for (const other of others) {
    const option = document.createElement('option');

    option.value = other.id;
    option.textContent = other.name;
    select.append(option);
  }

  button.type = 'button';
  button.addEventListener('click', () => {
    addFriend(user.id, select.value);
  });

  row.append(select, button);

  return row;
}

function createCard(user) {
  const card = document.createElement('li');
  const friendList = document.createElement('ul');
  const deleteButton = createText('button', 'button button-danger', 'Удалить');

  card.className = 'user-card';
  card.dataset.testid = 'entity-card';

  friendList.className = 'friend-list';

  for (const friendId of user.friends) {
    friendList.append(createFriendItem(user, friendId));
  }

  deleteButton.type = 'button';
  deleteButton.dataset.testid = 'delete-entity';
  deleteButton.addEventListener('click', () => {
    deleteUser(user.id);
  });

  card.append(
    createText('h3', 'user-name', user.name),
    createText('p', 'user-text', `ID: ${user.id}`),
    createText('p', 'user-text', `Друзей: ${user.friendCount}`),
    friendList,
  );

  const friendRow = createFriendRow(user);

  if (friendRow) {
    card.append(friendRow);
  }

  card.append(deleteButton);

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

  if (id === '' || findUser(id)) {
    id = String(Date.now());
  }

  addUser(new User(id, name));
  form.reset();
});

render();
