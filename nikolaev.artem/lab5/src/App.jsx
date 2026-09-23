import React, {useEffect, useState} from 'react';
import {BOOKS} from './books.js';
import {BookCard} from './BookCard.jsx';
import {FavoritesPanel} from './FavoritesPanel.jsx';

const STORAGE_KEY = 'lab5-favorite-book-ids';

function loadFavoriteIds() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function App() {
  const [favoriteIds, setFavoriteIds] = useState(loadFavoriteIds);
  const [isPanelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  function toggleFavorite(bookId) {
    setFavoriteIds((current) =>
      current.includes(bookId)
        ? current.filter((id) => id !== bookId)
        : [...current, bookId],
    );
  }

  function removeFavorite(bookId) {
    setFavoriteIds((current) => current.filter((id) => id !== bookId));
  }

  const favoriteBooks = BOOKS.filter((book) => favoriteIds.includes(book.id));

  return (
    <div className="app">
      <header className="app-header">
        <h1>Книжный магазин</h1>
        <button
          type="button"
          className="app-favorites-toggle"
          data-testid="favorites-count"
          onClick={() => setPanelOpen((open) => !open)}
        >
          ★ Избранное ({favoriteBooks.length})
        </button>
      </header>

      <section className="book-list">
        {BOOKS.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            isFavorite={favoriteIds.includes(book.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </section>

      <FavoritesPanel
        books={favoriteBooks}
        isOpen={isPanelOpen}
        onClose={() => setPanelOpen(false)}
        onRemove={removeFavorite}
      />
    </div>
  );
}

export {App};
