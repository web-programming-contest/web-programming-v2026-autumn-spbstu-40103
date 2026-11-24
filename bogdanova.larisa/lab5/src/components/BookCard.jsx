export function BookCard({book, onOpen}) {
  return (
    <li className="book-item">
      <button
        type="button"
        className="book-card"
        data-testid="book-card"
        onClick={() => onOpen(book)}
      >
        <img
          className="book-card-cover"
          src={book.cover}
          alt={`Обложка книги «${book.title}»`}
        />
        <span className="book-card-title">{book.title}</span>
      </button>
    </li>
  );
}
