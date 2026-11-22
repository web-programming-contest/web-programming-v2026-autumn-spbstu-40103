# Курсовая работа

Интернет-магазин гаджетов (учебный проект по дисциплине «Web-разработка»).

- **Фронтенд:** React 18 + Vite + React Router, CSS Modules. Порт **5173**.
- **Бэкенд:** Python + FastAPI. Данные лежат в JSON-файлах (базы данных нет).
  Порт **8000**.
- Корзина хранится в `localStorage` браузера, фильтры, сортировка и пагинация
  работают на фронтенде.

Подробное соответствие заданию и сценарий приёмки:
[`docs/ПРИЕМКА.md`](docs/ПРИЕМКА.md).

---

## Что нужно установить заранее

| Что     | Версия | Как проверить       | Если нет (Ubuntu / WSL)                                                                                                                    |
| ------- | ------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Python  | 3.10+  | `python3 --version` | `sudo apt update && sudo apt install -y python3 python3-venv python3-pip`                                                                  |
| Node.js | 18+    | `node -v`           | через nvm: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh \| bash`, перезапустить терминал, `nvm install --lts` |

## Запуск (нужны два терминала)

**Терминал 1: бэкенд**

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

**Терминал 2: фронтенд**

```bash
cd frontend
npm install
npm run dev
```

Откройте в браузере **http://localhost:5173**

- Логин: `admin`, пароль: `gadget2024`
- Swagger бэкенда (проверка API без фронтенда): http://localhost:8000/docs

При следующих запусках `venv` и `npm install` повторять не нужно: достаточно
`source .venv/bin/activate` и обеих команд запуска.

## Проверка

```bash
python -m pytest -q

npm test
npm run build
npm run preview
```

Ручной сценарий приёмки из ТЗ (10 шагов) описан в
[`docs/ПРИЕМКА.md`](docs/ПРИЕМКА.md).

---

## Структура проекта

```
gadget-hub/
├── backend/
│   ├── main.py             # FastAPI: CORS, сессии (HttpOnly cookie), эндпоинты
│   ├── storage.py          # асинхронное чтение/запись JSON (aiofiles, атомарная запись, блокировка)
│   ├── security.py         # хеширование пароля (PBKDF2)
│   ├── generate_data.py    # генератор goods.json, users.json, orders.json
│   ├── data/               # goods.json (41 товар), users.json, orders.json
│   └── tests/test_api.py
├── frontend/
│   ├── public/             # шрифт Rubik, фото товаров, иконки, баннер, иллюстрации
│   └── src/
│       ├── api/            # client.js: все запросы к бэкенду
│       ├── context/        # AuthContext (кто вошёл), CartContext + cartReducer (корзина и localStorage)
│       ├── catalog/        # catalogLogic.js: фильтры, сортировка, пагинация (чистые функции)
│       ├── cart/           # cartLogic.js, orderValidation.js: логика корзины и проверка формы заказа
│       ├── hooks/          # useGoods, useCatalog, useOrders, usePageTitle
│       ├── components/     # Header, Footer, Layout, ProtectedRoute, Modal, Button, TextField, Select,
│       │                   # Checkbox, RadioGroup, RangeSlider, Tabs, Carousel, ProductCard, Filters,
│       │                   # Pagination, CartItem, OrderForm, ...
│       ├── pages/          # Home, Login, Catalog, Cart, NotFound
│       ├── utils/          # форматирование цены, рейтинга, дат, склонений
│       └── styles/         # variables.css (цвета и размеры из UI-кита), fonts.css, global.css
└── docs/ПРИЕМКА.md
```

## API

| Метод | Путь      | Доступ | Назначение                                                                       |
| ----- | --------- | ------ | -------------------------------------------------------------------------------- |
| POST  | `/login`  | все    | `{login, password}`. Успех: cookie `session` (HttpOnly). 401 при неверных данных |
| POST  | `/logout` | все    | Завершает сессию                                                                 |
| GET   | `/me`     | вход   | Кто сейчас вошёл (401, если никто). Нужен фронтенду после перезагрузки страницы  |
| GET   | `/goods`  | все    | Все товары (41). Открыт всем: хиты и новинки видны на главной без входа          |
| GET   | `/orders` | вход   | Заказы пользователя, новые первыми                                               |
| POST  | `/orders` | вход   | Создаёт заказ. Цены и сумму бэкенд считает сам по каталогу                       |

Тело `POST /orders`:

```json
{
  "items": [{"goodId": 1, "qty": 2}],
  "email": "a@b.ru",
  "phone": "+7 999 123-45-67",
  "delivery": "pickup",
  "address": null,
  "payment": "card",
  "packaging": true
}
```

`email` обязателен, `phone` нет (если указан, то не меньше 10 цифр), `address`
обязателен при `delivery: "delivery"`. `delivery`: `pickup | delivery`;
`payment`: `card | cash`; `qty` от 1 до 99.

## Данные (`backend/data/`)

- `goods.json` создаёт `generate_data.py`: товары 1–32 из выданного архива
  (названия и картинки), 33–41 из макета. Цены, рейтинги, описания,
  характеристики, популярность и даты у архивных товаров придуманы (значения
  фиксированы, поэтому файл при пересоздании не меняется).
- Типы и цвета хранятся готовыми русскими названиями, фильтры на фронтенде
  строятся из данных.
- `users.json`: один пользователь, пароль хранится в виде PBKDF2-хеша.
- `orders.json`: три стартовых заказа из макета и все новые.

`python generate_data.py` обновляет только `goods.json`; `--reset` пересоздаёт и
пользователя, и заказы.

## Как устроено главное

- **Авторизация.** `POST /login` проверяет хеш пароля и ставит HttpOnly-cookie.
  Закрытые эндпоинты без сессии отвечают 401, а `ProtectedRoute` на фронтенде
  перенаправляет гостя на `/login`. После перезагрузки страницы `AuthContext`
  спрашивает `/me`.
- **Корзина.** Состояние `{id товара: количество}` лежит в `localStorage` под
  ключом `cart:<логин>`. После заказа ключ удаляется. Лимит количества 99
  совпадает с лимитом бэкенда. Чистая логика (`cartReducer.js`, `cartLogic.js`)
  покрыта тестами.
- **Каталог.** Все товары приходят одним запросом, дальше цепочка «фильтр →
  сортировка → страница» работает на фронтенде. Фильтры хранятся в двух
  экземплярах: «черновик» (то, что человек двигает в форме) и «применённые»
  (после кнопки «Показать»).
- **Заказ.** В заказ уходят выбранные товары. После успешного оформления они
  исчезают из корзины, невыбранные остаются. Обязательны: e-mail, способ оплаты
  и адрес (только при доставке). Телефон необязателен.
- **Карусели.** Своя реализация без библиотек: видны 3 карточки, список
  зациклен, стрелки сдвигают на одну (`carouselUtils.js`).
