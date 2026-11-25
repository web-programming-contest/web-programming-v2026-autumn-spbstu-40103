import {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

const books = [
  {id: 1, title: 'Мастер и Маргарита', author: 'Михаил Булгаков', price: 450},
  {id: 2,title: 'Преступление и наказание', author: 'Фёдор Достоевский',price: 520},
  {id: 3, title: 'Война и мир', author: 'Лев Толстой', price: 690},
  {id: 4, title: 'Анна Каренина', author: 'Лев Толстой', price: 540},
];

const storageKey = 'cart';

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

function App() {
  const [cart, setCart] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart]);

  function addToCart(book) {
    setCart((items) => {
      const existing = items.find((item) => item.id === book.id);

      if (existing) {
        return items.map((item) =>
          item.id === book.id ? {...item, count: item.count + 1} : item,
        );
      }

      return [...items, {...book, count: 1}];
    });
  }

  function increase(id) {
    setCart((items) =>
      items.map((item) =>
        item.id === id ? {...item, count: item.count + 1} : item,
      ),
    );
  }

  function removeItem(id) {
    setCart((items) => items.filter((item) => item.id !== id));
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.count, 0);

  return (
    <main className="page" data-testid="app">
      <h1 className="title">Книжный магазин</h1>

      <section className="books">
        {books.map((book) => (
          <div className="book-card" data-testid="book-card" key={book.id}>
            <h2 className="book-title">{book.title}</h2>
            <p className="book-author">{book.author}</p>
            <p className="book-price">{book.price} ₽</p>
            <button
              className="button"
              type="button"
              data-testid="cart-add"
              onClick={() => addToCart(book)}
            >
              Добавить в корзину
            </button>
          </div>
        ))}
      </section>

      <hr className="divider" />

      <section className="cart">
        <h2 className="section-title">Корзина</h2>
        <ul className="cart-list" data-testid="cart-list">
          {cart.map((item) => (
            <li className="cart-item" data-testid="cart-item" key={item.id}>
              <span className="cart-name">{item.title}</span>
              <span className="cart-count">{item.count} шт.</span>
              <span className="cart-price">{item.price * item.count} ₽</span>
              <button
                className="button button-small"
                type="button"
                onClick={() => increase(item.id)}
              >
                +1
              </button>
              <button
                className="button button-danger"
                type="button"
                onClick={() => removeItem(item.id)}
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
        <p className="cart-total" data-testid="cart-total">
          Итого: {total} ₽
        </p>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
