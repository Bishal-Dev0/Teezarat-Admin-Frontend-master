import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { Form, Modal, Spinner } from 'react-bootstrap'
import SweetAlert from '../../lib/sweetalert'
import './EditProduct.scss'

const EditProduct = ({ children, product, allProducts }) => {
  const [openModal, setOpenModal] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [countInStock, setCountInStock] = useState('')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState('')
  const [unit, setUnit] = useState('')
  const [cate, setCate] = useState([])
  const [categorySelect, setCategorySelect] = useState([
    {
      description: '',
      name: '',
      parent_id: '',
      _id: '',
      __v: 0,
      icon: '',
    },
  ])
  const [isVisible, setIsVisible] = useState(false)
  const [discountedPrice, setDisCountedPrice] = useState(null)
  const [metaTag, setMetaTag] = useState('')
  const [spinnerStatus, setSpinnerStatus] = useState(false)
  const [photoSpinner, setPhotoSpinner] = useState(false)

  useEffect(() => {
    setName(product?.product[0]?.name)
    setPrice(product?.product[0]?.price)
    setCountInStock(product?.product[0]?.stock)
    setDescription(product?.product[0]?.description)
    setUnit(product?.product[0]?.unit)
    setIsVisible(product?.product[0]?.disable)

    setPhoto(product?.product[0]?.photo[0])
    setDisCountedPrice(product?.product[0]?.discount_price)
    setMetaTag(product?.product[0]?.meta_tag)
    setCategorySelect(product?.immediate_category_id)
  }, [product])

  useEffect(() => {
    getAllCategory()
  }, [])

  const getAllCategory = () => {
    fetch(
      process.env.REACT_APP_BACKEND_URL + `/category/get?child_only=${true}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success === 'yes') {
          // getSelectedCateInfo(product.product[0].category_id?.[0])
          setCate(data?.data)
        } else {
          SweetAlert.failed('Category Fetching Failed!', data.msg)
        }
      })
  }

  // const getSelectedCateInfo = (value) => {
  //   fetch(
  //     process.env.REACT_APP_BACKEND_URL +
  //       `/category/get?_id=${value.slice(0, 24)}`
  //   )
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.success === 'yes') {
  //         setCategorySelect(data.data[0])
  //       } else {
  //         SweetAlert.failed('Category Fetching Failed!', data.msg)
  //       }
  //     })
  // }

  const handleImageUpload = async (e) => {
    setPhotoSpinner(true)

    const reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onload = (res) => {
      setPhoto(res.target.result)
    }

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
      // console.error(error.response)
      setPhotoSpinner(false)

      SweetAlert.failed('Photo upload Failed!', error.message)
    }
  }

  const handleProductUpdate = (e) => {
    setSpinnerStatus(true)
    const updatedData = {
      id: product._id,
      category_id: categorySelect[0]?._id,
      photo: [photo],
      price: price,
      discount_price: discountedPrice,
      name: name,
      unit: unit,
      description: description,
      disable: isVisible,
      meta_tag: metaTag,
      stock: countInStock,
    }

    fetch(process.env.REACT_APP_BACKEND_URL + `/product/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        teezarat: `${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((data) => {
        setSpinnerStatus(false)
        setOpenModal(false)

        if (data.success === 'yes') {
          allProducts()
          SweetAlert.success('Product!', 'Product Updated Successfully!')
        } else {
          SweetAlert.failed('Product Updating Failed!', data.msg)
        }
      })
  }

  const [showPopUp, setShowPopUp] = useState(false)

  const handleDelete = () => {
    setShowPopUp(true)
    setOpenModal(false)
  }

  const deleteProduct = () => {
    setSpinnerStatus(true)

    fetch(
      process.env.REACT_APP_BACKEND_URL + `/product/delete?_id=${product._id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          teezarat: `${localStorage.getItem('token')}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setShowPopUp(false)
        setSpinnerStatus(false)

        if (data.success === 'yes') {
          allProducts()
          SweetAlert.success('Product!', 'Product Deleted Successfully!')
        } else {
          SweetAlert.failed('Product Deleting Failed!', data.msg)
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
          <div className='d-flex justify-content-between align-items-center'>
            <h5 style={{ fontWeight: 'bold', marginBottom: '2rem' }}>
              Update Product
            </h5>

            <Form>
              <Form.Check
                type='switch'
                id='custom-switch'
                label={isVisible === false ? 'Visible' : 'Hidden'}
                onChange={() => setIsVisible(!isVisible)}
              />
            </Form>
          </div>
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
          </div>
        </div>

        <Modal.Body>
          <Form>
            <Form.Group className='' controlId='formGridProduct'>
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form className='custom-from'>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <select
                  className='form-control'
                  value={categorySelect?.name}
                  onChange={(e) =>
                    setCategorySelect([
                      ...cate?.filter(
                        (f) => e.target.value.slice(0, 24) === f?._id
                      ),
                    ])
                  }
                >
                  <option value='' hidden>
                    select a category
                  </option>
                  {cate &&
                    cate?.map((c, idx) => (
                      <option
                        value={c._id + c?.name}
                        key={idx}
                        selected={
                          product?.immediate_category_id[0]?._id === c._id
                            ? true
                            : false
                        }
                      >
                        {c.name}
                      </option>
                    ))}
                </select>
              </Form.Group>
            </Form>
            <Form className='custom-from'>
              <Form.Group controlId='formGridUnit' className='mr-2'>
                <Form.Label>Unit</Form.Label>
                <Form.Control
                  type='text'
                  className='input-select1'
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder='1 kg'
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
                <Form.Label>Price Per Unit</Form.Label>
                <Form.Control
                  type='text'
                  className='input-select2'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder='100'
                />
              </Form.Group>
              <Form.Group className='ml-2' controlId='formGridPrice'>
                <Form.Label>Discount Price</Form.Label>
                <Form.Control
                  type='text'
                  className='input-select2'
                  value={discountedPrice}
                  onChange={(e) => setDisCountedPrice(e.target.value)}
                  placeholder='99'
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
          <button className='delete-btn' type='' onClick={() => handleDelete()}>
            Delete
          </button>
          <button className='cancel-btn' onClick={() => setOpenModal(false)}>
            Cancel
          </button>

          <button
            className='save-btn d-flex justify-content-center align-items-center'
            onClick={handleProductUpdate}
          >
            Update
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

      <Modal show={showPopUp} onHide={() => setShowPopUp(false)}>
        <Modal.Header closeButton>
          <Modal.Title
            style={{ color: 'red', fontWeight: 'bold', fontSize: '30px' }}
          >
            CAUTION!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: '20px' }}>
          {' '}
          Are You Sure To Delete The Product?
        </Modal.Body>

        <Modal.Footer>
          <button className='cancel-btn ' onClick={() => setShowPopUp(false)}>
            NO
          </button>
          <button
            className='delete-btn  bg-danger text-white d-flex justify-content-center align-items-center'
            onClick={() => deleteProduct()}
          >
            YES
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

export default EditProduct
