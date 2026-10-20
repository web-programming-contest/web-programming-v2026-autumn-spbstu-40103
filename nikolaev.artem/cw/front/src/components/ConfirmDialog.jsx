import Modal from './Modal'
import './ConfirmDialog.css'

export default function ConfirmDialog({message, onConfirm, onCancel}) {
  return (
    <Modal onClose={onCancel} width={556}>
      <div className="confirm">
        <p className="confirm__message">{message}</p>
        <div className="confirm__actions">
          <button type="button" className="confirm__cancel" onClick={onCancel}>
            Отмена
          </button>
          <button type="button" className="btn btn--primary" onClick={onConfirm}>
            Да, удалить
          </button>
        </div>
      </div>
    </Modal>
  )
}
