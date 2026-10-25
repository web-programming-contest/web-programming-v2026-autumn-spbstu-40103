import {useState} from 'react';
import BookCard from './BookCard.jsx';
import BookModal from './BookModal.jsx';
import {books} from './books.js';

function App() {
  const [selectedBook, setSelectedBook] = useState(null);

  return (
    <div className="shop">
      <header className="shop-header">
        <h1 className="shop-title">Книжный магазин</h1>
        <p className="shop-subtitle">
          Выберите книгу, чтобы увидеть описание, автора и цену.
        </p>
      </header>

      <section className="shop-grid" aria-label="Каталог книг">
        {books.map((book) => (
          <BookCard key={book.id} book={book} onSelect={setSelectedBook} />
        ))}
      </section>

      <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
    </div>
  );
}

export default App;
