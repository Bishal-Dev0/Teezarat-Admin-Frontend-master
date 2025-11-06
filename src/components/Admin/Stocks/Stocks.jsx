import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Button, Modal, Spinner, Table } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import SweetAlert from '../../../lib/sweetalert'
import Dashboard from '../Dashboard/Dashboard'
import EditStockModal from './EditStockModal'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import Pagination from 'react-js-pagination'

const Stocks = () => {
  let history = useHistory()

  const [allStocks, setAllStocks] = useState([])
  const [spin, setSpin] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(1)
  useEffect(() => {
    getAllStocks()
  }, [search, page])

  const getAllStocks = async () => {
    setSpin(true)

    let url =
      process.env.REACT_APP_BACKEND_URL + `/stock-order/get?page=${page}`
    if (search.length > 0) {
      url += `&filter=${search}`
      setPage(1)
    }
    try {
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          teezarat: `${localStorage.getItem('token')}`,
        },
      })

      if (response.status === 200) {
        setAllStocks(response?.data?.data?.data)
        setCount(response?.data?.data?.total_document)

        setSpin(false)
      } else
        throw new Error(
          response?.data?.msg || 'Something went wrong! Try again later.'
        )
    } catch (error) {
      SweetAlert.failed('Failed', error?.data?.msg)

      setSpin(false)
    }
  }

  const [show, setShow] = useState(false)
  const [stockDetails, setStockDetails] = useState({})
  const handleClick = (vendor) => {
    setStockDetails(vendor)
    setShow(true)
  }

  const [editStockOrder, setEditStockOrder] = useState(false)
  const [editData, setEdiData] = useState({})

  const dateOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }
  return (
    <Dashboard>
      <div className='mt-4'>
        <div
          className='d-flex justify-content-end align-items-center flex-wrap'
          style={{ marginTop: '35px' }}
        >
          <h4 className=''>Stocks</h4>
          <span className='ml-auto'>
            <Button
              className=' d-flex justify-content-center align-items-center  my-2'
              onClick={() => history.push('/admin/stocks/add-new-stocks')}
            >
              <img className='mr-3' src='/assets/+.png' alt='' /> New Stock
              Purchase
            </Button>
          </span>
        </div>

        <div className='upper'>
          <div>
            <h5>Search</h5>
            <span>
              <input
                type='text'
                placeholder='Search by name '
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <FontAwesomeIcon icon={faSearch} />
            </span>
          </div>
        </div>

        <div>
          {!spin ? (
            <Table
              responsive
              bordered
              hover
              striped
              style={{ background: '#FFFEF0', textAlign: 'center' }}
              className='my-5'
            >
              <thead>
                <tr style={{ width: '100%' }}>
                  <th>Date</th>
                  <th>Vendor</th>
                  <th>Phone</th>
                  <th>Due</th>
                  <th>Paid </th>
                  <th>Total </th>
                  <th>Payment Method</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allStocks.length > 0 &&
                  allStocks.map((vendor, idx) => (
                    <tr key={idx} style={{ width: '100%' }}>
                      <td onClick={() => handleClick(vendor)}>
                        {new Date(vendor?.createdAt).toLocaleDateString(
                          'en-GB',
                          dateOptions
                        )}
                      </td>
                      <td onClick={() => handleClick(vendor)}>
                        {vendor?.vendor_name}
                      </td>
                      <td onClick={() => handleClick(vendor)}>
                        {vendor?.vendor_phone}
                      </td>

                      <td onClick={() => handleClick(vendor)}>{vendor?.due}</td>
                      <td onClick={() => handleClick(vendor)}>
                        {vendor?.paid}
                      </td>
                      <td onClick={() => handleClick(vendor)}>
                        {vendor?.total_price}
                      </td>
                      <td onClick={() => handleClick(vendor)}>
                        {vendor?.payment_method}
                      </td>
                      <td>
                        <Button
                          onClick={() => {
                            setEditStockOrder(true)
                            setEdiData(vendor)
                          }}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          ) : (
            <div className='mx-auto  my-5 py-5 text-center'>
              <Spinner animation='border' role='status' />
            </div>
          )}
        </div>
        {!spin && allStocks.length > 0 && (
          <div className='pagination'>
            <Pagination
              activePage={page}
              itemsCountPerPage={10}
              totalItemsCount={count}
              onChange={setPage}
              nextPageText={'>'}
              prevPageText={'<'}
              firstPageText={'First'}
              lastPageText={'Last'}
              itemClass='page-item'
              linkClass='page-link'
            />
          </div>
        )}
      </div>

      <EditStockModal
        show={editStockOrder}
        onClose={() => setEditStockOrder(false)}
        data={editData}
        getAllStocks={getAllStocks}
      />

      <Modal show={show} onHide={() => setShow(false)} size='lg'>
        <Modal.Header>
          <h3 style={{ fontWeight: 'bold', color: 'darkslategray' }}>
            Stock Order Details
          </h3>
        </Modal.Header>
        <Modal.Body
          style={{
            border: 'none',
            borderRadius: '4px',
          }}
        >
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
              Vendor Name:{' '}
            </span>
            {stockDetails?.vendor_name}
          </h5>

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
              Vendor Phone:{' '}
            </span>
            {stockDetails?.vendor_phone}
          </h5>
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
              Address:{' '}
            </span>
            {stockDetails?.vendor_address}
          </h5>

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
              verified:{' '}
            </span>
            {stockDetails?.verified ? 'Yes' : 'No'}
          </h5>
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
              Id:{' '}
            </span>
            {stockDetails?._id}
          </h5>
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
              Created At:{' '}
            </span>
            {stockDetails?.createdAt?.substr(0, 10)}
          </h5>
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
              Updated At:{' '}
            </span>
            {stockDetails?.updatedAt?.substr(0, 10)}
          </h5>
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
              Total Price:{' '}
            </span>
            {stockDetails?.total_price}
          </h5>
          <h5>
            <span
              style={{
                fontWeight: 'bold',
                width: '20%',
                color: 'darkslategray',
              }}
            >
              Details:{' '}
            </span>
          </h5>
          <div className='mt-3'>
            <Table
              responsive
              bordered
              hover
              striped
              style={{ background: '#FFFEF0', textAlign: 'center' }}
            >
              <thead>
                <tr style={{ width: '100%' }}>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Price(BDT)</th>
                </tr>
              </thead>
              <tbody>
                {stockDetails?.details?.map((d, idx) => (
                  <tr>
                    <td>{d?.product_id?.name}</td>
                    <td>{d?.quantity}</td>
                    <td>{d?.buying_price}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Dashboard>
  )
}

export default Stocks
