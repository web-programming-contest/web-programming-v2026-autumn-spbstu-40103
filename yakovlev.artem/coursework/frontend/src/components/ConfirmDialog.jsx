import {useEffect} from 'react';

export default function ConfirmDialog({text, onConfirm, onCancel}) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal confirm-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          aria-label="Закрыть"
          onClick={onCancel}
        >
          ✕
        </button>
        <p className="confirm-dialog-text">{text}</p>
        <div className="confirm-dialog-actions">
          <button
            type="button"
            className="btn btn-text-pink"
            onClick={onCancel}
          >
            Отмена
          </button>
          <button type="button" className="btn btn-blue" onClick={onConfirm}>
            Да, удалить
          </button>
        </div>
      </div>
    </div>
  );
}
