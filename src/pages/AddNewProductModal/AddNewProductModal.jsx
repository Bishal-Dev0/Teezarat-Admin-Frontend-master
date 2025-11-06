import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { Form, Modal, Spinner } from 'react-bootstrap'
import SweetAlert from '../../lib/sweetalert'
import './AddNewProductModal.scss'
const AddNewProductModal = ({ children, allProducts }) => {
  const [openModal, setOpenModal] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState('')
  const [unit, setUnit] = useState('')
  const [cate, setCate] = useState([])
  const [photoSpinner, setPhotoSpinner] = useState(false)

  const [categorySelect, setCategorySelect] = useState({
    description: '',
    name: '',
    parent_id: '',
    _id: '',
    __v: 0,
  })
  const [discountedPrice, setDisCountedPrice] = useState(0)
  const [metaTag, setMetaTag] = useState('')
  const [spinnerStatus, setSpinnerStatus] = useState(false)

  useEffect(() => {
    getAllCategory()
  }, [])

  const getAllCategory = () => {
    fetch(
      process.env.REACT_APP_BACKEND_URL + `/category/get?child_only=${true}`
    )
      .then((res) => res.json())
      .then((data) => {
        setCate(data?.data)
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

  const handleProductCreate = (e) => {
    if (!photo) {
      setSpinnerStatus(false)
      return SweetAlert.failed('Error', 'Please add product photo')
    }
    setSpinnerStatus(true)
    if (
      name === '' ||
      price === '' ||
      categorySelect._id === '' ||
      unit === ''
    ) {
      setSpinnerStatus(false)
      return SweetAlert.failed('Error', 'Please fill up all required field')
    }

    const newData = {
      category_id: categorySelect,
      photo: [photo],
      name: name,
      price: price,
      discount_price: discountedPrice,
      unit: unit,
      description: description,
      meta_tag: metaTag,
      stock: countInStock,
    }

    fetch(process.env.REACT_APP_BACKEND_URL + '/product/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        teezarat: `${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(newData),
    })
      .then((res) => res.json())
      .then((data) => {
        setSpinnerStatus(false)
        setOpenModal(false)

        if (data.success === 'yes') {
          allProducts()
          setName('')
          setPrice('')
          setCountInStock('')
          setDescription('')
          setPhoto('')
          setUnit('')
          setDisCountedPrice(null)
          setMetaTag('')
          setSpinnerStatus(false)
          SweetAlert.success('Product!', 'Product Created Successfully!')
        } else {
          SweetAlert.failed('Product creation Failed!', data.msg)
          setSpinnerStatus(false)
        }
      })
  }

  return (
    <Fragment>
      {children &&
        React.cloneElement(children, { onClick: () => setOpenModal(true) })}

      <Modal
        show={openModal}
        onHide={() => setOpenModal(false)}
        centered
        size='lg'
      >
        <div className='m-3'>
          <h5 style={{ fontWeight: 'bold', marginBottom: '2rem' }}>
            Create Product
          </h5>
          <div className='d-flex justify-content-between align-items-end'>
            <div className='d-flex justify-content-center align-items-end'>
              <img
                src={photo || '/assets/img-upload.png'}
                alt=''
                width='80px'
                height='80px'
              />
              <Form className='ml-3 '>
                <Form.Group controlId='productPhoto' style={{ margin: '0' }}>
                  <Form.Label className='d-flex justify-content-start align-items-center'>
                    Product Photo*{' '}
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
            <Form>
              <Form.Group style={{ margin: '0' }} controlId='formGridStock'>
                <Form.Label>Stock</Form.Label>
                <Form.Control
                  type='number'
                  className=''
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                />
              </Form.Group>
            </Form>
          </div>
        </div>

        <Modal.Body>
          <Form>
            <Form.Group className='' controlId='formGridProduct'>
              <Form.Label>Product Name* </Form.Label>
              <Form.Control
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form className='custom-from'>
              <Form.Group controlId='formGridCategory' className='mr-2'>
                <Form.Label>Category*</Form.Label>
                <select
                  className='form-select form-control'
                  onChange={(e) => setCategorySelect(e.target.value)}
                >
                  <option value='setectACat'>select a category</option>
                  {cate &&
                    cate?.map((c, i) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </Form.Group>
            </Form>
            <Form className='custom-from'>
              <Form.Group controlId='formGridUnit' className='mr-2'>
                <Form.Label>Unit* </Form.Label>
                <Form.Control
                  type='text'
                  className='input-select1'
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder='for example: 1kg, 1 meter etc.'
                />
              </Form.Group>

              <Form.Group className='ml-2' controlId='formGridPrice'>
                <Form.Label>Meta Tag For SEO</Form.Label>
                <Form.Control
                  type='text'
                  className='input-select2'
                  value={metaTag}
                  onChange={(e) => setMetaTag(e.target.value)}
                />
              </Form.Group>
            </Form>

            <Form className='custom-from'>
              <Form.Group className='mr-2' controlId='formGridPrice'>
                <Form.Label>Price Per Unit* </Form.Label>
                <Form.Control
                  type='number'
                  className='input-select2'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder='example: 100 BDT (per kg)'
                />
              </Form.Group>
              <Form.Group controlId='formGridUnit' className='ml-2'>
                <Form.Label>Discount Price</Form.Label>
                <Form.Control
                  type='number'
                  className='input-select1'
                  value={discountedPrice}
                  onChange={(e) => setDisCountedPrice(e.target.value)}
                  placeholder='product price after discount given'
                />
              </Form.Group>
            </Form>

            <Form.Group controlId='ControlTextarea1'>
              <Form.Label>Product Description</Form.Label>
              <Form.Control
                as='textarea'
                className='areaText'
                rows={5}
                value={description}
                placeholder='Say something about the product'
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button className='cancel-btn' onClick={() => setOpenModal(false)}>
            Cancel
          </button>
          <button
            className='save-btn d-flex justify-content-center align-items-center'
            onClick={handleProductCreate}
          >
            Create
            {spinnerStatus && (
              <Spinner
                animation='border'
                role='status'
                size='sm'
                className='ml-2'
              />
            )}
          </button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  )
}

export default AddNewProductModal
