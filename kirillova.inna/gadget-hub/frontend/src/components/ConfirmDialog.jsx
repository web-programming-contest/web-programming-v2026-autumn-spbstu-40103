import {useEffect} from 'react';

function ConfirmDialog({isOpen, message, onConfirm, onCancel}) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onCancel();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  return (
    <div
      className={`modal-overlay ${isOpen ? 'modal-overlay--open' : ''}`}
      aria-hidden={!isOpen}
    >
      <div className="confirm-dialog" role="dialog" aria-modal="true">
        <button
          type="button"
          className="confirm-dialog__close"
          onClick={onCancel}
          aria-label="Закрыть"
        >
          ×
        </button>
        <p className="confirm-dialog__message">{message}</p>
        <div className="confirm-dialog__actions">
          <button
            type="button"
            className="button button--link"
            onClick={onCancel}
          >
            Отмена
          </button>
          <button
            type="button"
            className="button button--primary"
            onClick={onConfirm}
          >
            Да, удалить
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
