import {useEffect, useRef} from 'react';

export function BookModal({book, onClose}) {
  const closeButtonRef = useRef(null);
  const isOpen = book !== null;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.classList.add('no-scroll');
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      data-testid="book-modal"
      role="dialog"
      aria-modal="true"
      aria-label={
        book ? `Информация о книге «${book.title}»` : 'Информация о книге'
      }
      hidden={!isOpen}
      onClick={handleOverlayClick}
    >
      <div className="modal-window">
        <button
          ref={closeButtonRef}
          type="button"
          className="modal-close"
          data-testid="modal-close"
          aria-label="Закрыть"
          hidden={!isOpen}
          onClick={onClose}
        >
          ×
        </button>
        {book && (
          <div className="modal-content">
            <img
              className="modal-cover"
              src={book.cover}
              alt={`Обложка книги «${book.title}»`}
            />
            <div className="modal-info">
              <h2 className="modal-title">{book.title}</h2>
              <p className="modal-author">{book.author}</p>
              <ul className="modal-meta">
                <li>Год: {book.year}</li>
                <li>Жанр: {book.genre}</li>
                <li>Страниц: {book.pages}</li>
              </ul>
              <p className="modal-description">{book.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
