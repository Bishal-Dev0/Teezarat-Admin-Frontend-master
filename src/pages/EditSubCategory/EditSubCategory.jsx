import React, { Fragment, useEffect, useState } from 'react'
import { Form, Modal } from 'react-bootstrap'
import SweetAlert from '../../lib/sweetalert'
import DeleteSubCate from '../DeleteSubCate/DeleteSubCate'
import './EditSubCategory.scss'
const EditSubCategory = ({ children, cate, subcategory, allCategory }) => {
  const [openModal, setOpenModal] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    setName(subcategory.name)
    setDescription(subcategory.description)
  }, [subcategory])

  const handleSubCategoryUpdate = (e) => {
    setOpenModal(false)
    e.preventDefault()
    fetch(
      process.env.REACT_APP_BACKEND_URL +
        `/api/admin/subcategory/update/${subcategory._id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name,
          description,
          cateId: cate._id,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          allCategory()
          SweetAlert.success('Success', 'SubCategory updated SuccessFully')
        }
      })
      .catch((err) => {
        SweetAlert.failed('Error', 'SubCategory updated Failed')
      })
  }

  return (
    <Fragment>
      {children &&
        React.cloneElement(children, { onClick: () => setOpenModal(true) })}

      <Modal show={openModal} onHide={() => setOpenModal(false)} centered>
        <Modal.Header>
          <h6 style={{ fontWeight: 'bold' }}>Edit Sub-Category</h6>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId='formGridProduct'>
            <Form.Label>Sub Category Name</Form.Label>
            <Form.Control
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='ControlTextarea1'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as='textarea'
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <DeleteSubCate
            id={subcategory._id}
            allCategory={allCategory}
            onClick={() => setOpenModal(false)}
          >
            <button className='delete-btn'>Delete Category</button>
          </DeleteSubCate>
          <button className='cancel-btn' onClick={() => setOpenModal(false)}>
            Close
          </button>
          <button className='save-btn' onClick={handleSubCategoryUpdate}>
            Save Changes
          </button>
        </Modal.Footer>
      </Modal>
      {/* 
      <Modal
        width={630}
        hideCrossIcon
        open={openModal}
        close={() => setOpenModal(false)}
      >
        <div className='d-flex p-5'>
          <h3 className='ml-4 '>Edit Sub-Category</h3>
          <DeleteSubCate
            id={subcategory._id}
            allCategory={allCategory}
            onClick={() => setOpenModal(!openModal)}
          >
            <button
              className='ml-auto delete-btn'
              onClick={() => setOpenModal(!openModal)}
            >
              Delete
            </button>
          </DeleteSubCate>
        </div>
        <div className='product_model'>
          <Form.Group className='product-col' controlId='formGridProduct'>
            <Form.Label>Sub Category Name</Form.Label>
            <Form.Control
              type='text'
              className='input-product'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='ControlTextarea1'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as='textarea'
              className='areaText'
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <div
            className='btn-group-product'
            onClick={() => setOpenModal(!openModal)}
          >
            <div className='ml-auto'>
              <button className='cancel-btn'>Cancel</button>
              <button className='save-btn' onClick={handleSubCategoryUpdate}>
                Save
              </button>
            </div>
          </div>
        </div>
      </Modal> */}
    </Fragment>
  )
}

export default EditSubCategory
