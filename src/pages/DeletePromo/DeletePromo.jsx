import React, { Fragment, useState } from 'react'
import { Modal } from 'react-bootstrap'
import SweetAlert from '../../lib/sweetalert'
import './DeletePromo.scss'
const DeletePromo = ({ children, id, allCouponCode }) => {
  const [openModal, setOpenModal] = useState(false)

  const handleCouponDelete = () => {
    setOpenModal(false)
    fetch(process.env.REACT_APP_BACKEND_URL + `/api/delete/coupon/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          allCouponCode()
          SweetAlert.success('Promo!', 'Promo Deleted Successfully!')
        }
      })
      .catch((err) => {
        SweetAlert.failed('warning!', err.message, 'Promo Deleted Failed!')
      })
  }
  return (
    <Fragment>
      {children &&
        React.cloneElement(children, { onClick: () => setOpenModal(true) })}
      <Modal show={openModal} onHide={() => setOpenModal(false)}>
        <Modal.Body>
          <h3 style={{ fontWeight: 'bold' }}>Are You Sure?</h3>
          <h4 className=''>You’re about to Delete a Promo</h4>
        </Modal.Body>
        <Modal.Footer>
          <button className='cancel-btn' onClick={() => setOpenModal(false)}>
            Cancel
          </button>
          <button className='save-btn' onClick={handleCouponDelete}>
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  )
}

export default DeletePromo
