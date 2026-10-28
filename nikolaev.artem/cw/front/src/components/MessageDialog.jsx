import Modal from './Modal'
import './MessageDialog.css'

export default function MessageDialog({icon, title, children, onClose}) {
  return (
    <Modal onClose={onClose} width={556}>
      <div className="message">
        {icon && <img className="message__icon" src={icon} alt="" />}
        <h2 className="message__title">{title}</h2>
        <div className="message__text">{children}</div>
        <div className="message__actions">
          <button type="button" className="btn btn--primary" onClick={onClose} autoFocus>
            Ок
          </button>
        </div>
      </div>
    </Modal>
  )
}
