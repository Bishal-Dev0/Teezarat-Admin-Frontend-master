import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../../Provider/AuthProvider'
import './Sidebar.scss'

const Sidebar = () => {
  const { pathname } = useLocation()
  const { user } = useAuth()

  return (
    <ul className='admin__sidebar'>
      <li
        className={`sidebar__item ${
          pathname === '/admin/orders' ? 'active' : ''
        }`}
      >
        <Link to='/admin/orders'>
          <img src='/assets/Orders.svg' alt='' /> Orders
        </Link>
      </li>

      <li
        className={`sidebar__item ${
          pathname === '/admin/receipts' ? 'active' : ''
        }`}
      >
        <Link to='/admin/receipts'>
          <img src='/assets/Receipts.svg' alt='' /> Receipts
        </Link>
      </li>

      <li
        className={`sidebar__item ${
          pathname === '/admin/category' ? 'active' : ''
        }`}
      >
        <Link to='/admin/category'>
          <img src='/assets/Categories.svg' alt='' /> Categories
        </Link>
      </li>

      <li
        className={`sidebar__item ${
          pathname === '/admin/products' ? 'active' : ''
        }`}
      >
        <Link to='/admin/products'>
          <img src='/assets/Products.svg' alt='' /> Products
        </Link>
      </li>
      {user?.role?.includes('super_admin') && (
        <li
          className={`sidebar__item ${
            pathname === '/admin/stocks' ? 'active' : ''
          }`}
        >
          <Link to='/admin/stocks'>
            <img src='/assets/StockPurchase.svg' alt='' /> Stock Purchases
          </Link>
        </li>
      )}
      <li
        className={`sidebar__item ${
          pathname === '/admin/promotion' ? 'active' : ''
        }`}
      >
        <Link to='/admin/promotion'>
          <img src='/assets/Promotions.svg' alt='' /> Promotions
        </Link>
      </li>

      <li
        className={`sidebar__item ${
          pathname === '/admin/user' ? 'active' : ''
        }`}
      >
        <Link to='/admin/user'>
          <img src='/assets/Customers.svg' alt='' /> Customers
        </Link>
      </li>
      <li
        className={`sidebar__item ${
          pathname === '/admin/delivery' ? 'active' : ''
        }`}
      >
        <Link to='/admin/delivery'>
          <img src='/assets/Global.svg' alt='' /> Global
        </Link>
      </li>
      <li
        className={`sidebar__item ${
          pathname === '/admin/system-report' ? 'active' : ''
        }`}
      >
        <Link to='/admin/system-report'>
          <img src='/assets/SystemReport.svg' alt='' /> System Report
        </Link>
      </li>

      <li
        className={`sidebar__item ${
          pathname === '/static-pages' ? 'active' : ''
        }`}
      >
        <Link to='/static-pages'>
          <img src='/assets/StaticPages.svg' alt='' /> Static Pages
        </Link>
      </li>
    </ul>
  )
}

export default Sidebar
