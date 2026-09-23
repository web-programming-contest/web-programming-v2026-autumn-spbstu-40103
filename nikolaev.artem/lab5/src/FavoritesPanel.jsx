import React from 'react';

function FavoritesPanel({books, isOpen, onClose, onRemove}) {
  return (
    <aside
      className={
        isOpen ? 'favorites-panel favorites-panel-open' : 'favorites-panel'
      }
      data-testid="favorites-list"
    >
      <div className="favorites-panel-header">
        <h2>Избранное</h2>
        <button
          type="button"
          className="favorites-panel-close"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      {books.length === 0 ? (
        <p className="favorites-panel-empty">Список избранного пуст.</p>
      ) : (
        <ul className="favorites-panel-list">
          {books.map((book) => (
            <li
              className="favorite-item"
              data-testid="favorite-item"
              key={book.id}
            >
              <img
                className="favorite-item-cover"
                src={book.cover}
                alt={book.title}
              />
              <div className="favorite-item-info">
                <p className="favorite-item-title">{book.title}</p>
                <p className="favorite-item-price">{book.price} ₽</p>
              </div>
              <button
                type="button"
                className="favorite-item-remove"
                onClick={() => onRemove(book.id)}
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

export {FavoritesPanel};
