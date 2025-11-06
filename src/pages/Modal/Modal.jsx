import React, { useEffect } from 'react'
import './Modal.scss'

const Modal = ({ open, close, children, hideCrossIcon, width }) => {
  useEffect(() => {
    if (open) {
      document.querySelector('body').style.overflow = 'hidden'
    } else {
      document.querySelector('body').style.overflow = 'unset'
    }
  }, [open])

  return !open ? null : (
    <div className='modal__overlay' onClick={close}>
      <div
        className='model'
        style={{ width: width + 'px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {!hideCrossIcon && (
          <div className='model__header'>
            <img src='/assets/app/modal-cross.png' alt='' onClick={close} />
          </div>
        )}
        <div className='modal__body'>{children}</div>
      </div>
    </div>
  )
}

export default Modal
