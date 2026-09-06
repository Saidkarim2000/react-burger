import { createPortal } from 'react-dom';

import ModalOverlay from '../modal-overlay/modal-overlay';

import styles from './modal.module.css';

type ModalProps = {
  children: React.ReactNode;
  header: string;
  onClose: () => void;
};

function Modal({ children, header, onClose }: ModalProps): React.JSX.Element | null {
  const modalRoot = document.getElementById('modal');

  if (!modalRoot) {
    console.log('Не выставлен контейнер для модальных окон в index.html');
    return null;
  }

  return createPortal(
    <>
      <ModalOverlay onClose={onClose} />
      <div className={styles.modal}>
        <div className={styles.modal_header}>
          <h2>{header}</h2>
          <button type="button" onClick={onClose}>
            Закрыть
          </button>
        </div>
        {children}
      </div>
    </>,
    modalRoot
  );
}

export default Modal;
