import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import ModalOverlay from '../modal-overlay/modal-overlay';

import styles from './modal.module.css';

type ModalProps = {
  children: React.ReactNode;
  header: string | null;
  onClose: () => void;
};

function Modal({ children, header, onClose }: ModalProps): React.JSX.Element | null {
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleEscapeKey);

    return (): void => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

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
          <CloseIcon type="primary" className={styles.close_btn} onClick={onClose} />
        </div>
        {children}
      </div>
    </>,
    modalRoot
  );
}

export default Modal;
