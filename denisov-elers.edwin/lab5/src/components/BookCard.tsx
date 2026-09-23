import {Rating} from './Rating';

export type Book = {
  id: number;
  title: string;
  description: string;
  price: number;
  cover: string;
  ratingSum: number;
  ratingCount: number;
};

type BookCardProps = {
  book: Book;
  onRate: (bookId: number, rating: number) => void;
};

export function BookCard({book, onRate}: BookCardProps) {
  return (
    <article className="book-card" data-testid="book-card">
      <img
        className="book-card-cover"
        src={book.cover}
        alt={`Обложка книги ${book.title}`}
      />
      <div className="book-card-content">
        <h2 className="book-card-title">{book.title}</h2>
        <Rating
          ratingSum={book.ratingSum}
          ratingCount={book.ratingCount}
          onRate={(rating) => onRate(book.id, rating)}
        />
        <p className="book-card-description">{book.description}</p>
        <strong className="book-card-price">
          {book.price.toFixed(2)} руб.
        </strong>
      </div>
    </article>
  );
}
