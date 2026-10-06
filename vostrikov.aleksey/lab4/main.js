import {Recipe} from './model.js';

const storageKey = 'lab4-recipes';

const form = document.querySelector('[data-testid="entity-form"]');
const list = document.querySelector('[data-testid="entity-list"]');

let recipes = loadRecipes();

function loadRecipes() {
  const saved = localStorage.getItem(storageKey);

  if (!saved) {
    return [];
  }

  const parsed = JSON.parse(saved);

  return parsed.map(
    (item) => new Recipe(item.title, item.ingredients ?? [], item.steps ?? []),
  );
}

function saveRecipes() {
  localStorage.setItem(storageKey, JSON.stringify(recipes));
}

function parseList(value, separator) {
  return value
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
}

function renderRecipes() {
  list.replaceChildren();

  for (const recipe of recipes) {
    const card = document.createElement('article');
    card.className = 'recipe-card';
    card.dataset.testid = 'entity-card';

    const title = document.createElement('h3');
    title.textContent = recipe.title;

    const counters = document.createElement('p');
    counters.textContent = `Ингредиентов: ${recipe.ingredientCount}. Шагов: ${recipe.steps.length}.`;

    const ingredientTitle = document.createElement('h4');
    ingredientTitle.textContent = 'Ингредиенты';

    const ingredientList = document.createElement('ul');

    for (const ingredient of recipe.ingredients) {
      const item = document.createElement('li');
      item.textContent = ingredient;
      ingredientList.append(item);
    }

    const stepsTitle = document.createElement('h4');
    stepsTitle.textContent = 'Шаги приготовления';

    const stepList = document.createElement('ol');

    for (const step of recipe.steps) {
      const item = document.createElement('li');
      item.textContent = step;
      stepList.append(item);
    }

    const controls = document.createElement('div');
    controls.className = 'card-controls';

    const ingredientRow = createControlRow(
      'Новый ингредиент',
      'Добавить ингредиент',
      (value) => {
        recipe.addIngredient(value);
        saveRecipes();
        renderRecipes();
      },
    );

    const removeIngredientRow = createControlRow(
      'Удалить ингредиент',
      'Удалить ингредиент',
      (value) => {
        recipe.removeIngredient(value);
        saveRecipes();
        renderRecipes();
      },
    );

    const stepRow = createControlRow('Новый шаг', 'Добавить шаг', (value) => {
      recipe.steps.push(value);
      saveRecipes();
      renderRecipes();
    });

    const removeStepRow = createControlRow(
      'Удалить шаг',
      'Удалить шаг',
      (value) => {
        recipe.steps = recipe.steps.filter((step) => step !== value);
        saveRecipes();
        renderRecipes();
      },
    );

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.type = 'button';
    deleteButton.dataset.testid = 'delete-entity';
    deleteButton.textContent = 'Удалить рецепт';

    deleteButton.addEventListener('click', () => {
      setTimeout(() => {
        recipes = recipes.filter((item) => item !== recipe);
        saveRecipes();
        renderRecipes();
      }, 100);
    });

    controls.append(
      ingredientRow,
      removeIngredientRow,
      stepRow,
      removeStepRow,
      deleteButton,
    );

    card.append(
      title,
      counters,
      ingredientTitle,
      ingredientList,
      stepsTitle,
      stepList,
      controls,
    );

    list.append(card);
  }
}

function createControlRow(placeholder, buttonText, action) {
  const row = document.createElement('div');
  row.className = 'control-row';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = placeholder;

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = buttonText;

  button.addEventListener('click', () => {
    const value = input.value.trim();

    if (!value) {
      return;
    }

    setTimeout(() => action(value), 100);
  });

  row.append(input, button);

  return row;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const title = String(data.get('title')).trim();
  const ingredients = parseList(String(data.get('ingredients')), ',');
  const steps = parseList(String(data.get('steps')), ';');

  setTimeout(() => {
    recipes.push(new Recipe(title, ingredients, steps));
    saveRecipes();
    renderRecipes();
    form.reset();
  }, 100);
});

renderRecipes();
