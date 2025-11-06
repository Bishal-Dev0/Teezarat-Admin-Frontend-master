import React, { Fragment, useEffect, useState } from 'react'
import { Form, Modal } from 'react-bootstrap'
import SweetAlert from '../../lib/sweetalert'
import './AddNewSubCategory.scss'

const AddNewSubCat = ({ children, subCate, allCategory }) => {
  const [openModal, setOpenModal] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const [cate, setCate] = useState([])

  useEffect(() => {
    allSubCategory()
    allCategory()
  }, [])

  const allSubCategory = () => {
    fetch(process.env.REACT_APP_BACKEND_URL + '/api/allSubCategories')
      .then((res) => res.json())
      .then((data) => {
        setCate(data)
      })
      .catch((err) => {})
  }

  const handleSubCategoryCreate = (e) => {
    setOpenModal(false)
    e.preventDefault()
    if (name === '' || description === '')
      return SweetAlert.failed('Error', 'Please fill up all required field')
    fetch(process.env.REACT_APP_BACKEND_URL + '/api/admin/subcategory/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        category: subCate._id,
        name,
        description,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          allCategory()
          allSubCategory()
          setDescription('')
          setName('')
          SweetAlert.success('Success', 'SubCategory Create SuccessFully')
        } else {
          SweetAlert.failed(data.error, 'SubCategory Already Exist')
        }
      })
      .catch((err) => {
        SweetAlert.failed('Warning', 'SubCategory Already Exist')

        setDescription('')
        setName('')
      })
  }

  return (
    <Fragment>
      {children &&
        React.cloneElement(children, { onClick: () => setOpenModal(true) })}
      <Modal show={openModal} onHide={() => setOpenModal(false)} centered>
        <Modal.Header>
          <h6 style={{ fontWeight: 'bold' }}>Add New Sub-Category</h6>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId='formGridProduct'>
            <Form.Label>Sub-Category Name</Form.Label>
            <Form.Control
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='ControlTextarea1'>
            <Form.Label> Description</Form.Label>
            <Form.Control
              as='textarea'
              className='areaText'
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <button className='cancel-btn' onClick={() => setOpenModal(false)}>
            Cancel
          </button>
          <button className='save-btn' onClick={handleSubCategoryCreate}>
            Create
          </button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  )
}

export default AddNewSubCat
