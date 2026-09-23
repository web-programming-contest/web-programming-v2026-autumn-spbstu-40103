import {User} from './model.js';

const STORAGE_KEY = 'lab4-users';
const ASYNC_DELAY_MS = 300;

let users = loadUsers();

const listElement = document.querySelector('[data-testid="entity-list"]');
const formElement = document.querySelector('[data-testid="entity-form"]');
const emptyHint = document.querySelector('[data-empty-hint]');
const cardTemplate = document.getElementById('user-card-template');

function loadUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return parsed.map((item) => new User(item.id, item.name, item.friends));
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function saveUsers() {
  const serialisable = users.map((user) => ({
    id: user.id,
    name: user.name,
    friends: user.friends,
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serialisable));
}

function runAsync(action) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(action());
    }, ASYNC_DELAY_MS);
  });
}

function render() {
  listElement.innerHTML = '';
  emptyHint.hidden = users.length > 0;

  for (const user of users) {
    const fragment = cardTemplate.content.cloneNode(true);
    const card = fragment.querySelector('[data-testid="entity-card"]');

    card.querySelector('[data-field="name"]').textContent = user.name;
    card.querySelector('[data-field="id"]').textContent = `#${user.id}`;
    card.querySelector('[data-field="friends"]').textContent =
      user.friends.length > 0 ? user.friends.join(', ') : 'нет';

    card
      .querySelector('[data-role="add-friend-form"]')
      .addEventListener('submit', (event) => {
        event.preventDefault();
        const input = event.currentTarget.querySelector(
          'input[name="friendId"]',
        );
        const friendId = Number(input.value);

        if (!Number.isInteger(friendId)) {
          return;
        }

        if (user.id === friendId) {
          window.alert('Нельзя добавить самого себя в друзья.');
          return;
        }

        const friendExists = users.some(
          (candidate) => candidate.id === friendId,
        );
        if (!friendExists) {
          window.alert(`Пользователь с ID ${friendId} не найден.`);
          return;
        }

        runAsync(() => {
          user.addFriend(friendId);
          saveUsers();
        }).then(() => {
          input.value = '';
          render();
        });
      });

    card
      .querySelector('[data-role="remove-friend-form"]')
      .addEventListener('submit', (event) => {
        event.preventDefault();
        const input = event.currentTarget.querySelector(
          'input[name="friendId"]',
        );
        const friendId = Number(input.value);

        if (!Number.isInteger(friendId)) {
          return;
        }

        if (user.id === friendId) {
          window.alert('Нельзя удалить самого себя из друзей.');
          return;
        }

        if (!user.friends.includes(friendId)) {
          window.alert(`У пользователя нет друга с ID ${friendId}.`);
          return;
        }

        runAsync(() => {
          user.removeFriend(friendId);
          saveUsers();
        }).then(() => {
          input.value = '';
          render();
        });
      });

    card
      .querySelector('[data-testid="delete-entity"]')
      .addEventListener('click', () => {
        runAsync(() => {
          users = users.filter((candidate) => candidate.id !== user.id);
          saveUsers();
        }).then(() => {
          render();
        });
      });

    listElement.append(fragment);
  }
}

formElement.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(formElement);
  const id = Number(formData.get('id'));
  const name = String(formData.get('name') ?? '').trim();

  if (!Number.isInteger(id) || name === '') {
    return;
  }

  if (users.some((user) => user.id === id)) {
    window.alert(`Пользователь с ID ${id} уже существует.`);
    return;
  }

  runAsync(() => {
    users.push(new User(id, name, []));
    saveUsers();
  }).then(() => {
    formElement.reset();
    render();
  });
});

render();
