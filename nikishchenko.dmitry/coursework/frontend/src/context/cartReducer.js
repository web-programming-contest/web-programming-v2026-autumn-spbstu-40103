// Чистая логика корзины (без React), её легко проверять тестами.
// Состояние: { owner, items }, где items = { [goodId]: количество }.
// owner нужен, чтобы не записать корзину одного пользователя под ключом другого.

export const MAX_QTY = 99; // столько же принимает бэкенд

export const initialCartState = {owner: null, items: {}};

export function cartReducer(state, action) {
  const {items} = state;
  switch (action.type) {
    case 'load':
      return {owner: action.owner, items: action.items};
    case 'add':
      return {
        ...state,
        items: {
          ...items,
          [action.id]: Math.min((items[action.id] ?? 0) + 1, MAX_QTY),
        },
      };
    case 'setQty': {
      const qty = Math.floor(action.qty);
      if (!(qty > 0)) {
        return {...state, items: omit(items, [action.id])};
      } // 0 и меньше = удалить
      return {...state, items: {...items, [action.id]: Math.min(qty, MAX_QTY)}};
    }
    case 'remove':
      return {...state, items: omit(items, [action.id])};
    case 'removeMany':
      return {...state, items: omit(items, action.ids)};
    case 'clear':
      return {...state, items: {}};
    default:
      return state;
  }
}

function omit(items, ids) {
  const drop = new Set(ids.map(String));
  return Object.fromEntries(
    Object.entries(items).filter(([id]) => !drop.has(id)),
  );
}

// Общее число единиц товара (то, что показывает бейдж в шапке)
export function cartCount(items) {
  return Object.values(items).reduce((sum, qty) => sum + qty, 0);
}

// ---- localStorage ----
export const cartKey = (login) => `cart:${login}`;

// Читаем осторожно: данные в localStorage мог испортить кто угодно
export function readCart(login, storage = globalThis.localStorage) {
  try {
    const parsed = JSON.parse(storage.getItem(cartKey(login)));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }
    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([id, qty]) => /^\d+$/.test(id) && Number.isInteger(qty) && qty > 0,
      ),
    );
  } catch {
    return {};
  }
}

export function writeCart(login, items, storage = globalThis.localStorage) {
  try {
    if (Object.keys(items).length === 0) {
      storage.removeItem(cartKey(login));
    } else {
      storage.setItem(cartKey(login), JSON.stringify(items));
    }
  } catch {
    /* хранилище недоступно или переполнено, корзина останется только в памяти */
  }
}
