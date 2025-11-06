import React, { Fragment, useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import SweetAlert from '../../lib/sweetalert'
import './OrderStatus.scss'

const OrderStatus = ({ children, allOrders, order }) => {
  const [openModal, setOpenModal] = useState(false)

  const [status, setStatus] = useState(null)

  useEffect(() => {
    setStatus(order.status)
  }, [order])

  const handleOrderUpdate = (e) => {
    e.preventDefault()
    fetch(process.env.REACT_APP_BACKEND_URL + `/order/change_status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        teezarat: `${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        status: status,
        short_id: order.short_id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          allOrders()
          SweetAlert.success('Success', 'Order updated SuccessFully')
        }
      })
      .catch((err) => {
        SweetAlert.failed('Error', 'Order update Failed')
      })
  }

  return (
    <Fragment>
      {children &&
        React.cloneElement(children, { onClick: () => setOpenModal(true) })}
      <Modal centered show={openModal} onHide={() => setOpenModal(false)}>
        <Modal.Header>
          <Modal.Title className='fw-bolder'>Change Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div>
              <div
                className='d-flex justify-content-start align-items-center p-1 my-1'
                style={{
                  backgroundColor: '#FFFEF0',
                  border: '1px solid #ABABAB',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onClick={() => setStatus('Order received')}
              >
                <div className='mx-3'>
                  {status === 'Order received' && (
                    <img src='/assets/order-thik.png' alt='' />
                  )}
                </div>

                <div className='text-primary' style={{ fontWeight: 'bold' }}>
                  {' '}
                  Order received{' '}
                </div>
              </div>

              <div
                className='d-flex justify-content-start align-items-center p-1 my-1'
                style={{
                  backgroundColor: '#FFFEF0',
                  border: '1px solid #ABABAB',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onClick={() => setStatus('Processing your order')}
              >
                <div className='mx-3'>
                  {status === 'Processing your order' && (
                    <img src='/assets/order-thik.png' alt='' />
                  )}
                </div>

                <div className='text-primary' style={{ fontWeight: 'bold' }}>
                  {' '}
                  Processing your order
                </div>
              </div>
              <div
                className='d-flex justify-content-start align-items-center p-1 my-1'
                style={{
                  backgroundColor: '#FFFEF0',
                  border: '1px solid #ABABAB',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onClick={() => setStatus('Order Processed')}
              >
                <div className='mx-3'>
                  {status === 'Order Processed' && (
                    <img src='/assets/order-thik.png' alt='' />
                  )}
                </div>

                <div className='text-primary' style={{ fontWeight: 'bold' }}>
                  Order Processed
                </div>
              </div>

              <div
                className='d-flex justify-content-start align-items-center p-1 my-1'
                style={{
                  backgroundColor: '#FFFEF0',
                  border: '1px solid #ABABAB',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onClick={() => setStatus('Deliverer is on the way')}
              >
                <div className='mx-3'>
                  {status === 'Deliverer is on the way' && (
                    <img src='/assets/order-thik.png' alt='' />
                  )}
                </div>

                <div className='text-primary' style={{ fontWeight: 'bold' }}>
                  Deliverer is on the way
                </div>
              </div>

              <div
                className='d-flex justify-content-start align-items-center p-1 my-1'
                style={{
                  backgroundColor: '#FFFEF0',
                  border: '1px solid #ABABAB',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onClick={() => setStatus('Delivered')}
              >
                <div className='mx-3'>
                  {status === 'Delivered' && (
                    <img src='/assets/order-thik.png' alt='' />
                  )}
                </div>

                <div className='text-success' style={{ fontWeight: 'bold' }}>
                  Delivered
                </div>
              </div>
              <div
                className='d-flex justify-content-start align-items-center p-1 my-1'
                style={{
                  backgroundColor: '#FFFEF0',
                  border: '1px solid #ABABAB',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onClick={() => setStatus('Canceled')}
              >
                <div className='mx-3'>
                  {status === 'Canceled' && (
                    <img src='/assets/order-thik.png' alt='' />
                  )}
                </div>

                <div
                  className=''
                  style={{ fontWeight: 'bold', color: '#ff6b00' }}
                >
                  Canceled
                </div>
              </div>
              <div
                className='d-flex justify-content-start align-items-center p-1 my-1'
                style={{
                  backgroundColor: '#FFFEF0',
                  border: '1px solid #ABABAB',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onClick={() => setStatus('Failed')}
              >
                <div className='mx-3'>
                  {status === 'Failed' && (
                    <img src='/assets/order-thik.png' alt='' />
                  )}
                </div>

                <div className='text-danger' style={{ fontWeight: 'bold' }}>
                  Failed
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer onClick={() => setOpenModal(!openModal)}>
          <button className='cancel-btn'>Cancel</button>
          <button className='save-btn' onClick={handleOrderUpdate}>
            Save
          </button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  )
}

export default OrderStatus
