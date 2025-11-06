import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { Form, Modal, Spinner } from 'react-bootstrap'
import SweetAlert from '../../lib/sweetalert'
// import Modal from "../Modal";
import './AddNewCategory.scss'
const AddNewCategory = ({ children, parent, parentName, allCategory }) => {
  const [openModal, setOpenModal] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  // const [parent, setParent] = useState({})
  const [spinner, setSpinner] = useState(false)
  const [photo, setPhoto] = useState('')
  const [photoSpinner, setPhotoSpinner] = useState(false)

  useEffect(() => {
    // allCategory()
  }, [])

  const handleCategoryCreate = (e) => {
    setSpinner(true)
    e.preventDefault()

    if (name === '') {
      setSpinner(false)
      return SweetAlert.failed('Error', 'Category name must be provided!')
    }
    if (description === '') {
      setSpinner(false)
      return SweetAlert.failed('Error', 'Description must be provided!')
    }

    const newData = {
      parent_id: parent,
      name: name,
      description: description,
      icon: photo,
    }
    fetch(process.env.REACT_APP_BACKEND_URL + '/category/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        teezarat: `${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(newData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === 'yes') {
          allCategory()
          SweetAlert.success('Success!', `Category ${name} is created.`)
          setSpinner(false)
        } else {
          SweetAlert.failed('Warning', data.msg)
        }
        setDescription('')
        setName('')
        setSpinner(false)
        setOpenModal(false)
      })
      .catch((err) => {
        SweetAlert.failed('Warning', err.message || err.msg)
        setDescription('')
        setName('')
        setName('')
        setSpinner(false)
        setOpenModal(false)
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
        React.cloneElement(children, { onClick: () => setOpenModal(true) })}
      <Modal show={openModal} onHide={() => setOpenModal(false)} centered>
        <Modal.Header
          style={{
            fontWeight: 'bold',
            fontSize: '1.5rem',
          }}
        >
          Add New Category {parent ? `Under ${parentName}` : ''}
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
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type='text'
              className='input-product'
              onChange={(e) => setName(e.target.value)}
              placeholder='name'
            />
          </Form.Group>

          <Form.Group controlId='formGridCategory' className='mr-2'>
            <Form.Label>Parent</Form.Label>
            <select className='form-control' style={{ overflowY: 'scroll' }}>
              <option value={parentName}>{parentName}</option>
              {/* {allCateInfo.length > 0 &&
                allCateInfo?.map((c, i) => (
                  <option value={c._id} key={c._id}>
                    {c.name}
                  </option>
                ))} */}
            </select>
          </Form.Group>

          <Form.Group controlId='ControlTextarea1'>
            <Form.Label> Description</Form.Label>
            <Form.Control
              as='textarea'
              className='areaText'
              rows={5}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='say something'
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <button className='cancel-btn' onClick={() => setOpenModal(false)}>
            Cancel
          </button>
          <button
            className='save-btn d-flex align-items-center'
            onClick={handleCategoryCreate}
          >
            Create
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
    </Fragment>
  )
}

export default AddNewCategory
