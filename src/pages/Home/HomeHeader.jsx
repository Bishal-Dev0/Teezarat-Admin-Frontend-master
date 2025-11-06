import React from 'react'
import { Link } from 'react-router-dom'
import './Home.scss'

const HomeHeader = ({ children }) => {
  return (
    <>
      <div style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
        <div
          className='top-name  d-flex justify-content-between align-items-center p-3 m-auto'
          style={{ maxWidth: '1450px' }}
        >
          <Link to='/'>
            <img src='/assets/teza-logo.png' alt='teezarate' style={{ width: '150px', height: '50px' }} />
            {/* <span
              style={{
                fontWeight: '700',
                color: '#FE5722',
                fontSize: '36px',
                fontFamily: 'PT Sans',
              }}
            >
              Teezarat
            </span> */}
          </Link>
          <div
            className='top-download-btn   py-2 px-4'
            style={{
              backgroundColor: '#FFF2E6',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            <a href='https://play.google.com/store/apps/details?id=com.crantech.teezarat' target='_blank'>
              <img src='assets/download_icon.png' alt='download_icon' height='24px' width='24px' className='mr-3' />
              <span
                style={{
                  color: '#FE5722',
                  fontFamily: 'PT Sans',
                  fontSize: '22px',
                }}
              >
                Download Android App
              </span>
            </a>
          </div>
        </div>
      </div>
      <div>{children}</div>
    </>
  )
}

export default HomeHeader
