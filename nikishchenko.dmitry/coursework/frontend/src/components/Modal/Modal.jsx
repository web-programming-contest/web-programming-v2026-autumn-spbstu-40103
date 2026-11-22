import {useEffect, useRef} from 'react';
import {createPortal} from 'react-dom';
import {CloseIcon} from '../../icons';
import styles from './Modal.module.css';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Общее модальное окно: закрывается по ✕, клавише Esc и клику на подложку.
 * Пока окно открыто: прокрутка страницы заблокирована, Tab ходит только внутри окна,
 * а после закрытия фокус возвращается на прежний элемент.
 */
// width и padding нужны широким окнам (карточка товара); по умолчанию окно 556px с отступами 56px
export default function Modal({onClose, label, width, padding, children}) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose; // эффект не перезапускается, когда родитель передаёт новую функцию

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const dialog = dialogRef.current;
    dialog.focus();

    // Блокируем прокрутку. Если на странице была полоса прокрутки, резервируем под неё место,
    // чтобы контент не «прыгал» вправо; если полосы не было, ничего не резервируем.
    const html = document.documentElement;
    const hadScrollbar = window.innerWidth > html.clientWidth;
    const prevOverflow = html.style.overflow;
    const prevGutter = html.style.scrollbarGutter;
    html.style.overflow = 'hidden';
    if (hadScrollbar) {
      html.style.scrollbarGutter = 'stable';
    }

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') {
        return;
      }
      const nodes = [...dialog.querySelectorAll(FOCUSABLE)];
      if (nodes.length === 0) {
        e.preventDefault();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (
        e.shiftKey &&
        (document.activeElement === first || document.activeElement === dialog)
      ) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    // Если фокус каким-то образом оказался вне окна (например, на body), возвращаем его внутрь
    function onFocusIn(e) {
      if (!dialog.contains(e.target)) {
        dialog.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('focusin', onFocusIn);
      html.style.overflow = prevOverflow;
      html.style.scrollbarGutter = prevGutter;
      previouslyFocused?.focus?.();
    };
  }, []);

  // mousedown, а не click: выделение текста, закончившееся за пределами окна, его не закроет
  function handleOverlayMouseDown(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return createPortal(
    <div className={styles.overlay} onMouseDown={handleOverlayMouseDown}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        style={{width, padding}}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
      >
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Закрыть"
        >
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}

// Типовое содержимое: крупный текст и ряд кнопок справа (как в окнах макета)
export function ModalMessage({children}) {
  return <p className={styles.message}>{children}</p>;
}

export function ModalActions({children}) {
  return <div className={styles.actions}>{children}</div>;
}
