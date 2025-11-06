import React, { Fragment, useEffect, useState } from 'react'
import { Col, Form, Modal, Spinner } from 'react-bootstrap'
import SweetAlert from '../../lib/sweetalert'
import './AddNewPromo.scss'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios'
import { Select } from 'antd'
import { useCallback } from 'react'

const { Option } = Select

const AddNewPromo = ({ children, allCouponCode }) => {
  const [openModal, setOpenModal] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [discountAmount, setDiscountAmount] = useState(0)
  const [discountPercent, setDiscountPercent] = useState(0)
  const [endDate, setEndDate] = useState(new Date())
  const [isGlobal, setIsGlobal] = useState(true)
  const [minOrder, setMinOrder] = useState(0)
  const [banner, setBanner] = useState('')
  const [spinner, setSpinner] = useState(false)
  const [photoSpinner, setPhotoSpinner] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [customerId, setCustomerId] = useState('')
  const [users, setUsers] = useState([])
  const [discountType, setDiscountType] = useState('flat')

  useEffect(() => {
    if (discountType === 'flat') {
      setDiscountPercent(100)
      setDiscountAmount(0)
    } else {
      setDiscountAmount(99999999)
      setDiscountPercent(0)
    }
  }, [discountType])

  const handleCancel = () => {
    setOpenModal(false)
    setCouponCode('')
  }

  const handleCouponCreate = (e) => {
    setSpinner(true)
    e.preventDefault()

    const updatedData = {
      coupon_code: couponCode,
      discount_amount: discountAmount,
      discount_percentage: discountPercent,
      is_global: isGlobal,
      min_order_price: minOrder,
      banner: banner,
      customer_id: customerId,
      start_date: new Date(startDate).toISOString().split('T')[0],
      end_date: new Date(endDate).toISOString().split('T')[0],
    }

    fetch(process.env.REACT_APP_BACKEND_URL + `/voucher/create`, {
      method: 'POST',
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
          setCouponCode('')
          setDiscountAmount('')
          setDiscountPercent(0)
          setIsGlobal(true)
          setMinOrder(0)
          setBanner('')
          setCustomerId('')
          setStartDate(new Date())
          setEndDate(new Date())

          SweetAlert.success('Updated!', 'Promo Created Successfully!')
        } else {
          setSpinner(false)
          // setOpenModal(false)
          SweetAlert.failed('Promo Created Failed!', data.msg)
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

  const debounce = (func) => {
    let timer
    return function (...args) {
      const context = this
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        func.apply(context, args)
      }, 500)
    }
  }

  const getAllUser = async (name) => {
    try {
      const res = await axios.get(
        process.env.REACT_APP_BACKEND_URL + `/customer/get?filter=${name}`,
        {
          headers: {
            teezarat: localStorage.getItem('token'),
          },
        }
      )

      if (res.status === 200) {
        setUsers(res?.data?.data?.data)
      }
    } catch (error) {}
  }
  const optimizedUserCall = useCallback(debounce(getAllUser), [])

  const onChange = (value) => {
    setCustomerId(value)
  }

  return (
    <Fragment>
      {children &&
        React.cloneElement(children, { onClick: () => setOpenModal(true) })}

      <Modal size='lg' show={openModal} onHide={handleCancel}>
        <Modal.Body>
          <h5 style={{ fontWeight: 'bold', marginBottom: '2rem' }}>
            Create New Promotion
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
            <Form.Row className='product-select'>
              <Form.Group as={Col} controlId='formGridName'>
                <Form.Label>Promo Code*</Form.Label>
                <Form.Control
                  type='text'
                  className='input-product-coupon2'
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} controlId='formGridName'>
                <Form.Label>Is Global*</Form.Label>
                {/* <Form.Control
                  type='text'
                  className='input-product-coupon2'
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                /> */}
                <select
                  className='form-control'
                  value={isGlobal}
                  onChange={(e) => setIsGlobal(e.target.value)}
                >
                  {/* <option value='setectACat' hidden>
                    {' '}
                    Is global or not
                  </option> */}

                  <option value={true}>True</option>
                  <option value={false}>False</option>
                </select>
              </Form.Group>
              <Form.Group as={Col} controlId='formGridName'>
                <Form.Label>Discount Type*</Form.Label>

                <select
                  className='form-control'
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                >
                  <option value={'flat'} selected>
                    Flat
                  </option>
                  <option value={'percentage'}>Percentage</option>
                </select>
              </Form.Group>
            </Form.Row>
            {/* {isGlobal === 'false' && (
              <Form.Group controlId='formGridName'>
                <Form.Label>Customer Id*</Form.Label>
                <Form.Control
                  type='text'
                  className='input-product-coupon2'
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                />
              </Form.Group>
            )} */}

            {isGlobal === 'false' && (
              <div className='ant-searchable-select mb-3'>
                {' '}
                <Form.Label>Customer Name*</Form.Label>
                <Select
                  showSearch
                  placeholder='Select a customer'
                  optionFilterProp='children'
                  onChange={onChange}
                  onSearch={optimizedUserCall}
                  filterOption={false}
                  className='w-100'
                  style={{ height: '38px' }}
                >
                  {users?.map((u, idx) => (
                    <Option key={idx} value={u?._id}>
                      {u?.name}
                    </Option>
                  ))}
                </Select>
              </div>
            )}
            <Form.Row className='product-select'>
              {discountType === 'flat' && (
                <Form.Group as={Col} controlId='formGridUnit'>
                  <Form.Label> Discount Amount*</Form.Label>
                  <Form.Control
                    type='number'
                    className='input-select-coupon1'
                    value={discountAmount}
                    disabled={discountType === 'percentage' ? true : false}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                  />
                </Form.Group>
              )}
              {discountType === 'percentage' && (
                <Form.Group as={Col} controlId='formGridUnit'>
                  <Form.Label> Discount Percentage*</Form.Label>
                  <Form.Control
                    type='number'
                    className='input-select-coupon1'
                    value={discountPercent}
                    disabled={discountType === 'percentage' ? false : true}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                  />
                </Form.Group>
              )}
              <Form.Group as={Col} controlId='formGridUnit'>
                <Form.Label>Minimum Order Price*</Form.Label>
                <Form.Control
                  type='number'
                  className='input-select-coupon1'
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row className='product-select'>
              <Form.Group as={Col} controlId='formGridU'>
                <Form.Label>Valid Form*</Form.Label>
                <DatePicker
                  selected={formateDate(startDate)}
                  onChange={(date) => setStartDate(date)}
                  className='form-control input-select-coupon1'
                />
              </Form.Group>
              <Form.Group as={Col} controlId='formGridU'>
                <Form.Label>Valid Till*</Form.Label>
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
          <button className='cancel-btn' onClick={handleCancel}>
            Cancel
          </button>
          <button
            className='save-btn d-flex justify-content-center align-items-center'
            onClick={handleCouponCreate}
          >
            Create{' '}
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
    </Fragment>
  )
}

export default AddNewPromo
