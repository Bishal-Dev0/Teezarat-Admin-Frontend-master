import React, { useEffect } from 'react'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import { Link } from 'react-router-dom'
import Dashboard from '../Dashboard/Dashboard'
import Form from 'react-bootstrap/Form'
import '../Stocks/stocks.scss'
import { Button, Spinner } from 'react-bootstrap'
import { Select, Input } from 'antd'
import axios from 'axios'
import SweetAlert from '../../../lib/sweetalert'
const { Option } = Select

const AdNewOrder = () => {
  const [createdNewOrder, setCreatedNewOrder] = React.useState([])
  const [customer, setCustomer] = React.useState({
    customer_name: '',
    customer_phone: '',
    address: '',
    note: '',
    customer_email: '',
    total_price: 0,
    paid: 0,
    due: 0,
    payment_method: 'cash',
    coupon_code: '',
  })
  const [newOrder, setNewOrder] = React.useState({
    product_name: '',
    product_id: '',
    quantity: 1,
    selling_price: 0,
  })
  const [addNewForm, setAddNewForm] = React.useState(true)
  const [loadedProducts, setLoadedProducts] = React.useState([])
  const [productSearchKey, setProductsSearchKey] = React.useState('')
  const [showWarning, setShowWarning] = React.useState(false)
  const [customers, setCustomers] = React.useState([])
  const [customerNameSearch, setCustomerNameSearch] = React.useState('')
  const [searchStatus, setSearchStatus] = React.useState(false)

  const addToRequestList = () => {
    setShowWarning(false)
    const tempArr = createdNewOrder

    //finding where the product is existing or new one
    const index = tempArr.findIndex((s) => s.product_id === newOrder.product_id)
    if (index > -1) {
      //for existing product
      tempArr[index].quantity += newOrder.quantity

      tempArr[index].selling_price = parseFloat(
        ((tempArr[index].selling_price + newOrder.selling_price) / 2).toFixed(2)
      )

      setCreatedNewOrder(tempArr)
      setNewOrder({
        product_name: '',
        product_id: '',
        quantity: 1,
        selling_price: 0,
      })
      // setAddNewForm(false)

      createdNewOrder.reduce(
        (total, stock) => total + stock?.selling_price * stock?.quantity,
        0
      )

      setCustomer({ ...customer })
    } else {
      tempArr.push(newOrder)
      setCreatedNewOrder(tempArr)
      setNewOrder({
        product_name: '',
        product_id: '',
        quantity: 1,
        selling_price: 0,
      })
      // setAddNewForm(false)
    }

    const currentTotal =
      createdNewOrder.reduce(
        (total, stock) => total + stock?.selling_price * stock?.quantity,
        0
      ) - parseFloat(customer.paid)

    setCustomer({ ...customer, total_price: parseFloat(currentTotal) })
  }

  const removeFromList = (id) => {
    const filteredArr = createdNewOrder.filter((dt) => dt?.product_id !== id)
    setCreatedNewOrder(filteredArr)
    const currentTotal =
      filteredArr.reduce(
        (total, stock) => total + stock?.selling_price * stock?.quantity,
        0
      ) - parseFloat(customer.paid)

    setCustomer({ ...customer, total_price: parseFloat(currentTotal) })
  }

  const [spinner, setSpinner] = React.useState(false)

  useEffect(() => {
    loadProduct()
  }, [productSearchKey])

  const loadProduct = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_BACKEND_URL +
          `/product/get?name=${productSearchKey}
      `
      )
      if (response.status === 200) {
        setLoadedProducts(response.data.data)
      }
    } catch (error) {}
  }

  const handleNewOrder = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    setSpinner(true)

    let details = []

    createdNewOrder.forEach((obj, i) => {
      let temp = {
        product_id: obj?.product_id,
        quantity: obj?.quantity,
      }
      details.push(temp)
    })
    let dataToPost = {
      details,
      ...customer,
    }

    dataToPost?.total_price && delete dataToPost?.total_price
    delete dataToPost?.paid
    delete dataToPost?.due

    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND_URL + '/order/create_by_admin',
        dataToPost,
        {
          headers: {
            teezarat: localStorage.getItem('token'),
          },
        }
      )
      if (response.status === 200) {
        SweetAlert.success('Success', 'Order Placed Successfully!')
        setSpinner(false)
        setCustomerNameSearch('')
        setCustomer({
          customer_name: '',
          customer_phone: '',
          address: '',
          note: '',
          customer_email: '',
          total_price: 0,
          paid: 0,
          due: 0,
          payment_method: 'cash',
          coupon_code: '',
        })
        setNewOrder({
          product_name: '',
          product_id: '',
          quantity: 1,
          selling_price: 0,
        })
        setCreatedNewOrder([])
        setAddNewForm(true)
        setProductsSearchKey('')
      } else throw new Error(response?.data?.msg || 'Try Again Later!')
    } catch (error) {
      SweetAlert.failed('Failed', error?.response?.data?.msg)
      setSpinner(false)

      setProductsSearchKey('')
    }
  }

  React.useEffect(() => {
    loadCustomers()
  }, [customerNameSearch])

  const loadCustomers = async () => {
    setSearchStatus(true)
    let url = process.env.REACT_APP_BACKEND_URL + `/customer/get`
    if (customerNameSearch.length > 0) {
      url += `?filter=${customerNameSearch}`
    }
    try {
      const response = await axios.get(url, {
        headers: {
          teezarat: `${localStorage.getItem('token')}`,
        },
      })
      if (response.status === 200) {
        setCustomers(response?.data?.data?.data)
        setSearchStatus(false)
      }
    } catch (error) {
      setSearchStatus(false)
    }
  }

  const handleSelect = (v) => {
    setCustomer({
      ...customer,
      customer_name: '',
      customer_phone: '',
      address: '',
      customer_email: '',
    })
    if (customers.length > 0) {
      for (const c of customers) {
        if (c?._id === v.slice(0, 24)) {
          setCustomer({
            ...customer,
            customer_name: c?.name,
            customer_phone: c?.phone || '',
            customer_email: c?.email || '',
            address: c?.address || '',
          })
          return
        }
      }
    } else {
      setCustomer({
        ...customer,
        customer_name: customerNameSearch,
        customer_phone: '',
        address: '',
        customer_email: '',
      })
    }
  }
  return (
    <Dashboard>
      <div className='mt-4 '>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to='/admin/orders'>Orders</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Create New Order</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <h3>Create New Order</h3>
      <Form onSubmit={handleNewOrder}>
        <div className=''>
          <div className='mb-2'>
            <label>Name</label>
            <br />
            <Select
              size='large'
              showSearch
              filterOption={false}
              placeholder='Select a customer or select the entered name'
              value={customer?.name}
              onSelect={(v) => handleSelect(v)}
              onSearch={(s) => {
                setCustomerNameSearch(s)
              }}
              className='w-100'
            >
              {/* {!setSearchStatus &&
                customers.length === 0 &&
                customerNameSearch && (
                  <Option value={customerNameSearch}>
                    {customerNameSearch}
                  </Option>
                )} */}
              {!searchStatus && customers.length > 0 && customerNameSearch
                ? customers.map((dt, idx) => (
                    <Option value={dt?._id + dt?.name} key={dt?._id}>
                      {dt?.name}
                    </Option>
                  ))
                : !searchStatus &&
                  customerNameSearch && (
                    <Option value={customerNameSearch}>
                      {customerNameSearch}
                    </Option>
                  )}
            </Select>
          </div>
        </div>
        <Form.Group className='' controlId='formDeliveryName'>
          <Form.Label className='mt-2'>Customer Email</Form.Label>
          <Form.Control
            type='text'
            // required
            placeholder='Enter customer email'
            value={customer.customer_email}
            onChange={(e) => {
              setCustomer({ ...customer, customer_email: e.target.value })
            }}
          />
          <Form.Label className='mt-2'>Customer Phone*</Form.Label>
          <Form.Control
            type='text'
            required
            placeholder='Enter your phone number'
            value={customer.customer_phone}
            onChange={(e) =>
              setCustomer({ ...customer, customer_phone: e.target.value })
            }
          />
          <Form.Label className='mt-2'>Customer Address*</Form.Label>
          <Form.Control
            type='text'
            required
            placeholder='Enter your address'
            value={customer.address}
            onChange={(e) =>
              setCustomer({ ...customer, address: e.target.value })
            }
          />
          <Form.Label className='mt-2'>Customer Note</Form.Label>
          <Form.Control
            type='text'
            as='textarea'
            rows={3}
            placeholder='Enter customer note'
            value={customer.note}
            onChange={(e) => setCustomer({ ...customer, note: e.target.value })}
          />
        </Form.Group>

        {createdNewOrder.length > 0 && (
          <div className='my-3'>
            <h5 className='text-center my-4 ' style={{ fontWeight: 'bold' }}>
              List Of Products
            </h5>

            {createdNewOrder.map((dt, idx) => (
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
                      <h6 style={{ fontWeight: 'bold' }}>Unit Price</h6>
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
                      {dt?.selling_price}
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
                // optionFilterProp='children'
                value={newOrder?.product_name}
                onSelect={(v) => {
                  setNewOrder({
                    ...newOrder,
                    product_name: v.slice(30),
                    product_id: v.slice(6, 30),
                    selling_price: loadedProducts.find(
                      (dt) => dt?._id === v.slice(6, 30)
                    )?.discount_price,
                  })
                }}
                onSearch={(s) => setProductsSearchKey(s)}
                filterOption={false}
              >
                {loadedProducts.map((dt, idx) => {
                  return (
                    <Option value={dt.short_id + dt?._id + dt.name} key={idx}>
                      {dt?.name}
                    </Option>
                  )
                })}
              </Select>
            </div>

            <div className='mr-2 w-100'>
              <label>Quantity</label> <br />
              <Input
                type='number'
                placeholder={1}
                size='large'
                min={1}
                value={newOrder?.quantity}
                onChange={(e) => {
                  setNewOrder({
                    ...newOrder,
                    quantity: parseInt(e.target.value),
                  })
                }}
              />
            </div>

            <div className='mr-2 w-100 '>
              <label>Unit Price</label> <br />
              <Input
                type='number'
                placeholder={1}
                size='large'
                disabled={true}
                min={1}
                value={newOrder?.selling_price}
                // onChange={(e) =>
                //   setNewOrder({
                //     ...newOrder,
                //     selling_price: parseInt(e.target.value),
                //   })
                // }
              />
            </div>

            <Button
              className='ml-2'
              onClick={
                newOrder.product_id
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
            Select a valid product to add in order list
          </p>
        )}
        {/* 
        <Button
          className=' d-flex justify-content-center align-items-center  my-2'
          onClick={() => setAddNewForm(true)}
          style={{ height: '1.9rem' }}
        >
          <img className='mr-3' src='/assets/+.png' alt='' />
          Add New
        </Button> */}

        {createdNewOrder.length > 0 && (
          <div>
            <div className='d-flex justify-content-between align-items-center mt-4'>
              <h6 style={{ fontWeight: 'bold' }}>Coupon</h6>
              <Form.Group className='' controlId='formDeliveryName'>
                <Form.Control
                  style={{ height: '2rem', textAlign: 'right' }}
                  type='text'
                  placeholder='enter coupon code'
                  value={customer.coupon_code}
                  onChange={(e) => {
                    setCustomer({ ...customer, coupon_code: e.target.value })
                  }}
                />
              </Form.Group>
            </div>

            <div className='d-flex justify-content-between align-items-center '>
              <h6 style={{ fontWeight: 'bold' }}>Payment Method*</h6>
              <Form.Group className='' controlId='formDeliveryName'>
                <Form.Control
                  style={{ height: '2rem', textAlign: 'right' }}
                  type='text'
                  placeholder='e.g: online payment / cash'
                  value={customer.payment_method}
                  required
                  onChange={(e) => {
                    setCustomer({ ...customer, payment_method: e.target.value })
                  }}
                />
              </Form.Group>
            </div>

            {/* <div className='d-flex justify-content-between align-items-center '>
              <h6 style={{ fontWeight: 'bold' }}>Due</h6>
              <h6 style={{ fontWeight: 'bold' }}>
                BDT{' '}
                {createdNewOrder.length > 0
                  ? createdNewOrder.reduce(
                      (total, stock) =>
                        total + stock?.selling_price * stock?.quantity,
                      0
                    ) - customer.paid
                  : 0}
              </h6>
            </div> */}

            <div className='d-flex justify-content-between align-items-center '>
              <h5 style={{ fontWeight: 'bold' }}>Total Price</h5>
              <h5 style={{ fontWeight: 'bold' }}>BDT {customer.total_price}</h5>
            </div>
          </div>
        )}

        {createdNewOrder.length > 0 && (
          <Button
            className='w-100 mb-5 d-flex justify-content-center align-items-center'
            type='submit'
          >
            COMPLETE ORDER{' '}
            {spinner && (
              <Spinner animation='border' size='sm' className='ml-2' />
            )}
          </Button>
        )}
      </Form>
    </Dashboard>
  )
}

export default AdNewOrder
