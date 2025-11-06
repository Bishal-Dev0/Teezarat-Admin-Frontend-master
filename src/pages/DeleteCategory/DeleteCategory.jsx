import React, { Fragment, useState } from 'react'
import { Modal, Spinner } from 'react-bootstrap'
import SweetAlert from '../../lib/sweetalert'

import './DeleteCategory.scss'

// import useForceUpdate from 'use-force-update';
// import { useForceUpdate } from "react-custom-hook-use-force-update";
const DeleteCategory = ({ children, id, allCategory }) => {
  const [openModal, setOpenModal] = useState(false)
  const [spinner, setSpinner] = useState(false)

  const handleCategoryDelete = () => {
    setSpinner(true)
    fetch(process.env.REACT_APP_BACKEND_URL + `/category/delete?_id=${id}`, {
      method: 'DELETE',
      headers: {
        teezarat: `${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === 'yes') {
          allCategory()
          SweetAlert.success('category!', 'category Deleted Successfully!')
        } else {
          SweetAlert.failed(
            'warning!',
            data.message,
            'category Deleted Failed!'
          )
        }
        setOpenModal(false)
        setSpinner(false)
      })
      .catch((err) => {
        SweetAlert.failed('warning!', err.message, 'category Deleted Failed!')
      })
  }
  return (
    <Fragment>
      {children &&
        React.cloneElement(children, { onClick: () => setOpenModal(true) })}

      <Modal show={openModal} onHide={() => setOpenModal(false)}>
        <Modal.Body>
          <h5 style={{ fontWeight: 'bold' }}>Are You Sure?</h5>
          <h6 className=''>You’re about to Delete a Category</h6>
        </Modal.Body>
        <div className='d-flex justify-content-end m-2'>
          <button
            className='cancel-btn mr-1'
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </button>
          <button
            className='save-btn d-flex align-items-center'
            onClick={handleCategoryDelete}
          >
            Delete{' '}
            {spinner && (
              <Spinner
                animation='border'
                role='status'
                size='sm'
                className='ml-1'
              />
            )}
          </button>
        </div>
      </Modal>
    </Fragment>
  )
}

export default DeleteCategory
