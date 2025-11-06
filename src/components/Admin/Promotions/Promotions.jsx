import React, { Fragment, useEffect, useState } from 'react'
import { Button, Modal, Spinner, Table } from 'react-bootstrap'
import AddNewPromo from '../../../pages/AddNewPromo/AddNewPromo'
import Dashboard from '../Dashboard/Dashboard'
import EditPromoNew from '../../../pages/EditPromo/EditPromoNew'
import Pagination from 'react-js-pagination'
import SweetAlert from '../../../lib/sweetalert'

const Promotions = () => {
  const [coupons, setCoupons] = useState([])
  const [spinnerStatus, setSpinnerStatus] = useState(false)
  const [activeStatus, setActiveStatus] = useState('active')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalProductCount, setTotalProductCount] = useState(0)
  const [globalStatus, setGlobalStatus] = useState('')
  const [name, setName] = useState('')
  const [from, setFrom] = useState('')
  const [till, setTill] = useState('')

  useEffect(() => {
    setPage(1)
    allCouponCode()
  }, [activeStatus, search, globalStatus, name, from, till])

  useEffect(() => {
    allCouponCode()
  }, [page])

  const allCouponCode = () => {
    setSpinnerStatus(true)
    let url = process.env.REACT_APP_BACKEND_URL + `/voucher/get?page=${page}`
    if (activeStatus) {
      url += `&status=${activeStatus}`
    }
    if (search.length > 0) {
      url += `&coupon_code=${search}`
    }
    if (globalStatus.length > 0) {
      url += `&is_global=${globalStatus}`
    }
    if (name.length > 0) {
      url += `&name=${name}`
    }
    if (from.length > 0) {
      url += `&from=${from}`
    }
    if (till.length > 0) {
      url += `&till=${till}`
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success === 'yes') {
          setCoupons(data.data.data)
          setTotalProductCount(data?.data?.total_document)

          setSpinnerStatus(false)
        } else {
          setSpinnerStatus(false)
          SweetAlert.failed('Promo get failed', data?.msg)
        }
      })
  }

  const formateDate = (d) => {
    return new Date(d).toDateString()
  }

  const [couponData, setCouponData] = useState({})
  const [show, setShow] = useState(false)

  const handleClick = (c) => {
    setShow(true)
    setCouponData(c)
  }

  return (
    <Dashboard>
      <div className='d-flex mb-5' style={{ marginTop: '34px' }}>
        <h4>Promotions</h4>
        <span className='ml-auto'>
          <AddNewPromo className='ml-auto' allCouponCode={allCouponCode}>
            <Button className=' d-flex justify-content-center align-items-center  '>
              <img className='mr-3' src='/assets/+.png' alt='' /> New Coupon
            </Button>
          </AddNewPromo>
        </span>
      </div>

      <div className='mb-4  row '>
        <div className='col-6 pl-0'>
          <label>Search By Code</label>
          <input
            type='text'
            value={search}
            className='form-control'
            placeholder='Search by coupon code'
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className='col-3 pl-0'>
          <label>Is Global</label>
          <select
            onChange={(e) => setGlobalStatus(e.target.value)}
            style={{ cursor: 'pointer' }}
            className='form-control'
          >
            <option value='' selected>
              All
            </option>
            <option value='true'>Yes</option>
            <option value='false'>No</option>
          </select>
        </div>
        <div className='col-3 px-0'>
          <label>Status</label>
          <select
            onChange={(e) => setActiveStatus(e.target.value)}
            style={{ cursor: 'pointer' }}
            className='form-control'
          >
            <option value='active' selected>
              Active
            </option>
            <option value='expired'>Expired</option>
            <option value='upcoming'>Upcoming</option>
          </select>
        </div>
      </div>

      <div className='mb-4  row '>
        <div className='col-6 pl-0'>
          <label>Search By name</label>
          <input
            type='text'
            value={name}
            className='form-control'
            placeholder='Search by customer name'
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='col-3 pl-0'>
          <label>From</label>
          <input
            type='date'
            value={from}
            className='form-control'
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div className='col-3 px-0'>
          <label>Till</label>
          <input
            type='date'
            value={till}
            className='form-control'
            onChange={(e) => {
              setTill(e.target.value)
            }}
          />
        </div>
      </div>

      <Fragment>
        <h4 className='d-flex align-items-center'>
          {activeStatus.charAt(0).toUpperCase() + activeStatus.slice(1)} Promos
          {spinnerStatus && (
            <Spinner
              animation='border'
              role='status'
              size='sm'
              className='ml-2'
            />
          )}
        </h4>
        {coupons.length > 0 ? (
          <>
            <Table
              responsive
              bordered
              hover
              striped
              style={{ background: '#FFFEF0', textAlign: 'center' }}
            >
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount </th>
                  <th> Percentage</th>
                  <th> Min Order</th>

                  <th>Disabled</th>
                  <th>Is global</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {coupons?.map((c, i) => (
                  <Fragment key={c._id}>
                    <tr>
                      <td onClick={() => handleClick(c)}>{c?.coupon_code}</td>
                      <td onClick={() => handleClick(c)}>
                        {c?.discount_amount}
                      </td>
                      <td onClick={() => handleClick(c)}>
                        {c?.discount_percentage || '-'}
                      </td>

                      <td onClick={() => handleClick(c)}>
                        {c?.min_order_price}
                      </td>

                      <td onClick={() => handleClick(c)}>
                        {c?.disabled ? 'true' : 'false'}
                      </td>
                      <td onClick={() => handleClick(c)}>
                        {c?.is_global ? 'true' : 'false'}
                      </td>
                      <td onClick={() => handleClick(c)}>
                        {formateDate(c.start_date)}
                      </td>
                      <td>{formateDate(c.end_date)}</td>

                      <td>
                        <EditPromoNew coupon={c} allCouponCode={allCouponCode}>
                          <button
                            className='td-update'
                            style={{ fontWeight: 'bold' }}
                          >
                            Edit
                          </button>
                        </EditPromoNew>
                      </td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </Table>
            <div className='pagination m-auto'>
              <Pagination
                activePage={page}
                itemsCountPerPage={10}
                totalItemsCount={totalProductCount}
                onChange={setPage}
                nextPageText={'>'}
                prevPageText={'<'}
                firstPageText={'First'}
                lastPageText={'Last'}
                itemClass='page-item'
                linkClass='page-link'
              />
            </div>
          </>
        ) : (
          <h5 className='text-secondary my-5 ml-2'>
            No {activeStatus.charAt(0).toUpperCase() + activeStatus.slice(1)}{' '}
            promo
          </h5>
        )}

        <Modal centered show={show} onHide={() => setShow(false)}>
          <Modal.Body
            style={{
              backgroundColor: '#fffef0',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            <img
              src={couponData?.banner}
              alt=''
              height='180px'
              width='180px'
              className='mb-3'
            />
            <h5>
              {' '}
              <span
                style={{
                  fontWeight: 'bold',
                  width: '20%',
                  color: 'darkslategray',
                }}
              >
                {' '}
                Coupon Code:{' '}
              </span>
              {couponData?.coupon_code}
            </h5>
            <h5>
              {' '}
              <span style={{ fontWeight: 'bold', color: 'darkslategray' }}>
                Discount Amount:{' '}
              </span>
              {couponData?.discount_amount}
            </h5>
            <h5>
              {' '}
              <span style={{ fontWeight: 'bold', color: 'darkslategray' }}>
                Discount Percentage:{' '}
              </span>
              {couponData?.discount_percentage}
            </h5>
            <h5>
              {' '}
              <span style={{ fontWeight: 'bold', color: 'darkslategray' }}>
                Is Global:{' '}
              </span>
              {couponData?.is_global ? 'True' : 'False'}
            </h5>
            <h5>
              {' '}
              <span style={{ fontWeight: 'bold', color: 'darkslategray' }}>
                Disabled:{' '}
              </span>
              {couponData?.disabled ? 'True' : 'False'}
            </h5>

            <h5>
              {' '}
              <span style={{ fontWeight: 'bold', color: 'darkslategray' }}>
                Min Order:{' '}
              </span>
              {couponData?.min_order_price}
            </h5>

            <h5>
              {' '}
              <span style={{ fontWeight: 'bold', color: 'darkslategray' }}>
                Start Date:{' '}
              </span>
              {formateDate(couponData?.start_date)}
            </h5>

            <h5>
              {' '}
              <span style={{ fontWeight: 'bold', color: 'darkslategray' }}>
                End Date:{' '}
              </span>
              {formateDate(couponData?.end_date)}
            </h5>
            <h5>
              {' '}
              <span style={{ fontWeight: 'bold', color: 'darkslategray' }}>
                ID:{' '}
              </span>
              {couponData?._id}
            </h5>
            {!couponData?.is_global && (
              <>
                {' '}
                <h5>
                  <span style={{ fontWeight: 'bold', color: 'darkslategray' }}>
                    Customer Id:{' '}
                  </span>
                  {couponData?.customer_id?._id}
                </h5>
                <h5>
                  <span style={{ fontWeight: 'bold', color: 'darkslategray' }}>
                    Customer Name:{' '}
                  </span>
                  {couponData?.customer_id?.name}
                </h5>
                <h5>
                  <span style={{ fontWeight: 'bold', color: 'darkslategray' }}>
                    Customer Phone:{' '}
                  </span>
                  {couponData?.customer_id?.phone}
                </h5>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setShow(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    </Dashboard>
  )
}

export default Promotions
