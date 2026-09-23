import React from 'react';

function BookCard({book, isFavorite, onToggleFavorite}) {
  return (
    <article className="book-card" data-testid="book-card">
      <img className="book-card-cover" src={book.cover} alt={book.title} />
      <div className="book-card-info">
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-rating">⭐ {book.rating.toFixed(1)}</p>
        <p className="book-card-description">{book.description}</p>
        <p className="book-card-price">{book.price} ₽</p>
        <button
          type="button"
          className={
            isFavorite
              ? 'book-card-favorite-button book-card-favorite-button-active'
              : 'book-card-favorite-button'
          }
          data-testid="favorite-add"
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(book.id)}
        >
          {isFavorite ? 'В избранном' : 'Добавить в избранное'}
        </button>
      </div>
    </article>
  );
}

export {BookCard};
