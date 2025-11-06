import { faSearch, faDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Fragment, useEffect, useState, useRef, createRef } from 'react'
import { Spinner } from 'react-bootstrap'
import OrderStatus from '../../../pages/OrderStatus/OrderStatus'
import Dashboard from '../Dashboard/Dashboard'
import Pagination from 'react-js-pagination'
import ReactToPrint from 'react-to-print'
import ComponentToPrint from '../Order/ComponentToPrint'
import '../Order/Order.scss'

const Receipts = () => {
  const componentRef = []
  const [btn, setBtn] = useState(false)

  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('Delivered')
  const [sort, setSort] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [pages, setPages] = useState(1)
  const [Count, setCount] = useState(1)

  useEffect(() => {
    setBtn(true)
    if (search.length > 0 || status.length > 0 || sort.length > 0) {
      setPageNumber(1)
    }
    allOrders()
  }, [search, status, pageNumber, sort])

  const allOrders = async () => {
    let url =
      process.env.REACT_APP_BACKEND_URL + `/order/admin_get?page=${pageNumber}`
    if (search.length > 0) url += `&filter=${search}`
    if (status.length > 0) url += `&status=${status}`
    if (sort.length > 0) url += `&sort=${sort}`
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          teezarat: `${localStorage.getItem('token')}`,
        },
      })
      const data = await res.json()

      setOrders(data.data)
      setCount(data.total_document)
      setPages(data.data.page)
    } catch (err) {
      // SweetAlert.failed('Error', err?.data?.msg)
    }
    setBtn(false)
  }

  const [printData, setPrintData] = useState({
    address: '',
    createdAt: '',
    customer_id: '',
    customers: [{}],
    delivery_charge: 0,
    details: [{}],
    discount: 0,
    final: true,
    grand_total: 3000,
    is_paid: false,
    note: '',
    payment_method: '',
    short_id: '',
    status: '',
    sub_total: 3000,
    updatedAt: '',
    voucher: [],
    __v: 0,
    _id: '',
  })

  return (
    <Dashboard>
      <div className='d-flex main-top'>
        <h4 style={{ fontWeight: 'bold' }}>Receipts</h4>
      </div>

      <Fragment>
        <div className='upper-section'>
          <div>
            <h5>Search</h5>
            <span>
              <input
                type='text'
                placeholder='Search by Order ID, name or email'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <FontAwesomeIcon icon={faSearch} />
            </span>
          </div>
          <div>
            <h5>Sorting</h5>
            <select
              onChange={(e) => setSort(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value='time_ascending'>Time Ascending</option>
              <option value='time_descending' selected>
                Time Descending
              </option>
            </select>
          </div>
          <div>
            <h5>Status</h5>
            <select
              onChange={(e) => setStatus(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value='Delivered' selected>
                Delivered
              </option>
              <option value='Failed'>Failed</option>
              <option value='Canceled'>Canceled</option>
            </select>
          </div>
        </div>

        <div className='table-wrapper'>
          <Spinner
            animation='border'
            role='status'
            style={{ display: btn ? 'block' : 'none', margin: '3rem auto' }}
          />
          {!btn && (
            <div>
              {orders.length > 0 ? (
                orders?.map((order, idx) => {
                  componentRef[idx] = createRef()
                  return (
                    <Fragment key={order._id}>
                      {
                        <Fragment>
                          <div className='table-row'>
                            <div className='order-side'>
                              <div className='m-3'>
                                <h6>Order ID: {order._id}</h6>
                                <p>
                                  Time: {order?.createdAt.substring(0, 10)},{' '}
                                </p>
                                <h6>Customer: </h6>
                                <p>
                                  {order?.customer_name ||
                                    order?.customers[0].name}
                                </p>
                                <p>
                                  Phone:{' '}
                                  {order?.customer_phone ||
                                    order?.customers[0].phone}
                                </p>
                                <p>Address: {order?.address} </p>
                              </div>
                            </div>
                            <div className='product-side '>
                              <h6 className='m-3'>Items</h6>
                              {order?.details?.map((prd, idx) => (
                                <Fragment key={idx}>
                                  <div className='product-inner m-3'>
                                    <div className='d-flex justify-content-between align-items-start mt-2 '>
                                      <img
                                        src={
                                          prd?.product?.photo[0] ||
                                          '/assets/food.png'
                                        }
                                        alt='product'
                                      />
                                      <div>
                                        <p style={{ margin: 0 }}>
                                          {prd?.product?.name}
                                        </p>
                                        <p style={{ margin: 0 }}>
                                          <span
                                            className='text-success '
                                            style={{ fontWeight: 'bold' }}
                                          >
                                            {' '}
                                            {
                                              prd.product.discount_price
                                            } BDT{' '}
                                          </span>{' '}
                                          <span style={{ color: 'dimgray' }}>
                                            / {prd.product.unit}{' '}
                                          </span>{' '}
                                          X {prd.quantity}
                                        </p>
                                      </div>
                                    </div>

                                    <p
                                      style={{
                                        margin: '0 0 0 3px',
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      BDT{' '}
                                      {prd.product?.discount_price *
                                        prd.quantity}
                                    </p>
                                  </div>
                                </Fragment>
                              ))}
                            </div>

                            <div className='deliver-side m-3'>
                              <div className='delivery-inner'>
                                <h6>Status</h6>

                                <OrderStatus
                                  order={order}
                                  allOrders={allOrders}
                                >
                                  <div className='order-progress mb-2'>
                                    <span>
                                      {order?.status === 'Delivered' ? (
                                        <span className='text-success fw-bold'>
                                          Delivered
                                        </span>
                                      ) : order?.status ===
                                        'Deliverer is on the way' ? (
                                        'Deliverer is on the way'
                                      ) : order?.status === 'Canceled' ? (
                                        <span className='text-danger fw-bold'>
                                          Canceled
                                        </span>
                                      ) : order?.status === 'Failed' ? (
                                        <span className='text-danger fw-bold'>
                                          Failed
                                        </span>
                                      ) : (
                                        ''
                                      )}
                                    </span>
                                  </div>
                                </OrderStatus>
                                <div className=' mt-3'>
                                  <h6>Bill (Cash on Delivery)</h6>
                                  <div className='d-flex justify-content-between align-items-center'>
                                    <p>Items</p>
                                    <p>BDT {order?.sub_total}</p>
                                  </div>
                                  <div className='d-flex justify-content-between align-items-center'>
                                    <p>Delivery</p>
                                    <p>BDT {order?.delivery_charge}</p>
                                  </div>
                                  <div
                                    className='d-flex justify-content-between align-items-center mb-2'
                                    style={{
                                      borderBottom: '1px solid #ABABAB',
                                    }}
                                  >
                                    <p>Coupon</p>
                                    <p>BDT {order?.discount}</p>
                                  </div>
                                  <div className='d-flex justify-content-between align-items-center'>
                                    <p>Total</p>
                                    <p>BDT {order?.grand_total}</p>
                                  </div>
                                  <div className='d-flex justify-content-between align-items-center'>
                                    <p>Paid</p>
                                    <p>BDT {order?.paidAmount || 0}</p>
                                  </div>
                                  <div className='d-flex justify-content-between align-items-center'>
                                    <p>Due Bill</p>
                                    <p>
                                      BDT{' '}
                                      {order?.grand_total -
                                        (order?.paidAmount || 0)}
                                    </p>
                                  </div>
                                  <ReactToPrint
                                    trigger={() => (
                                      <button
                                        style={{
                                          padding: '.25rem 1rem',
                                          background: '#fe7f00',
                                          color: 'white',
                                          fontWeight: 'bold',
                                          border: 'none',
                                          borderRadius: '4px',
                                        }}
                                        className=' w-100 d-flex justify-content-center align-items-center'
                                      >
                                        Print Receipt
                                        <FontAwesomeIcon
                                          icon={faDownload}
                                          className='ml-2'
                                        />
                                      </button>
                                    )}
                                    content={() => componentRef[idx].current}
                                  />
                                  <div style={{ display: 'none' }}>
                                    <ComponentToPrint
                                      ref={componentRef[idx]}
                                      data={order}
                                      documentTitle='Teezarat-users-data'
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Fragment>
                      }
                    </Fragment>
                  )
                })
              ) : (
                <h1
                  className='text-dark text-center'
                  style={{ margin: '15rem 0 ' }}
                >
                  No Data Found!
                </h1>
              )}
            </div>
          )}
        </div>
        {orders.length > 0 && (
          <div className='pagination'>
            <Pagination
              activePage={pageNumber}
              itemsCountPerPage={pages}
              totalItemsCount={Count}
              onChange={setPageNumber}
              nextPageText={'>'}
              prevPageText={'<'}
              firstPageText={'First'}
              lastPageText={'Last'}
              itemClass='page-item'
              linkClass='page-link'
            />
          </div>
        )}
      </Fragment>
    </Dashboard>
  )
}

export default Receipts
