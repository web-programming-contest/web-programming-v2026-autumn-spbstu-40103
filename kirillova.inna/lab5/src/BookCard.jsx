function BookCard({book, onSelect}) {
  return (
    <button
      type="button"
      className="book-card"
      data-testid="book-card"
      onClick={() => onSelect(book)}
    >
      <img
        className="book-card-cover"
        src={book.cover}
        alt={`Обложка книги «${book.title}»`}
      />
      <span className="book-card-title">{book.title}</span>
      <span className="book-card-author">{book.author}</span>
    </button>
  );
}

export default BookCard;
