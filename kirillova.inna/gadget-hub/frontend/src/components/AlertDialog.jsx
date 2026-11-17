import {useEffect} from 'react';

function AlertDialog({isOpen, message, onClose}) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      className={`modal-overlay ${isOpen ? 'modal-overlay--open' : ''}`}
      aria-hidden={!isOpen}
    >
      <div className="confirm-dialog" role="alertdialog" aria-modal="true">
        <button
          type="button"
          className="confirm-dialog__close"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>
        <p className="confirm-dialog__message">{message}</p>
        <div className="confirm-dialog__actions">
          <button
            type="button"
            className="button button--primary"
            onClick={onClose}
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertDialog;
