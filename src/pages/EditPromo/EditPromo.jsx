import React, { Fragment, useEffect, useState } from 'react'
import { Col, Form, Modal } from 'react-bootstrap'
import SweetAlert from '../../lib/sweetalert'
import moment from 'moment'
import './EditPromo.scss'
import DeletePromo from '../DeletePromo/DeletePromo'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const EditPromo = ({ children, coupon, allCouponCode }) => {
  const [openModal, setOpenModal] = useState(false)
  const [value, setValue] = useState(true)
  const [couponID, setCouponID] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [couponDescription, setCouponDescription] = useState('')
  const [couponDiscountPercentage, setCouponDiscountPercentage] = useState(0)
  const [couponDiscountLimit, setCouponDiscountLimit] = useState(0)
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0)
  const [couponDiscountMinimumAmount, setCouponDiscountMinimumAmount] =
    useState(0)
  const [couponEndTime, setCouponEndTime] = useState('')

  useEffect(() => {
    setCouponID(coupon.couponID)
    setCouponCode(coupon.couponCode)
    setCouponDescription(coupon.couponDescription)
    setCouponDiscountPercentage(coupon.couponDiscountPercentage)
    setCouponDiscountLimit(coupon.couponDiscountLimit)
    setCouponDiscountAmount(coupon.couponDiscountAmount)
    setCouponDiscountMinimumAmount(coupon.couponDiscountMinimumAmount)
    setCouponEndTime(new Date())
  }, [coupon])

  const handleCouponUpdate = (e) => {
    e.preventDefault()

    fetch(
      process.env.REACT_APP_BACKEND_URL + `/api/update/coupon/${coupon._id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          couponID,
          couponCode,
          couponDescription,
          couponDiscountPercentage,
          couponDiscountLimit,
          couponDiscountAmount,
          couponDiscountMinimumAmount,
          couponEndTime,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          allCouponCode()
          setOpenModal(false)

          SweetAlert.success('Updated!', 'Promo Updated Successfully!')
        }
      })
      .catch((err) => {
        setOpenModal(true)
        SweetAlert.failed('warning', err.message || 'Promo Update failed!')
      })
  }

  return (
    <Fragment>
      {children &&
        React.cloneElement(children, { onClick: () => setOpenModal(true) })}

      <Modal size='lg' show={openModal} onHide={() => setOpenModal(false)}>
        <Modal.Body>
          <h5 style={{ fontWeight: 'bold', marginBottom: '2rem' }}>
            Create Promotion
          </h5>

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
            <Form.Group controlId='ControlTextarea1'>
              <Form.Label>Promo Description</Form.Label>
              <Form.Control
                as='textarea'
                className='areaText-coupon'
                rows={5}
                value={couponDescription}
                onChange={(e) => setCouponDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Row className='product-select'>
              <Form.Group as={Col} controlId='formGridType'>
                <Form.Label>Discount Type</Form.Label>
                <Form.Control
                  as='select'
                  className='input-select-coupon1'
                  onChange={(e) => setValue(e.target.value)}
                >
                  <option value='' disabled selected hidden>
                    Please select type
                  </option>
                  <option value='flat'>Flat</option>
                  <option value='percent'>Percentage</option>
                </Form.Control>
              </Form.Group>

              {value === 'flat' ? (
                <Form.Group
                  as={Col}
                  className='select2'
                  controlId='formGridPrice'
                >
                  <Form.Label>Discount Amount</Form.Label>
                  <Form.Control
                    type='text'
                    className='input-select-coupon2'
                    value={couponDiscountAmount}
                    onChange={(e) => setCouponDiscountAmount(e.target.value)}
                  />
                </Form.Group>
              ) : value === 'percent' ? (
                <Form.Group
                  as={Col}
                  className='select2'
                  controlId='formGridPrice'
                >
                  <Form.Label>Discount Percentage</Form.Label>
                  <Form.Control
                    type='text'
                    className='input-select-coupon2'
                    value={couponDiscountPercentage}
                    onChange={(e) =>
                      setCouponDiscountPercentage(e.target.value)
                    }
                  />
                </Form.Group>
              ) : null}
            </Form.Row>

            <Form.Row className='product-select'>
              <Form.Group as={Col} controlId='formGridUnit'>
                <Form.Label>Minimum Order Price</Form.Label>
                <Form.Control
                  type='text'
                  className='input-select-coupon1'
                  value={couponDiscountMinimumAmount}
                  onChange={(e) =>
                    setCouponDiscountMinimumAmount(e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group as={Col} className='select2' controlId='formGridP'>
                <Form.Label>Discount Threshold</Form.Label>
                <Form.Control
                  type='text'
                  className='input-select-coupon2'
                  value={couponDiscountLimit}
                  onChange={(e) => setCouponDiscountLimit(e.target.value)}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row className='product-select'>
              <Form.Group as={Col} controlId='formGridU'>
                <Form.Label>Valid Till</Form.Label>
                <DatePicker
                  selected={couponEndTime}
                  onChange={(date) => setCouponEndTime(date)}
                  className='form-control input-select-coupon1'
                />
              </Form.Group>
            </Form.Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <DeletePromo id={coupon._id} allCouponCode={allCouponCode}>
            <button className='ml-auto delete-btn'>Delete</button>
          </DeletePromo>
          <button className='cancel-btn' onClick={() => setOpenModal(false)}>
            Cancel
          </button>
          <button className='save-btn' onClick={handleCouponUpdate}>
            Update
          </button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  )
}

export default EditPromo
