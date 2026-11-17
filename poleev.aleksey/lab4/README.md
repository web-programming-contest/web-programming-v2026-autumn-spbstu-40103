# Лабораторная работа 4

## Задание

Вариант `programmer` — «Программисты и языки».

### 4.1 Класс `Programmer`

Поля: `id` — уникальный числовой идентификатор, `name` — строка, `languages` —
массив строк (языки программирования).

Методы:

- `addLanguage(language)` — добавить язык, асинхронно через `Promise` +
  `setTimeout`;
- `removeLanguage(language)` — удалить язык, асинхронно через `Promise` +
  `setTimeout`;
- `languageCount` — геттер, возвращает количество языков.

### 4.2 Функции работы с коллекцией

Пять именованных экспортов:

- `groupProgrammersByLanguage(programmers)` — `Map` язык → массив программистов;
- `getUniqueLanguages(programmers)` — `Set` уникальных языков;
- `findProgrammersByLanguage(programmers, language)` — программисты, владеющие
  заданным языком;
- `groupProgrammersByLanguageCount(programmers)` — `Map` количество → массив
  программистов;
- `findTopPolyglots(programmers)` — программисты с максимальным количеством
  языков.

### 4.3 Пользовательский интерфейс

- Карточки программистов: имя, id, бейджи языков, количество языков.
- Форма добавления программиста (поля `id`, `name`).
- Модальное окно управления языками (добавление / удаление).
- Кнопка удаления программиста внутри карточки.
- Блоки группировок: по языкам, уникальные языки, по количеству, топ полиглотов.
- Все операции асинхронны через `Promise` + `setTimeout`.
- Состояние сохраняется в `localStorage`.

## Реализация

### Модель (`model.js`)

ES module с именованными экспортами. Класс `Programmer` хранит поля как обычные
свойства, `languageCount` — геттер. `addLanguage` / `removeLanguage` возвращают
`Promise`, внутри `setTimeout` с задержкой 300 мс. Проверка дубликата языка —
регистронезависимая.

Функции 4.2 не мутируют входной массив: только читают `programmer.languages` и
строят новые `Map` / `Set` / массивы.

Дополнительно экспортируются `addProgrammer` и `removeProgrammer` — асинхронные
операции над коллекцией для нужд UI.

### Интерфейс (`main.js`)

- Импортирует модель и функции группировок.
- `loadProgrammers()` / `saveProgrammers()` — сериализация в `localStorage` под
  ключом `programmers`.
- `renderCards()` — строит DOM карточек с `data-testid="entity-card"` и кнопкой
  `data-testid="delete-entity"`.
- `renderGroupings()` — вызывает функции модели и выводит результаты в таблицы и
  контейнеры.
- Форма `form[data-testid="entity-form"]` с полями `name="id"` и `name="name"`
  вызывает `addProgrammer` асинхронно.
- Модальное окно `#lang-modal` — добавление / удаление языка через методы
  экземпляра `Programmer`.

### Стили (`styles.css`)

Классы в kebab-case, без ID-селекторов и `!important`. Современные CSS- нотации
(`rgb()` с `/`, `inset`). Адаптивная сетка карточек.

## Запуск

Откройте `index.html` в браузере. Локальные проверки из корня репозитория:

```bash
npm run format -- poleev.aleksey/lab4
npm run format:check -- poleev.aleksey/lab4
npm run lint:js -- poleev.aleksey/lab4
npm run lint:css -- "poleev.aleksey/lab4/**/*.css"
npm run lint:html -- "poleev.aleksey/lab4/**/*.html"
```
