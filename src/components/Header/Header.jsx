import { Button } from 'react-bootstrap'
import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../Provider/AuthProvider'
const Header = () => {
  const { user, logout } = useAuth()

  return (
    <div style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
      <div className='d-flex justify-content-between align-items-center p-3 m-auto' style={{ maxWidth: '1450px' }}>
        <Link to='/admin/orders'>
          <img src='/assets/teza-logo.png' alt='teezarate' style={{ width: '150px', height: '50px' }} />
        </Link>
        {user?.role.find((dt) => dt === 'super_admin' || dt === 'admin') ? (
          <div>
            <Link
              to='#'
              onClick={(e) => {
                e.preventDefault()
                logout()
              }}
            >
              {/* <button className='logout_btn'>Logout</button> */}
              <Button variant='outline-primary'>Logout</Button>
            </Link>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  )
}

export default Header
