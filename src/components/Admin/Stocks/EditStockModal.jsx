import axios from 'axios'
import React from 'react'
import { Form, Modal, Spinner } from 'react-bootstrap'
import SweetAlert from '../../../lib/sweetalert'

const EditStockModal = ({ show, onClose, data, getAllStocks }) => {
  const [stockData, setStockData] = React.useState({
    id: '',
    vendor_name: '',
    vendor_phone: '',
    vendor_address: '',
    total_price: 0,
    paid: 0,
    due: 0,
    payment_method: '',
  })
  React.useEffect(() => {
    setStockData({
      id: data?._id,
      vendor_name: data?.vendor_name,
      vendor_phone: data?.vendor_phone,
      vendor_address: data?.vendor_address,
      total_price: data?.total_price,
      paid: data?.paid,
      due: data?.due,
      payment_method: data?.payment_method,
    })
  }, [data])

  const [spinnerStatus, setSpinnerStatus] = React.useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setSpinnerStatus(true)

    try {
      const response = await axios.put(
        process.env.REACT_APP_BACKEND_URL + '/stock-order/edit',
        stockData,
        {
          headers: {
            teezarat: localStorage.getItem('token'),
          },
        }
      )

      if (response.status === 200) {
        SweetAlert.success('Success', 'Stock order updated successfully!')
        setStockData({
          id: '',
          vendor_name: '',
          vendor_phone: '',
          vendor_address: '',
          total_price: 0,
          paid: 0,
          due: 0,
          payment_method: '',
        })
        getAllStocks()
        setSpinnerStatus(false)
        onClose()
      } else throw new Error(response?.data?.msg || 'Try Again Later')
    } catch (error) {
      SweetAlert.failed('Failed', error?.data?.message)
      setStockData({
        id: '',
        vendor_name: '',
        vendor_phone: '',
        vendor_address: '',
        total_price: 0,
        paid: 0,
        due: 0,
        payment_method: '',
      })
      getAllStocks()
      setSpinnerStatus(false)
      onClose()
    }
  }

  return (
    <Modal show={show} onHide={onClose} size='lg'>
      <div className='m-3'>
        <h5 style={{ fontWeight: 'bold', marginBottom: '2rem' }}>
          Edit Stock Order
        </h5>
      </div>

      <Modal.Body>
        <Form>
          <Form.Group className='' controlId='formGridProduct'>
            <Form.Label>Order Id</Form.Label>
            <Form.Control type='text' value={stockData?.id} disabled />
          </Form.Group>

          <Form.Group className='' controlId='formGridProduct'>
            <Form.Label>Vendor Name</Form.Label>
            <Form.Control
              required
              type='text'
              value={stockData?.vendor_name}
              onChange={(e) =>
                setStockData({ ...stockData, vendor_name: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className='' controlId='formGridProduct'>
            <Form.Label>Vendor Phone</Form.Label>
            <Form.Control
              required
              type='number'
              value={stockData?.vendor_phone}
              onChange={(e) =>
                setStockData({ ...stockData, vendor_phone: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className='' controlId='formGridProduct'>
            <Form.Label>Vendor Address</Form.Label>
            <Form.Control
              required
              type='text'
              value={stockData?.vendor_address}
              onChange={(e) =>
                setStockData({ ...stockData, vendor_address: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className='' controlId='formGridProduct'>
            <Form.Label>Total Price</Form.Label>
            <Form.Control type='text' value={stockData?.total_price} disabled />
          </Form.Group>

          <Form.Group className='' controlId='formGridProduct'>
            <Form.Label>Paid</Form.Label>
            <Form.Control
              required
              type='number'
              value={stockData?.paid}
              onChange={(e) =>
                setStockData({
                  ...stockData,
                  paid: parseFloat(e.target.value),
                  due:
                    parseFloat(stockData.total_price) -
                      parseFloat(e.target.value) >
                    0
                      ? parseFloat(stockData.total_price) -
                        parseFloat(e.target.value)
                      : 0,
                })
              }
            />
          </Form.Group>

          <Form.Group className='' controlId='formGridProduct'>
            <Form.Label>Due</Form.Label>
            <Form.Control type='text' value={stockData?.due} disabled />
          </Form.Group>

          <Form.Group className='' controlId='formGridProduct'>
            <Form.Label>Payment Method</Form.Label>
            <Form.Control
              required
              type='text'
              value={stockData?.payment_method}
              onChange={(e) =>
                setStockData({ ...stockData, payment_method: e.target.value })
              }
            />
          </Form.Group>
        </Form>
        <div className='d-flex justify-content-end align-items-center'>
          <button type='cancel' className='cancel-btn mr-2' onClick={onClose}>
            Cancel
          </button>
          <button
            type='submit'
            className='save-btn d-flex justify-content-center align-items-center'
            onClick={handleSubmit}
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
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default EditStockModal
