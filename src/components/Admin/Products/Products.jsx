import { faSearch, faDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Button, Table, Spinner, Modal } from 'react-bootstrap'
import AddNewProductModal from '../../../pages/AddNewProductModal/AddNewProductModal'
import EditProduct from '../../../pages/EditProduct/EditProduct'
import Dashboard from '../Dashboard/Dashboard'
import './Product.scss'
import Pagination from 'react-js-pagination'
import Barcode from 'react-barcode'
import { useAuth } from '../../../Provider/AuthProvider'
import ReactToPrint from 'react-to-print'
import { useRef } from 'react'
import PrintProductBarCode from './PrintProductBarCode'

const Products = () => {
  const auth = useAuth()
  const componentRef = useRef()

  const [products, setProducts] = useState([])
  const [pageNumber, setPageNumber] = useState(1)
  const [btn, setBtn] = useState(true)
  const [show, setShow] = useState(false)
  const [search, setSearch] = useState('')
  const [max, setMax] = useState('')
  const [min, setMin] = useState('')
  const [disability, setDisability] = useState('')
  const [sort, setSort] = useState('')
  const [totalProductCount, setTotalProductCount] = useState(0)
  const [allCate, setAllCate] = useState([])
  const [categorySelect, setCategorySelect] = useState('')

  const allProducts = async () => {
    setBtn(true)
    let url =
      process.env.REACT_APP_BACKEND_URL +
      `/product/admin-get?page=${pageNumber}`

    if (min.length > 0) url += `&min_price=${min}`
    if (max.length > 0) url += `&max_price=${max}`
    if (search.length > 0) {
      setPageNumber(1)
      url += `&name=${search}`
    }
    if (sort.length > 0) url += `&sort=${sort}`
    if (disability.length > 0) url += `&disable=${disability}`
    if (categorySelect.length > 0) {
      setPageNumber(1)
      url += `&category_id=${categorySelect}`
    }

    try {
      const res = await fetch(url, {
        method: 'GET',
      })
      const data = await res.json()

      setBtn(false)
      setProducts(data.data)

      setTotalProductCount(data.total_product)
    } catch (err) {
      setBtn(false)
    }
  }

  useEffect(() => {
    allProducts()
  }, [search, min, max, sort, disability, pageNumber, categorySelect])

  const [productData, setProductData] = useState({
    product: [
      {
        _id: null,
        category_id: null,
        disable: null,
        name: '',
        price: null,
        discount_price: null,
        unit: null,
        description: '',
        short_id: null,
        stock: null,
        photo: [],
      },
    ],
  })

  const getAllCategory = () => {
    fetch(process.env.REACT_APP_BACKEND_URL + '/category/get')
      .then((res) => res.json())
      .then((data) => {
        setAllCate(data?.data)
      })
  }

  useEffect(() => {
    getAllCategory()
  }, [])

  const handleClick = (product) => {
    setShow(true)
    setProductData(product)
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
      <div>
        <div>
          <div
            className='d-flex justify-content-end align-items-center flex-wrap'
            style={{ marginTop: '25px' }}
          >
            <h4>Products</h4>
            <span className='ml-auto'>
              <AddNewProductModal className='ml-auto' allProducts={allProducts}>
                <Button className=' d-flex justify-content-center align-items-center  my-2'>
                  <img className='mr-3' src='/assets/+.png' alt='' /> New
                  Product
                </Button>
              </AddNewProductModal>
            </span>
          </div>

          <div>
            <div className='inputGroup'>
              <div>
                <h5>Search</h5>
                <span>
                  <input
                    type='text'
                    placeholder='Search by Product Name, Description'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <FontAwesomeIcon icon={faSearch} />
                </span>
              </div>
            </div>
            <div className='lowerGroup mb-4'>
              <div>
                <h5>Min</h5>
                <span>
                  <input
                    type='text'
                    placeholder='Min Price'
                    value={min}
                    onChange={(e) => setMin(e.target.value)}
                  />
                </span>
              </div>
              <div>
                <h5>Max</h5>
                <span>
                  <input
                    type='text'
                    placeholder='Max Price'
                    value={max}
                    onChange={(e) => setMax(e.target.value)}
                  />
                </span>
              </div>

              <div>
                <h5>Disability</h5>
                <select
                  value={disability}
                  onChange={(e) => setDisability(e.target.value)}
                  style={{ cursor: 'pointer' }}
                >
                  <option value=''>Show All</option>
                  <option value='true'>Yes</option>
                  <option value='false'>No</option>
                </select>
              </div>
              <div>
                <h5>Sort By</h5>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  style={{ cursor: 'pointer' }}
                >
                  <option hidden>Show All</option>
                  <option value='name_ascending'>Name ascending</option>
                  <option value='name_descending'>Name descending</option>
                  <option value='price_ascending'>Price ascending</option>
                  <option value='price_descending'>Price descending</option>
                  <option value='sales_ascending'>Sales ascending</option>
                  <option value='sales_descending'>Sales descending</option>
                  <option value='stock_ascending'>Stock ascending</option>
                  <option value='stock_descending'>Stock descending</option>
                </select>
              </div>
              <div>
                <h5>Category</h5>
                <select
                  className='form-select form-control'
                  onChange={(e) => setCategorySelect(e.target.value)}
                >
                  <option value=''>all categories</option>
                  {allCate &&
                    allCate?.map((c, i) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            {!btn ? (
              <div>
                {products.length > 0 ? (
                  <div>
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
                          <th>Unit</th>
                          <th>Price/Unit</th>
                          <th>Discount Price</th>
                          <th>Image</th>
                          {auth?.user?.effective_role === 'super_admin' && (
                            <th>Stock</th>
                          )}
                          <th>Total Sale</th>
                          <th>Disable</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((pd) => {
                          return (
                            <tr key={pd._id} style={{ width: '100%' }}>
                              <td
                                onClick={() => handleClick(pd)}
                                style={{ width: '15%' }}
                              >
                                {pd?.product[0]?.name}
                              </td>
                              <td
                                onClick={() => handleClick(pd)}
                                style={{ width: '10%' }}
                              >
                                {pd?.product[0]?.unit}
                              </td>
                              <td
                                onClick={() => handleClick(pd)}
                                style={{ width: '10%' }}
                              >
                                {pd?.product[0]?.price}
                              </td>
                              <td
                                onClick={() => handleClick(pd)}
                                style={{ width: '10%' }}
                              >
                                {pd?.product[0]?.discount_price}
                              </td>

                              <td
                                onClick={() => handleClick(pd)}
                                style={{ width: '10%' }}
                              >
                                {pd?.product[0]?.photo ? 'Yes' : 'N/A'}
                                {/* {pd?.product[0]?.photo ? 'Yes' : 'No'} */}
                              </td>
                              {auth?.user?.effective_role === 'super_admin' && (
                                <td
                                  onClick={() => handleClick(pd)}
                                  style={{ width: '10%' }}
                                >
                                  {pd?.product[0]?.stock}
                                </td>
                              )}
                              <td
                                onClick={() => handleClick(pd)}
                                style={{ width: '10%' }}
                              >
                                {pd?.total_sale}
                              </td>
                              <td
                                onClick={() => handleClick(pd)}
                                style={{ width: '10%' }}
                              >
                                {pd?.product[0]?.disable === true
                                  ? 'Yes'
                                  : 'No'}
                              </td>
                              <td>
                                <EditProduct
                                  product={pd}
                                  allProducts={allProducts}
                                >
                                  <Button className=''>Update</Button>
                                </EditProduct>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <h2 className='m-5 text-center text-muted'>
                    No Product Found
                  </h2>
                )}
              </div>
            ) : (
              <div className='mx-auto  my-5 py-5 text-center'>
                <Spinner animation='border' role='status'></Spinner>
              </div>
            )}

            {!btn && products.length > 0 && (
              <div className='pagination m-auto'>
                <Pagination
                  activePage={pageNumber}
                  itemsCountPerPage={10}
                  totalItemsCount={totalProductCount}
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
          </div>
        </div>
      </div>
      <Modal
        centered
        show={show}
        onHide={() => setShow(false)}
        size={productData?.product[0]?.name.length >= 20 ? 'lg' : 'md'}
      >
        <Modal.Body
          style={{
            backgroundColor: '#fffef0',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          <div className='d-flex justify-content-between align-items-center'>
            <img
              src={productData?.product[0]?.photo[0]}
              alt=''
              height='180px'
              width='180px'
              className='mb-3'
            />

            <div>
              <div
                style={{ backgroundColor: 'white' }}
                className='px-3 pt-3 pb-0 text-center'
              >
                <h5 className='m-0 text-center ' style={{ fontWeight: 'bold' }}>
                  {productData?.product[0]?.name}
                </h5>
                <p className='m-0 text-center' style={{ fontWeight: 'bold' }}>
                  BDT {productData?.product[0]?.discount_price} /{' '}
                  {productData?.product[0]?.unit}
                </p>
                <Barcode value={productData?.product[0]?.short_id} />
              </div>

              <ReactToPrint
                trigger={() => (
                  <button
                    onClick={() => setPrintData(productData)}
                    style={{
                      padding: '.25rem 1rem',
                      background: '#fe7f00',
                      color: 'white',
                      fontWeight: 'bold',
                      border: 'none',
                      borderRadius: '4px',
                      width: '210px',
                    }}
                    className='mx-auto mb-3 d-flex justify-content-center align-items-center'
                  >
                    Print
                    <FontAwesomeIcon icon={faDownload} className='ml-2' />
                  </button>
                )}
                content={() => componentRef.current}
              />
              <div style={{ display: 'none' }}>
                <PrintProductBarCode
                  ref={componentRef}
                  data={productData}
                  documentTitle='Teezarat-users-data'
                />
              </div>
            </div>
          </div>

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
              Product Name:{' '}
            </span>
            {productData?.product[0]?.name}
          </h5>
          <h5>
            {' '}
            <span style={{ fontWeight: 'bold', color: 'darkslategray' }}>
              Price:{' '}
            </span>
            BDT {productData?.product[0]?.price}
          </h5>
          <h5>
            {' '}
            <span style={{ fontWeight: 'bold', color: 'darkslategray' }}>
              Category:
            </span>
            {productData?.immediate_category_id?.map((p, idx) =>
              idx !== 0 ? ', ' + p?.name : p?.name
            )}
          </h5>
          <h5>
            {' '}
            <span style={{ fontWeight: 'bold', color: 'darkslategray' }}>
              Stock:{' '}
            </span>
            {productData?.product[0]?.stock}
          </h5>

          <h5>
            {' '}
            <span style={{ fontWeight: 'bold', color: 'darkslategray' }}>
              Discount Price:{' '}
            </span>
            BDT {productData?.product[0]?.discount_price}
          </h5>
          <h5>
            {' '}
            <span style={{ fontWeight: 'bold', color: 'darkslategray' }}>
              Unit:{' '}
            </span>
            {productData?.product[0]?.unit}
          </h5>
          {/* <h5>
            {' '}
            <span style={{ fontWeight: 'bold', color: 'darkslategray' }}>
              Short Id:{' '}
            </span>
            {productData?.product[0]?.short_id}
          </h5> */}
          <h5>
            {' '}
            <span style={{ fontWeight: 'bold', color: 'darkslategray' }}>
              Disable:{' '}
            </span>
            {productData?.product[0]?.disable ? 'Yes' : 'No'}
          </h5>
          <h5>
            {' '}
            <span style={{ fontWeight: 'bold', color: 'darkslategray' }}>
              Description:{' '}
            </span>
            {productData?.product[0]?.description}
          </h5>
          <h5>
            {' '}
            <span style={{ fontWeight: 'bold', color: 'darkslategray' }}>
              ID:{' '}
            </span>
            {productData?.product[0]?._id}
          </h5>
          <h5>
            {' '}
            <span style={{ fontWeight: 'bold', color: 'darkslategray' }}>
              Total Sale:{' '}
            </span>
            {productData?.total_sale}
          </h5>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Dashboard>
  )
}

export default Products
