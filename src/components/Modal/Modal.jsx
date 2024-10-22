import './Modal.module.css';

import { forwardRef } from 'react';
import { createPortal } from 'react-dom';

function Modal(props, ref) {
  const { headerMessage, bodyMessage } = props;

  return createPortal(
    <dialog ref={ref}>
      <h2>{headerMessage}</h2>
      <p>{bodyMessage}</p>
    </dialog>,
    document.getElementById('modal')
  );
}

export default forwardRef(Modal);
