import {useCallback, useState} from 'react';
import BookCard from './components/BookCard.jsx';
import Modal from './components/Modal.jsx';
import {books} from './data/books.js';

export default function App() {
  const [selectedBook, setSelectedBook] = useState(null);

  const closeModal = useCallback(() => setSelectedBook(null), []);

  return (
    <>
      <h1 className="page-title">Книжный магазин</h1>
      <ul className="book-list" data-testid="book-list">
        {books.map((book) => (
          <li className="book-item" key={book.id}>
            <BookCard book={book} onOpen={setSelectedBook} />
          </li>
        ))}
      </ul>
      <Modal book={selectedBook} onClose={closeModal} />
    </>
  );
}
