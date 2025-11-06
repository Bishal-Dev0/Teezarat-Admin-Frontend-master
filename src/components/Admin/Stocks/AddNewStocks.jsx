import React, { useEffect } from 'react'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import { Link } from 'react-router-dom'
import Dashboard from '../Dashboard/Dashboard'
import Form from 'react-bootstrap/Form'
import './stocks.scss'
import { Button, Spinner } from 'react-bootstrap'
import { Select, Input } from 'antd'
import axios from 'axios'
import SweetAlert from '../../../lib/sweetalert'
const { Option } = Select

const AddNewStocks = () => {
  const [allStocksToRequest, setAllStocksToRequest] = React.useState([])
  const [vendor, setVendor] = React.useState({
    vendor_name: '',
    vendor_phone: '',
    vendor_address: '',
    total_price: 0,
    paid: 0,
    due: 0,
    payment_method: '',
  })
  const [newStock, setNewStock] = React.useState({
    product_name: '',
    product_id: '',
    quantity: 1,
    buying_price: 1,
  })
  const [addNewForm, setAddNewForm] = React.useState(true)
  const [loadedProducts, setLoadedProducts] = React.useState([])
  const [productSearchKey, setProductsSearchKey] = React.useState('')

  const addToRequestList = () => {
    setShowWarning(false)
    const tempArr = allStocksToRequest

    //finding where the product is existing or new one
    const index = tempArr.findIndex((s) => s.product_id === newStock.product_id)
    if (index > -1) {
      //for existing product
      tempArr[index].quantity += newStock.quantity

      tempArr[index].buying_price = parseFloat(
        ((tempArr[index].buying_price + newStock.buying_price) / 2).toFixed(2)
      )

      setAllStocksToRequest(tempArr)
      setNewStock({
        product_name: '',
        product_id: '',
        quantity: 1,
        buying_price: 1,
      })
      // setAddNewForm(false)

      allStocksToRequest.reduce(
        (total, stock) => total + stock?.buying_price * stock?.quantity,
        0
      )

      setVendor({ ...vendor })
    } else {
      tempArr.push(newStock)
      setAllStocksToRequest(tempArr)
      setNewStock({
        product_name: '',
        product_id: '',
        quantity: 1,
        buying_price: 1,
      })
      // setAddNewForm(false)
    }

    const currentTotal =
      allStocksToRequest.reduce(
        (total, stock) => total + stock?.buying_price * stock?.quantity,
        0
      ) - parseFloat(vendor.paid)

    setVendor({ ...vendor, total_price: parseFloat(currentTotal) })
  }

  const removeFromList = (id) => {
    const filteredArr = allStocksToRequest.filter((dt) => dt?.product_id !== id)
    setAllStocksToRequest(filteredArr)
    const currentTotal =
      filteredArr.reduce(
        (total, stock) => total + stock?.buying_price * stock?.quantity,
        0
      ) - parseFloat(vendor.paid)

    setVendor({ ...vendor, total_price: parseFloat(currentTotal) })
  }

  const [spinner, setSpinner] = React.useState(false)

  useEffect(() => {
    loadProduct()
  }, [productSearchKey])

  const loadProduct = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_BACKEND_URL +
          `/product/admin-get?name=${productSearchKey}
      `
      )
      if (response.status === 200) {
        setLoadedProducts(response.data.data)
      }
    } catch (error) {}
  }

  const handlePurchase = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    setSpinner(true)

    let details = allStocksToRequest
    details.forEach((obj, i) => {
      obj['product_name'] && delete obj['product_name']
    })

    const dataToPost = {
      details,
      ...vendor,
      due: vendor.total_price - vendor.paid,
    }
    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND_URL + '/stock-order/create',
        dataToPost,
        {
          headers: {
            teezarat: localStorage.getItem('token'),
          },
        }
      )
      if (response.status === 200) {
        SweetAlert.success('Success', 'Stock order created successfully!')
        setSpinner(false)
        setVendor({
          vendor_name: '',
          vendor_phone: '',
          vendor_address: '',
          total_price: 0,
          paid: 0,
          due: 0,
          payment_method: '',
        })
        setNewStock({
          product_name: '',
          product_id: '',
          quantity: 1,
          buying_price: 1,
        })
        setAllStocksToRequest([])
        setAddNewForm(true)
        setProductsSearchKey('')
      } else throw new Error(response?.data?.msg || 'Try Again Later!')
    } catch (error) {
      SweetAlert.failed('Failed', error?.data?.msg)
      setSpinner(false)
      setVendor({
        vendor_name: '',
        vendor_phone: '',
        vendor_address: '',
        total_price: 0,
        paid: 0,
        due: 0,
        payment_method: '',
      })
      setNewStock({
        product_name: '',
        product_id: '',
        quantity: 1,
        buying_price: 1,
      })
      setAllStocksToRequest([])
      setAddNewForm(true)
      setProductsSearchKey('')
    }
  }

  const [showWarning, setShowWarning] = React.useState(false)

  return (
    <Dashboard>
      <div className='mt-4 '>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to='/admin/stocks'>stocks</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>add new stock</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <h3>Create New Stock</h3>
      <Form onSubmit={handlePurchase}>
        <Form.Group className='' controlId='formDeliveryName'>
          <Form.Label>Vendor Name</Form.Label>
          <Form.Control
            type='text'
            required
            placeholder='Enter your name'
            value={vendor.vendor_name}
            onChange={(e) => {
              setVendor({ ...vendor, vendor_name: e.target.value })
            }}
          />
          <Form.Label className='mt-2'>Vendor Phone</Form.Label>
          <Form.Control
            type='number'
            required
            placeholder='Enter your phone number'
            value={vendor.vendor_phone}
            onChange={(e) =>
              setVendor({ ...vendor, vendor_phone: e.target.value })
            }
          />
          <Form.Label className='mt-2'>Vendor Address</Form.Label>
          <Form.Control
            type='text'
            required
            placeholder='Enter your address'
            value={vendor.vendor_address}
            onChange={(e) =>
              setVendor({ ...vendor, vendor_address: e.target.value })
            }
          />
        </Form.Group>

        {allStocksToRequest.length > 0 && (
          <div className='my-3'>
            <h5 className='text-center my-4 ' style={{ fontWeight: 'bold' }}>
              List Of Products To Request
            </h5>

            {allStocksToRequest.map((dt, idx) => (
              <div key={idx}>
                <div className=' d-flex  align-items-end justify-content-center mb-2'>
                  <div className='mr-2 w-100'>
                    {idx === 0 && (
                      <h6 style={{ fontWeight: 'bold' }}>Product</h6>
                    )}
                    <p
                      style={{
                        backgroundColor: '#f5f5f5',
                        padding: '.5rem 1rem',
                        fontWeight: 'bold',
                        borderRadius: '4px',
                        border: '1px solid #d9d9d9',
                        width: '100%',
                        margin: '0px ',
                      }}
                    >
                      {idx + 1 + '. '}
                      {dt?.product_name}
                    </p>
                  </div>
                  <div className='mr-2 w-50'>
                    {idx === 0 && (
                      <h6 style={{ fontWeight: 'bold' }}>Quantity</h6>
                    )}
                    <p
                      style={{
                        backgroundColor: '#f5f5f5',
                        padding: '.5rem 1rem',
                        fontWeight: 'bold',
                        borderRadius: '4px',
                        border: '1px solid #d9d9d9',
                        width: '100%',
                        margin: '0px ',
                      }}
                    >
                      {dt?.quantity}
                    </p>
                  </div>

                  <div className='mr-2 w-50'>
                    {idx === 0 && (
                      <h6 style={{ fontWeight: 'bold' }}>Buying Price</h6>
                    )}
                    <p
                      style={{
                        backgroundColor: '#f5f5f5',
                        padding: '.5rem 1rem',
                        fontWeight: 'bold',
                        borderRadius: '4px',
                        border: '1px solid #d9d9d9',
                        width: '100%',
                        margin: '0px ',
                      }}
                    >
                      {dt?.buying_price}
                    </p>
                  </div>
                  <Button
                    className=''
                    style={{ fontWeight: 'bold' }}
                    variant='danger'
                    onClick={() => removeFromList(dt?.product_id)}
                  >
                    REMOVE
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {addNewForm && (
          <div className=' d-flex  align-items-end custom-ant'>
            <div className=' mr-2 '>
              <label>Product</label>
              <br />
              <Select
                size='large'
                showSearch
                placeholder='Select a product'
                value={newStock?.product_name}
                onSelect={(v) => {
                  setNewStock({
                    ...newStock,
                    product_name: v.slice(24),
                    product_id: v.slice(0, 24),
                  })
                }}
                onSearch={(s) => setProductsSearchKey(s)}
                filterOption={false}
              >
                {loadedProducts.length > 0 &&
                  loadedProducts.map((dt, idx) => (
                    <Option value={dt?._id + dt?.product[0]?.name} key={idx}>
                      {dt?.product[0]?.name}
                    </Option>
                  ))}
              </Select>
            </div>

            <div className='mr-2 w-100'>
              <label>Quantity</label> <br />
              <Input
                type='number'
                placeholder={1}
                size='large'
                min={1}
                value={newStock?.quantity}
                onChange={(e) => {
                  setNewStock({
                    ...newStock,
                    quantity: parseInt(e.target.value),
                  })
                }}
              />
            </div>

            <div className='mr-2 w-100 '>
              <label>Buying Price</label> <br />
              <Input
                type='number'
                placeholder={1}
                size='large'
                min={1}
                value={newStock?.buying_price}
                onChange={(e) =>
                  setNewStock({
                    ...newStock,
                    buying_price: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <Button
              className='ml-2'
              onClick={
                newStock.product_id
                  ? () => addToRequestList()
                  : () => setShowWarning(true)
              }
            >
              ADD
            </Button>

            {/* <Button
              className='ml-2'
              style={{ fontWeight: 'bold' }}
              variant='danger'
              onClick={() => {
                setAddNewForm(false)
                setShowWarning(false)
              }}
            >
              CANCEL
            </Button> */}
          </div>
        )}
        {showWarning && (
          <p className='text-danger'>
            Select a valid product to add in request list
          </p>
        )}

        {/* <Button
          className=' d-flex justify-content-center align-items-center  my-2'
          onClick={() => setAddNewForm(true)}
          style={{ height: '1.9rem' }}
        >
          <img className='mr-3' src='/assets/+.png' alt='' />
          Add New
        </Button> */}

        {allStocksToRequest.length > 0 && (
          <div>
            <div className='d-flex justify-content-between align-items-center mt-3 '>
              <h6 style={{ fontWeight: 'bold', marginBottom: '0px' }}>Paid</h6>
              <Form.Group className='' controlId='formDeliveryName'>
                <Form.Control
                  style={{ height: '2rem', textAlign: 'right' }}
                  min={0}
                  type='number'
                  placeholder={0}
                  value={vendor.paid}
                  onChange={(e) => {
                    setVendor({
                      ...vendor,
                      paid: parseFloat(e.target.value || 0),
                    })
                  }}
                />
              </Form.Group>
            </div>

            <div className='d-flex justify-content-between align-items-center '>
              <h6 style={{ fontWeight: 'bold' }}>Payment Method</h6>
              <Form.Group className='' controlId='formDeliveryName'>
                <Form.Control
                  style={{ height: '2rem', textAlign: 'right' }}
                  type='text'
                  placeholder='e.g: online payment / cash'
                  value={vendor.payment_method}
                  onChange={(e) => {
                    setVendor({ ...vendor, payment_method: e.target.value })
                  }}
                />
              </Form.Group>
            </div>

            <div className='d-flex justify-content-between align-items-center '>
              <h6 style={{ fontWeight: 'bold' }}>Due</h6>
              <h6 style={{ fontWeight: 'bold' }}>
                BDT{' '}
                {allStocksToRequest.length > 0
                  ? allStocksToRequest.reduce(
                      (total, stock) =>
                        total + stock?.buying_price * stock?.quantity,
                      0
                    ) - vendor.paid
                  : 0}
              </h6>
            </div>

            <div className='d-flex justify-content-between align-items-center '>
              <h5 style={{ fontWeight: 'bold' }}>Total Price</h5>
              <h5 style={{ fontWeight: 'bold' }}>BDT {vendor.total_price}</h5>
            </div>
          </div>
        )}

        {allStocksToRequest.length > 0 && (
          <Button
            className='w-100 d-flex justify-content-center align-items-center'
            type='submit'
          >
            COMPLETE PURCHASE{' '}
            {spinner && (
              <Spinner animation='border' size='sm' className='ml-2' />
            )}
          </Button>
        )}
      </Form>
    </Dashboard>
  )
}

export default AddNewStocks
