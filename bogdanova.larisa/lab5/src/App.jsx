import {useCallback, useState} from 'react';
import {books} from './books.js';
import {BookCard} from './components/BookCard.jsx';
import {BookModal} from './components/BookModal.jsx';

export function App() {
  const [selectedBook, setSelectedBook] = useState(null);

  const handleClose = useCallback(() => setSelectedBook(null), []);

  return (
    <>
      <h1 className="page-title">Магазин книг</h1>
      <ul className="book-list" data-testid="book-list">
        {books.map((book) => (
          <BookCard key={book.id} book={book} onOpen={setSelectedBook} />
        ))}
      </ul>
      <BookModal book={selectedBook} onClose={handleClose} />
    </>
  );
}
