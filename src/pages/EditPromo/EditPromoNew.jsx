import React, { Fragment, useEffect, useState } from 'react'
import { Col, Form, Modal, Spinner } from 'react-bootstrap'
import SweetAlert from '../../lib/sweetalert'
import './EditPromo.scss'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios'

const EditPromo = ({ children, coupon, allCouponCode }) => {
  const [openModal, setOpenModal] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [disabled, setDisabled] = useState(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [discountPercent, setDiscountPercent] = useState(0)
  const [endDate, setEndDate] = useState('')
  const [isGlbal, setIsGlobal] = useState(null)
  const [minOrder, setMinOrder] = useState(0)
  const [percent, setPercent] = useState(0)
  const [id, setId] = useState('')
  const [banner, setBanner] = useState('')
  const [spinner, setSpinner] = useState(false)
  const [photoSpinner, setPhotoSpinner] = useState(false)

  console.log(coupon)

  useEffect(() => {
    setCouponCode(coupon?.coupon_code)
    setDisabled(coupon?.disabled)
    setDiscountAmount(coupon?.discount_amount)
    setDiscountPercent(coupon?.discount_percentage)
    setEndDate(coupon?.end_date)
    setIsGlobal(coupon?.is_global)
    setMinOrder(coupon?.min_order_price)
    setPercent(coupon?.percentage)
    setId(coupon?._id)
    setBanner(coupon?.banner || '')
  }, [coupon])

  const handleCouponUpdate = (e) => {
    setSpinner(true)
    e.preventDefault()

    const updatedData = {
      id: id,
      discount_amount: discountAmount,
      discount_percentage: discountPercent,
      min_order_price: minOrder,
      banner: banner,
      start_date: new Date(coupon.start_date).toISOString().split('T')[0],
      end_date: new Date(endDate).toISOString().split('T')[0],
    }

    fetch(process.env.REACT_APP_BACKEND_URL + `/voucher/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        teezarat: `${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === 'yes') {
          allCouponCode()
          setSpinner(false)
          setOpenModal(false)
          SweetAlert.success('Updated!', 'Promo Updated Successfully!')
        } else {
          setSpinner(false)
          setOpenModal(false)
          SweetAlert.failed('Promo Updating Failed!', data.msg)
        }
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
      setBanner(data.path)
      setPhotoSpinner(false)
    } catch (error) {
      // console.error(error)
      setPhotoSpinner(false)

      SweetAlert.failed('Photo upload Failed!', error.message)
    }
  }

  const formateDate = (d) => {
    return new Date(d)
  }

  const [showPopUp, setShowPopUp] = useState(false)
  const [spinnerStatus, setSpinnerStatus] = useState(false)

  const handleDelete = () => {
    setShowPopUp(true)
    setOpenModal(false)
  }

  const deleteProduct = () => {
    setSpinnerStatus(true)

    fetch(process.env.REACT_APP_BACKEND_URL + `/voucher/delete?_id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        teezarat: `${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setShowPopUp(false)
        setSpinnerStatus(false)

        if (data.success === 'yes') {
          allCouponCode()
          SweetAlert.success('Promo Deleted Successfully!')
        } else {
          SweetAlert.failed('Promo Deleting Failed!', data.msg)
        }
      })
  }
  return (
    <Fragment>
      {children &&
        React.cloneElement(children, { onClick: () => setOpenModal(true) })}

      <Modal size='lg' show={openModal} onHide={() => setOpenModal(false)}>
        <Modal.Body>
          <h5 style={{ fontWeight: 'bold', marginBottom: '2rem' }}>
            Update Promotion
          </h5>
          <div className='d-flex justify-content-start align-items-end mb-3'>
            <img
              src={banner || '/assets/img-upload.png'}
              alt=''
              width='80px'
              height='80px'
            />
            <Form className='ml-3 '>
              <Form.Group controlId='productPhoto' style={{ margin: '0' }}>
                <Form.Label className='d-flex justify-content-start align-items-center'>
                  Banner Photo
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
          <div>
            <Form.Group controlId='formGridName'>
              <Form.Label>Promo Name</Form.Label>
              <Form.Control
                type='text'
                className='input-product-coupon2'
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
            </Form.Group>

            <Form.Row className='product-select'>
              <Form.Group as={Col} controlId='formGridUnit'>
                <Form.Label> Discount Amount</Form.Label>
                <Form.Control
                  type='text'
                  className='input-select-coupon1'
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} controlId='formGridUnit'>
                <Form.Label> Discount Percentage</Form.Label>
                <Form.Control
                  type='text'
                  className='input-select-coupon1'
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row className='product-select'>
              <Form.Group as={Col} controlId='formGridUnit'>
                <Form.Label>Minimum Order Price</Form.Label>
                <Form.Control
                  type='text'
                  className='input-select-coupon1'
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} controlId='formGridU'>
                <Form.Label>Valid Till</Form.Label>
                <DatePicker
                  selected={formateDate(endDate)}
                  onChange={(date) => setEndDate(date)}
                  className='form-control input-select-coupon1'
                />
              </Form.Group>
            </Form.Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className='ml-auto delete-btn' onClick={() => handleDelete()}>
            Delete
          </button>
          <button className='cancel-btn' onClick={() => setOpenModal(false)}>
            Cancel
          </button>
          <button
            className='save-btn d-flex justify-content-center align-items-center'
            onClick={handleCouponUpdate}
          >
            Update{' '}
            {spinner && (
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
          Are You Sure To Delete The Promo?
        </Modal.Body>

        <Modal.Footer>
          <button className='cancel-btn' onClick={() => setShowPopUp(false)}>
            NO
          </button>
          <button
            className='delete-btn bg-danger text-white d-flex justify-content-center align-items-center'
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

export default EditPromo
