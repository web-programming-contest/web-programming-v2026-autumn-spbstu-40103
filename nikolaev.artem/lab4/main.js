import {Travel} from './model.js';

const STORAGE_KEY = 'travels';
const ASYNC_DELAY_MS = 300;

const listElement = document.querySelector('[data-testid="entity-list"]');
const form = document.querySelector('[data-testid="entity-form"]');

let travels = loadTravels();
render();

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const id = Number(data.get('id'));
  const travelerName = String(data.get('travelerName')).trim();
  if (!travelerName) {
    return;
  }
  if (travels.some((travel) => travel.id === id)) {
    window.alert(`Путешествие с ID ${id} уже существует`);
    return;
  }

  addTravel(id, travelerName).then(() => form.reset());
});

function loadTravels() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return parsed.map(
      (item) => new Travel(item.id, item.travelerName, item.visitedCountries),
    );
  } catch {
    return [];
  }
}

function saveTravels() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(travels));
}

function addTravel(id, travelerName) {
  return new Promise((resolve) => {
    setTimeout(() => {
      travels.push(new Travel(id, travelerName, []));
      saveTravels();
      render();
      resolve();
    }, ASYNC_DELAY_MS);
  });
}

function deleteTravel(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      travels = travels.filter((travel) => travel.id !== id);
      saveTravels();
      render();
      resolve();
    }, ASYNC_DELAY_MS);
  });
}

function addCountry(id, country) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const travel = travels.find((item) => item.id === id);
      if (travel && country) {
        if (travel.visitedCountries.includes(country)) {
          window.alert(`Страна "${country}" уже добавлена в это путешествие`);
        } else {
          travel.addCountry(country);
          saveTravels();
          render();
        }
      }
      resolve();
    }, ASYNC_DELAY_MS);
  });
}

function removeCountry(id, country) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const travel = travels.find((item) => item.id === id);
      if (travel) {
        travel.removeCountry(country);
        saveTravels();
        render();
      }
      resolve();
    }, ASYNC_DELAY_MS);
  });
}

function render() {
  listElement.innerHTML = '';

  for (const travel of travels) {
    const card = document.createElement('li');
    card.dataset.testid = 'entity-card';
    card.className = 'travel-card';

    const heading = document.createElement('h3');
    heading.textContent = `${travel.travelerName} (ID: ${travel.id})`;
    card.append(heading);

    const countries = document.createElement('p');
    countries.textContent = `Страны: ${travel.visitedCountries.join(', ') || '—'}`;
    card.append(countries);

    const count = document.createElement('p');
    count.textContent = `Посещено стран: ${travel.visitedCount}`;
    card.append(count);

    const countryForm = document.createElement('form');
    countryForm.className = 'country-form';

    const countryInput = document.createElement('input');
    countryInput.type = 'text';
    countryInput.name = 'country';
    countryInput.placeholder = 'Название страны';
    countryInput.required = true;
    countryForm.append(countryInput);

    const addCountryButton = document.createElement('button');
    addCountryButton.type = 'submit';
    addCountryButton.textContent = 'Добавить страну';
    countryForm.append(addCountryButton);

    const removeCountryButton = document.createElement('button');
    removeCountryButton.type = 'button';
    removeCountryButton.textContent = 'Удалить страну';
    removeCountryButton.addEventListener('click', () => {
      const country = countryInput.value.trim();
      if (!country) {
        return;
      }
      if (!travel.visitedCountries.includes(country)) {
        window.alert(`Страна «${country}» не найдена у ${travel.travelerName}`);
        return;
      }
      void removeCountry(travel.id, country);
      countryInput.value = '';
    });
    countryForm.append(removeCountryButton);

    countryForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const country = countryInput.value.trim();
      if (!country) {
        return;
      }
      if (travel.visitedCountries.includes(country)) {
        window.alert(
          `Страна «${country}» уже добавлена для ${travel.travelerName}`,
        );
        return;
      }
      void addCountry(travel.id, country);
      countryInput.value = '';
    });

    card.append(countryForm);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.dataset.testid = 'delete-entity';
    deleteButton.textContent = 'Удалить путешествие';
    deleteButton.addEventListener('click', () => deleteTravel(travel.id));
    card.append(deleteButton);

    listElement.append(card);
  }
}
