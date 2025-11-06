import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { Form, Modal, Spinner } from 'react-bootstrap'
import SweetAlert from '../../lib/sweetalert'
import './EditCategory.scss'

const EditCategory = ({ children, allCategory, cat }) => {
  const [editModal, setEditModal] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [spinner, setSpinner] = useState(false)
  const [photo, setPhoto] = useState('')
  const [photoSpinner, setPhotoSpinner] = useState(false)
  useEffect(() => {
    setName(cat?.name)
    setDescription(cat?.description)
    setPhoto(cat?.icon)
  }, [])

  const handleCategoryUpdate = (e) => {
    setSpinner(true)
    e.preventDefault()

    if (name === '') {
      setSpinner(false)
      SweetAlert.failed('Error', 'Name must be provided')
      return
    }
    if (description === '') {
      setSpinner(false)
      SweetAlert.failed('Error', 'Description must be provided')
      return
    }

    const updateData = {
      id: cat._id,
      name: name,
      description: description,
      icon: photo,
    }

    fetch(process.env.REACT_APP_BACKEND_URL + `/category/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        teezarat: `${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(updateData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === 'yes') {
          allCategory()
          SweetAlert.success('Success', 'Category updated SuccessFully')
        } else {
          SweetAlert.failed('Error', 'Category update Failed')
        }
        setSpinner(false)
        setEditModal(false)
      })
      .catch((err) => {
        setSpinner(false)
        setEditModal(false)
        SweetAlert.failed('Error', 'Category updated Failed')
      })
  }

  // Delete category
  const [openModal, setOpenModal] = useState(false)
  const [deleteSpinner, setDeleteSpinner] = useState(false)

  const handleCategoryDelete = () => {
    setDeleteSpinner(true)
    fetch(
      process.env.REACT_APP_BACKEND_URL + `/category/delete?_id=${cat._id}`,
      {
        method: 'DELETE',
        headers: {
          teezarat: `${localStorage.getItem('token')}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success === 'yes') {
          allCategory()
          SweetAlert.success('category!', 'category Deleted Successfully!')
          setOpenModal(false)
          setDeleteSpinner(false)
        } else {
          setOpenModal(false)
          setDeleteSpinner(false)
          SweetAlert.failed('warning!', data.msg)
        }
      })
      .catch((err) => {
        setOpenModal(false)
        setDeleteSpinner(false)
        SweetAlert.failed('warning!', err.data.msg)
      })
  }

  const handleImageUpload = async (e) => {
    setPhotoSpinner(true)

    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('photo', file)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          teezarat: `${localStorage.getItem('token')}`,
        },
      }

      const { data } = await axios.post(
        process.env.REACT_APP_BACKEND_URL + '/file/upload',
        formData,
        config
      )
      setPhoto(data.path)
      setPhotoSpinner(false)
    } catch (error) {
      // console.error(error)
      setPhotoSpinner(false)

      SweetAlert.failed('Photo upload Failed!', error.message)
    }
  }

  return (
    <Fragment>
      {children &&
        React.cloneElement(children, { onClick: () => setEditModal(true) })}

      <Modal show={editModal} onHide={() => setEditModal(false)}>
        <Modal.Header
          style={{
            fontWeight: 'bold',
            fontSize: '1.5rem',
          }}
        >
          Edit Category
        </Modal.Header>
        <Modal.Body>
          <div className='d-flex justify-content-start align-items-end mb-3'>
            <img
              src={photo || '/assets/img-upload.png'}
              alt=''
              width='80px'
              height='80px'
            />
            <Form className='ml-3 '>
              <Form.Group controlId='productPhoto' style={{ margin: '0' }}>
                <Form.Label className='d-flex justify-content-start align-items-center'>
                  Product Photo{' '}
                  {photoSpinner && (
                    <Spinner
                      animation='border'
                      role='status'
                      size='sm'
                      className='ml-2'
                    />
                  )}
                </Form.Label>
                <Form.Control type='file' onChange={handleImageUpload} />
              </Form.Group>
            </Form>
          </div>

          <Form.Group className='product-col' controlId='formGridProduct'>
            <Form.Label style={{ fontWeight: 'bold' }}>
              Category Name
            </Form.Label>
            <Form.Control
              type='text'
              className='input-product'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='ControlTextarea1'>
            <Form.Label style={{ fontWeight: 'bold' }}> Description</Form.Label>
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
          {/* <DeleteCategory
            id={category._id}
            allCategory={allCategory}
            
          > */}
          <button
            className='delete-btn'
            style={{ paddingX: '5px' }}
            onClick={() => {
              setEditModal(false)
              setOpenModal(true)
            }}
          >
            Delete Category
          </button>
          {/* </DeleteCategory> */}
          <button className='cancel-btn' onClick={() => setEditModal(false)}>
            Close
          </button>
          <button
            className='save-btn d-flex align-items-center'
            onClick={handleCategoryUpdate}
          >
            Save Changes{' '}
            {spinner && (
              <Spinner
                animation='border'
                role='status'
                size='sm'
                className='ml-1'
              />
            )}
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={openModal} onHide={() => setOpenModal(false)}>
        <Modal.Body>
          <h5 style={{ fontWeight: 'bold' }}>Are You Sure?</h5>
          <h6 className=''>You’re about to Delete a Category</h6>
        </Modal.Body>
        <div className='d-flex justify-content-end m-2'>
          <button
            className='cancel-btn mr-1'
            onClick={() => setDeleteSpinner(false)}
          >
            Cancel
          </button>
          <button
            className='save-btn d-flex align-items-center'
            onClick={handleCategoryDelete}
          >
            Delete{' '}
            {deleteSpinner && (
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

export default EditCategory
