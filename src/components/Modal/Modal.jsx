import styles from './Modal.module.css';

import { createPortal } from 'react-dom';

export default function Modal({ isOpened, headerMessage, bodyMessage }) {
  return createPortal(
    <div className={styles.overlay} style={{ display: !isOpened ? 'none' : 'block' }}>
      <div className={styles.modal}>
        <h2>{headerMessage}</h2>
        <p>{bodyMessage}</p>
      </div>
    </div>,
    document.getElementById('modal')
  );
}
