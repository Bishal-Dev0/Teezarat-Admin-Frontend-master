import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div style={{ backgroundColor: '#FFFBFA' }}>
      <div
        style={{ maxWidth: '1440px' }}
        className='py-5  px-3  mx-auto row  justify-content-between align-items-start '
      >
        <div className='col-md-4 col-12'>
          <Link to='/'>
            <img src='/assets/teza-logo.png' alt='teezarate' style={{ width: '150px', height: '50px' }} />
            {/* <span
              style={{
                fontWeight: '700',
                color: '#FE5722',
                fontSize: '40px',
                fontFamily: 'PT Sans',
              }}
            >
              Teezarat
            </span> */}
          </Link>
          <p className='my-2'>We have all the tools and machineries for your Home Interior tools and more. </p>
          <div className='d-flex justify-content-start align-items-center mt-4 '>
            <a href='http://www.facebook.com/teezaratEcommerce' target='_blank'>
              {' '}
              <img src='assets/fb-logo.svg' alt='' className=' mr-2' />
            </a>
            <h5 style={{ fontWeight: 'bold' }} className='m-0'>
              Like Our Facebook Page
            </h5>
          </div>

          <p className='my-5' style={{ color: '#444444' }}>
            2022 © teezarate. All Rights Reserved.{' '}
          </p>
        </div>
        <div className='mt-4 col-md-7 col-12 d-flex justify-content-between align-items-start flex-wrap'>
          <div className='mr-5'>
            <h6 style={{ color: '#FE5722', fontWeight: 'bold' }} className='mb-3'>
              {' '}
              SITE NAVIGATION
            </h6>
            <Link to='/static-pages/about-us'>
              <h6 style={{ color: '#444444' }} className=' mb-3'>
                About Us
              </h6>
            </Link>
            <a href='https://play.google.com/store/apps/details?id=com.teezarate'>
              <h6 style={{ color: '#444444' }} className=' mb-3'>
                Download App
              </h6>
            </a>
            <Link to='/static-pages/terms'>
              <h6 style={{ color: '#444444' }} className=' mb-3'>
                Terms & Services
              </h6>
            </Link>
            <Link to='/static-pages/policy'>
              <h6 style={{ color: '#444444' }} className=' mb-3'>
                Privacy Policy
              </h6>
            </Link>
            <Link to='/static-pages/faq'>
              <h6 style={{ color: '#444444' }} className=' mb-5'>
                FAQ{' '}
              </h6>
            </Link>
          </div>
          <div>
            <h6 style={{ color: '#FE5722', fontWeight: 'bold' }} className='mb-3'>
              {' '}
              CONTACT{' '}
            </h6>

            <h6 style={{ color: '#444444' }} className=' mb-3'>
              Ugaria Road, Chitoshi Bazar, Shahrasti (10,061.07 km) 3623 <br />
              <br />
              Chandpur, Chittagong Division, Bangladesh
            </h6>

            <h6 style={{ color: '#444444', fontWeight: 'bold' }} className=' mb-3'>
              {' '}
              +8801916123480
            </h6>
            <a
              href='http://www.facebook.com/teezaratEcommerce'
              target='_blank'
              style={{ color: '#444444', fontWeight: 'bold' }}
              className=' mb-3'
            >
              facebook.com/teezaratecommerce{' '}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
