import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Fragment, useEffect, useState } from 'react'
import { Button, Modal, Spinner, Table } from 'react-bootstrap'
import Dashboard from '../Dashboard/Dashboard'
import Pagination from 'react-js-pagination'
import './Users.scss'
import SweetAlert from '../../../lib/sweetalert'
import { CSVLink } from 'react-csv'
import axios from 'axios'

const Users = () => {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([])
  const [pageNumber, setPageNumber] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [spinner, setSpinner] = useState(false)
  const [sort, setSort] = useState('')

  const getAllIUser = async () => {
    setSpinner(true)
    let url =
      process.env.REACT_APP_BACKEND_URL + `/customer/get?page=${pageNumber}`
    if (sort.length > 0) {
      url += `&sort=${sort}`
    }
    if (search.length > 0) {
      url += `&filter=${search}`
      setPageNumber(1)
    }
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          teezarat: `${localStorage.getItem('token')}`,
        },
      })
      const data = await res.json()

      setUsers(data.data.data)
      // setTotalItems(data.data.page)
      setTotalItems(data.data.total_document)
      setSpinner(false)
    } catch (err) {
      setSpinner(false)
      SweetAlert.failed('Error', err.msg)
    }
  }
  useEffect(() => {
    getAllIUser()
  }, [search, sort, pageNumber])

  const [show, setShow] = useState(false)
  const [userData, setUserData] = useState({})

  const handleClick = (user) => {
    setShow(true)
    setUserData(user)
  }

  const [printData, setPrintData] = useState([])
  const [printSpinner, setPrintSpinner] = useState(false)

  useEffect(() => {
    loadPrintData()
  }, [])
  const loadPrintData = async () => {
    setPrintSpinner(true)
    const url = process.env.REACT_APP_BACKEND_URL + `/customer/get-for-xml`
    try {
      const res = await axios.get(url, {
        method: 'GET',
        headers: {
          teezarat: `${localStorage.getItem('token')}`,
        },
      })

      if (res.status === 200) {
        formateDataToCsv(res.data)
        setPrintSpinner(false)
      } else throw new Error(res?.data?.msg || 'Something went wrong!')
    } catch (err) {
      setPrintSpinner(false)
    }
  }

  const formateDataToCsv = (data) => {
    let csvData = [
      [
        'Name',
        'Phone',
        'Email',
        'Id',
        'Address',
        'Total Order',
        'Verified',
        'Voucher List',
        'Wish List',
        'Created At',
        'Updated At',
      ],
    ]
    const len = data.length
    for (var i = 0; i < len; i++) {
      const tempArr = []
      tempArr.push(data[i]?.name)
      tempArr.push(data[i]?.phone)
      tempArr.push(data[i]?.email)
      tempArr.push(data[i]?._id)
      tempArr.push(data[i]?.address)
      tempArr.push(data[i]?.total_order)
      tempArr.push(data[i]?.verified ? 'yes' : 'no')
      tempArr.push(data[i]?.voucher_list)
      tempArr.push(data[i]?.wishlist)
      tempArr.push(data[i]?.createdAt.substring(0, 10))
      tempArr.push(data[i]?.updatedAt.substring(0, 10))

      csvData.push(tempArr)

      if (i === len - 1) {
        setPrintData(csvData)
      }
    }
  }

  return (
    <Dashboard>
      <div
        className='d-flex mb-3 justify-content-between align-items-center'
        style={{ marginTop: '34px' }}
      >
        <h4>All Users</h4>{' '}
        <CSVLink data={printData}>
          <Button className='d-flex justify-content-center align-items-center '>
            Download All User's Data{' '}
            {printSpinner && (
              <Spinner className='ml-2' animation='border' size='sm' />
            )}
          </Button>
        </CSVLink>
      </div>

      <Fragment>
        <div style={{ display: 'none' }}></div>
        <div className='users-search'>
          <div>
            <h5>Search</h5>
            <span>
              <input
                type='text'
                placeholder='Search by customer Name, Email, Number'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <FontAwesomeIcon icon={faSearch} />
            </span>
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
              <option value='time_ascending'>Time ascending</option>
              <option value='time_descending'>Time descending</option>
              <option value='order_ascending'>Order ascending</option>
              <option value='order_descending'>Order descending</option>
            </select>
          </div>
        </div>

        <Spinner
          animation='border'
          role='status'
          style={{ display: spinner ? 'block' : 'none', margin: '3rem auto' }}
        />

        {users.length > 0 && spinner === false ? (
          <Table
            responsive
            bordered
            hover
            striped
            style={{ background: '#FFFEF0', textAlign: 'center' }}
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>verified</th>
                <th>Address</th>
                <th>Total Order</th>
                {/* <th>Id</th> */}
                {/* <th>Action</th> */}
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <Fragment key={user._id}>
                  <tr onClick={() => handleClick(user)}>
                    <td>{user?.name}</td>
                    <td>{user?.email}</td>
                    <td>{user?.phone}</td>
                    <td>{user?.verified ? 'Yes' : 'No'}</td>
                    <td>{user?.address || '-'}</td>
                    <td>{user?.total_order || '-'}</td>
                    {/* <td>{user?._id}</td> */}

                    {/* <td>
								<>
									<button className="td-update">Update</button>
								</>
							</td> */}
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </Table>
        ) : (
          !spinner && <h2 className='m-5 text-center'>No Data Found</h2>
        )}

        {!spinner && (
          <div className='pagination'>
            <Pagination
              activePage={pageNumber}
              itemsCountPerPage={10}
              totalItemsCount={totalItems}
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

        <Modal centered show={show} onHide={() => setShow(false)}>
          <Modal.Header closeButton>
            <h3
              className='mx-auto'
              style={{ fontWeight: 'bold', color: 'darkslategray' }}
            >
              User Details
            </h3>
          </Modal.Header>
          <Modal.Body
            style={{
              backgroundColor: '#fffef0',
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
                Product Name:{' '}
              </span>
              {userData?.name}
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
                Email:{' '}
              </span>
              {userData?.email}
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
                Phone:{' '}
              </span>
              {userData?.phone}
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
              {userData?.address}
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
                Total Order:{' '}
              </span>
              {userData?.total_order}
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
              {userData?.verified ? 'Yes' : 'No'}
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
              {userData?._id}
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
              {userData?.createdAt}
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
              {userData?.updatedAt}
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
                WishList:{' '}
              </span>
              <ol style={{ position: 'relative', left: '4rem' }} type='i'>
                {userData?.wishlist?.map((v, idx) => (
                  <li key={idx}>{v?.name}</li>
                ))}
              </ol>
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
                Voucher List:{' '}
              </span>
              <ol style={{ position: 'relative', left: '4rem' }} type='i'>
                {userData?.voucher_list?.map((v, idx) => (
                  <li key={idx}>{v}</li>
                ))}
              </ol>
            </h5>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setShow(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    </Dashboard>
  )
}

export default Users
