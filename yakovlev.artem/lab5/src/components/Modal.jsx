import {useEffect, useId, useRef} from 'react';

export default function Modal({book, onClose}) {
  const titleId = useId();
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!book) {
      return undefined;
    }

    const previouslyFocused = document.activeElement;

    closeButtonRef.current.focus();
    document.body.classList.add('modal-open');

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('modal-open');
      previouslyFocused?.focus?.();
    };
  }, [book, onClose]);

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="modal-overlay"
      data-testid="modal-overlay"
      hidden={!book}
      onClick={handleOverlayClick}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-testid="book-modal"
      >
        <button
          className="modal-close"
          type="button"
          aria-label="Закрыть"
          data-testid="modal-close"
          ref={closeButtonRef}
          onClick={onClose}
        >
          ×
        </button>
        {book && (
          <>
            <img
              className="modal-cover"
              src={book.cover}
              alt={`Обложка книги «${book.title}»`}
              width="300"
              height="420"
            />
            <div className="modal-body">
              <h2
                className="modal-title"
                id={titleId}
                data-testid="modal-title"
              >
                {book.title}
              </h2>
              <p className="modal-meta" data-testid="modal-author">
                {book.author}, {book.year}
              </p>
              <p className="modal-description" data-testid="modal-description">
                {book.description}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
