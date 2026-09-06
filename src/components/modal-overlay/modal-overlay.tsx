import styles from './modal-overlay.module.css';

type ModalOverlayProps = {
  onClose: () => void;
};

function ModalOverlay({ onClose }: ModalOverlayProps): React.JSX.Element {
  return <div className={styles.modal_overlay} onClick={onClose} />;
}

export default ModalOverlay;
