import {useState} from 'react';
import {BookCard, type Book} from './components/BookCard';

const initialBooks: Book[] = [
  {
    id: 1,
    title: 'Чистая архитектура',
    description: 'description description description description description',
    price: 1000,
    cover: '/covers/clean.png',
    ratingSum: 45,
    ratingCount: 10,
  },
  {
    id: 2,
    title: 'Собачье сердце',
    description: 'desc desc desc desc desc desc desc desc desc desc desc',
    price: 500,
    cover: '/covers/heart.png',
    ratingSum: 24,
    ratingCount: 5,
  },
  {
    id: 3,
    title: 'Игрок',
    description: 'ddddddd ddddddd ddddddd',
    price: 777,
    cover: '/covers/igrok.png',
    ratingSum: 44,
    ratingCount: 10,
  },
];

function App() {
  const [books, setBooks] = useState<Book[]>(initialBooks);

  const handleRate = (bookId: number, rating: number) => {
    setBooks((currentBooks) =>
      currentBooks.map((book) => {
        if (book.id !== bookId) {
          return book;
        }

        return {
          ...book,
          ratingSum: book.ratingSum + rating,
          ratingCount: book.ratingCount + 1,
        };
      }),
    );
  };

  return (
    <div className="page">
      <h1>Книжный магазин</h1>
      <div className="book-list">
        {books.map((book) => (
          <BookCard key={book.id} book={book} onRate={handleRate} />
        ))}
      </div>
    </div>
  );
}

export default App;
