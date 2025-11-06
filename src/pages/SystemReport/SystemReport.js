import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Spinner } from 'react-bootstrap'
import Dashboard from '../../components/Admin/Dashboard/Dashboard'
import SweetAlert from '../../lib/sweetalert'

const SystemReport = () => {
  const [report, setReport] = useState({})
  const [date, setDate] = useState({
    from: '2025-01-01',
    till: new Date().toISOString().slice(0, 10),
  })

  const [spinner, setSpinner] = useState(false)
  useEffect(() => {
    loadReport()
  }, [date])

  const loadReport = async () => {
    setSpinner(true)

    try {
      const res = await axios.get(
        process.env.REACT_APP_BACKEND_URL + `/report/get?from=${date?.from}&till=${date?.till}`,
        {
          headers: {
            teezarat: localStorage.getItem('token'),
          },
        }
      )

      if (res?.status === 200) {
        setReport(res?.data?.data)
        setSpinner(false)
      } else throw new Error(res?.data?.msg || 'Failed to load data.')
    } catch (error) {
      setSpinner(false)
      SweetAlert.failed(error?.response?.data?.msg || 'Failed to load data.')
    }
  }

  return (
    <Dashboard>
      <div className='mt-4 '>
        <div className='row'>
          <div className='col pl-0'>
            <label>From</label>
            <input
              type='date'
              value={date?.from}
              className='form-control'
              onChange={(e) => setDate({ ...date, from: e.target.value })}
            />
          </div>
          <div className='col px-0'>
            <label>Till</label>
            <input
              type='date'
              value={date?.till}
              className='form-control'
              onChange={(e) => {
                setDate({ ...date, till: e.target.value })
              }}
            />
          </div>
        </div>
        <div
          className='my-5'
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.08)',
            borderRadius: '8px',
          }}
        >
          <h4
            className='px-4 pt-4 pb-3 '
            style={{
              fontWeight: 'bold',
              color: '#333333',
              borderBottom: '1px solid #CCCCCC',
            }}
          >
            System Report
          </h4>
          {spinner ? (
            <div className='mx-auto text-center my-5 py-5'>
              <Spinner animation='border' />
            </div>
          ) : report ? (
            <div>
              <div className=' d-flex justify-content-between align-items-center px-4 pt-2 row'>
                <h5 className='col-9' style={{ color: '#333333', fontWeight: 'bold' }}>
                  New Customers{' '}
                </h5>

                <h5 className='col-3 text-end pe-4' style={{ color: '#333333', fontWeight: 'bold' }}>
                  {report?.customer}
                </h5>
              </div>
              <div className='d-flex justify-content-between align-items-center px-4 row'>
                <h5 className='col-9' style={{ color: '#333333', fontWeight: 'bold' }}>
                  Total Orders{' '}
                </h5>

                <h5 className='col-3 text-end pe-4' style={{ color: '#333333', fontWeight: 'bold' }}>
                  {report?.order}
                </h5>
              </div>
              <div className='d-flex justify-content-between align-items-center px-4  row'>
                <h5 className='col-9' style={{ color: '#333333', fontWeight: 'bold' }}>
                  Delivered Orders{' '}
                </h5>

                <h5 className='col-3 text-end pe-4' style={{ color: '#333333', fontWeight: 'bold' }}>
                  {report?.delivered_order}
                </h5>
              </div>

              <div className=' d-flex justify-content-between align-items-center px-4  row'>
                <h5 className='col-9' style={{ color: '#333333', fontWeight: 'bold' }}>
                  Failed Orders
                </h5>

                <h5 className='col-3 text-end pe-4' style={{ color: '#333333', fontWeight: 'bold' }}>
                  {report?.failed_order}
                </h5>
              </div>

              <div className=' d-flex justify-content-between align-items-center px-4 row'>
                <h5 className='col-9' style={{ color: '#333333', fontWeight: 'bold' }}>
                  Total New Products
                </h5>

                <h5 className='col-3 text-end pe-4' style={{ color: '#333333', fontWeight: 'bold' }}>
                  {report?.product}
                </h5>
              </div>
              <div className='d-flex justify-content-between align-items-center px-4 row'>
                <h5 className='col-9' style={{ color: '#333333', fontWeight: 'bold' }}>
                  Number of Stock Purchases
                </h5>

                <h5 className='col-3 text-end pe-4' style={{ color: '#333333', fontWeight: 'bold' }}>
                  {report?.total_stock_order}
                </h5>
              </div>
              <div className=' d-flex justify-content-between align-items-center px-4 row'>
                <h5 className='col-9' style={{ color: '#333333', fontWeight: 'bold' }}>
                  Stock Purchased (BDT)
                </h5>
                <h5 className='col-3 text-end pe-4' style={{ color: '#333333', fontWeight: 'bold' }}>
                  {report?.total_stock_purchase_taka} BDT
                </h5>
              </div>
              <div className=' d-flex justify-content-between align-items-center px-4 row'>
                <h5 className='col-9' style={{ color: '#333333', fontWeight: 'bold' }}>
                  Current Stock (BDT)
                </h5>
                <h5 className='col-3 text-end pe-4' style={{ color: '#333333', fontWeight: 'bold' }}>
                  {report?.currently_in_stock_taka} BDT
                </h5>
              </div>
              <div className='d-flex justify-content-between align-items-center px-4 row'>
                <h5 className='col-9' style={{ color: '#333333', fontWeight: 'bold' }}>
                  Sales Revenue (BDT){' '}
                </h5>

                <h5 className='col-3 text-end pe-4' style={{ color: '#333333', fontWeight: 'bold' }}>
                  {report?.total_sales}
                </h5>
              </div>
            </div>
          ) : (
            <h5 className='text-center my-5 text-muted'>No report found! </h5>
          )}
        </div>
      </div>
    </Dashboard>
  )
}

export default SystemReport
