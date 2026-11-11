import {Restaurant} from './model.js';

let restaurants = [];

function saveData() {
  localStorage.setItem('restaurants', JSON.stringify(restaurants));
}

function loadData() {
  const strData = localStorage.getItem('restaurants');

  if (strData) {
    restaurants = JSON.parse(strData).map(
      (item) => new Restaurant(item.name, item.menu),
    );
  }

  renderUI();
}

const list = document.querySelector('[data-testid="entity-list"]');

function renderUI() {
  list.innerHTML = '';

  restaurants.forEach((r, index) => {
    const card = document.createElement('div');
    card.setAttribute('data-testid', 'entity-card');
    card.className = 'card';

    card.innerHTML = `
    <h3>${r.name} (Блюд: ${r.menuSize})</h3>
    <ul>
    ${r.menu
      .map(
        (dish) => `
      <li>
        ${dish.name} —${dish.price} руб. 
        <button class="delete-x" data-name="${dish.name}">X</button>
      </li>`,
      )
      .join('')}
    </ul>

    <form class="add-dish-form">
      <input type="text" name="dishName" placeholder="Название блюда" required>
      <input type="number" name="dishPrice" placeholder="Цена" required>
      <button class="add-dish" type="submit">Добавить блюдо</button>
    </form>

    <button data-testid="delete-entity" class="delete">Удалить ресторан</button>
    `;

    const addDishForm = card.querySelector('.add-dish-form');
    addDishForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(card.querySelector('.add-dish-form'));
      const dishName = formData.get('dishName');
      const dishPrice = Number(formData.get('dishPrice'));

      if (dishName && dishPrice) {
        setTimeout(() => {
          r.addDish({name: dishName, price: dishPrice});
          saveData();
          renderUI();
        }, 300);
      }
    });

    const deleteDishBtns = card.querySelectorAll('.card ul .delete-x');
    for (const b of deleteDishBtns) {
      b.addEventListener('click', () => {
        const dishName = b.getAttribute('data-name');

        if (dishName) {
          setTimeout(() => {
            r.removeDish(dishName);
            saveData();
            renderUI();
          }, 300);
        }
      });
    }

    const deleteBtn = card.querySelector('[data-testid="delete-entity"]');
    deleteBtn.addEventListener('click', () => {
      setTimeout(() => {
        restaurants.splice(index, 1);
        saveData();
        renderUI();
      }, 300);
    });

    list.appendChild(card);
  });
}

const form = document.querySelector('[data-testid="entity-form"]');
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const name = formData.get('name');

  setTimeout(() => {
    const newRestaurant = new Restaurant(name);
    restaurants.push(newRestaurant);

    saveData();
    renderUI();
    form.reset();
  }, 300);
});

loadData();
