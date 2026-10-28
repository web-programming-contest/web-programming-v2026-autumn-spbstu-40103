import {useEffect} from 'react'
import {createPortal} from 'react-dom'
import {CloseIcon} from './Icons'
import './Modal.css'

export default function Modal({children, onClose, width = 556, className = ''}) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return createPortal(
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${className}`} style={{width}} role="dialog" aria-modal="true">
        <button type="button" className="modal__close" onClick={onClose} aria-label="Закрыть">
          <CloseIcon size={20} />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
}
