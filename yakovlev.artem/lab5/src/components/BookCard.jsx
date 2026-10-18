export default function BookCard({book, onOpen}) {
  return (
    <button
      className="book-card"
      type="button"
      data-testid="book-card"
      onClick={() => onOpen(book)}
    >
      <img
        className="book-cover"
        src={book.cover}
        alt={`Обложка книги «${book.title}»`}
        width="300"
        height="420"
      />
      <span className="book-title" data-testid="book-title">
        {book.title}
      </span>
    </button>
  );
}
