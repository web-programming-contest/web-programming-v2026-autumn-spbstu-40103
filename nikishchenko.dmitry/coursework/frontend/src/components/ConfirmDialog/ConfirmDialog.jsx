import Button from '../Button/Button';
import LinkButton from '../LinkButton/LinkButton';
import Modal, {ModalActions, ModalMessage} from '../Modal/Modal';

// Окно подтверждения: «Отмена» (розовая ссылка) и «Да, …» (синяя кнопка)
export default function ConfirmDialog({
  text,
  confirmLabel = 'Да, удалить',
  onConfirm,
  onCancel,
}) {
  return (
    <Modal label="Подтверждение" onClose={onCancel}>
      <ModalMessage>{text}</ModalMessage>
      <ModalActions>
        <LinkButton medium onClick={onCancel}>
          Отмена
        </LinkButton>
        <Button onClick={onConfirm}>{confirmLabel}</Button>
      </ModalActions>
    </Modal>
  );
}
