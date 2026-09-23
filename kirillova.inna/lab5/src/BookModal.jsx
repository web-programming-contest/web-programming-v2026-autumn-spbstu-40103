import {useEffect} from 'react';

function BookModal({book, onClose}) {
  const isOpen = book !== null;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape' || event.key === 'Esc') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  const displayedBook = book ?? {
    title: '',
    author: '',
    year: '',
    genre: '',
    description: '',
    price: '',
    cover: '',
  };

  return (
    <div
      className={`modal-overlay${isOpen ? ' modal-overlay-open' : ''}`}
      data-testid="book-modal"
      role="presentation"
      aria-hidden={!isOpen}
      onClick={handleOverlayClick}
    >
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          type="button"
          className="modal-dialog-close"
          data-testid="modal-close"
          aria-label="Закрыть"
          onClick={onClose}
        >
          X
        </button>
        <img
          className="modal-dialog-cover"
          src={displayedBook.cover}
          alt={`Обложка книги «${displayedBook.title}»`}
        />
        <div className="modal-dialog-body">
          <h2 id="modal-title" className="modal-dialog-title">
            {displayedBook.title}
          </h2>
          <p className="modal-dialog-meta">
            {displayedBook.author} · {displayedBook.year} ·{' '}
            {displayedBook.genre}
          </p>
          <p className="modal-dialog-description">
            {displayedBook.description}
          </p>
          <p className="modal-dialog-price">{displayedBook.price}</p>
        </div>
      </div>
    </div>
  );
}

export default BookModal;
