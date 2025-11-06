import React, { Fragment, useState } from 'react'
import { Modal } from 'react-bootstrap'
import SweetAlert from '../../lib/sweetalert'
import './DeleteSub.scss'

const DeleteSubCate = ({ children, id, allCategory }) => {
  const [openModal, setOpenModal] = useState(false)

  const handleSubCategoryDelete = () => {
    setOpenModal(false)

    fetch(
      process.env.REACT_APP_BACKEND_URL + `/api/admin/subcategory/delete/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          allCategory()
          SweetAlert.success(
            'Subcategory!',
            'Subcategory Deleted Successfully!'
          )
        }
      })
      .catch((err) => {
        SweetAlert.failed(
          'warning!',
          err.message,
          'Subcategory Deleted Failed!'
        )
      })
  }
  return (
    <Fragment>
      {children &&
        React.cloneElement(children, { onClick: () => setOpenModal(true) })}
      <Modal show={openModal} onHide={() => setOpenModal(false)}>
        <Modal.Body>
          <h5 style={{ fontWeight: 'bold' }}>Are You Sure?</h5>
          <h6 className=''>You’re about to Delete a Sub-Category</h6>
        </Modal.Body>
        <div className='d-flex justify-content-end m-2'>
          <button
            className='cancel-btn mr-1'
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </button>
          <button className='save-btn' onClick={handleSubCategoryDelete}>
            Delete
          </button>
        </div>
      </Modal>
    </Fragment>
  )
}

export default DeleteSubCate
