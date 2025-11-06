import axios from 'axios'
import React, { Fragment, useState } from 'react'
import { Button } from 'react-bootstrap'
import SweetAlert from '../../lib/sweetalert'
import './Login.scss'
const ForgotPassword = ({ history, location }) => {
  const [values, setValues] = useState({
    email: '',
    buttonText: 'Reset Password',
  })

  const { email, buttonText } = values

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value })
  }

  const clickSubmit = (event) => {
    event.preventDefault()
    setValues({ email: '', buttonText: 'Submitting' })
    axios({
      method: 'PUT',
      url: process.env.REACT_APP_BACKEND_URL + `/api/forgot-password`,
      data: { email },
    })
      .then((response) => {
        // toast.success(response.data.message);
        SweetAlert.success(
          response.data.message,
          'FORGOT PASSWORD Request SuccessFully'
        )
        setValues({ ...values, email: '', buttonText: 'Requested' })
      })
      .catch((error) => {
        // toast.error(error.response.data.error);
        SweetAlert.success(
          error.response.data.error,
          'FORGOT PASSWORD Request ERROR'
        )
        setValues({ ...values, buttonText: 'Request password' })
      })
  }

  return (
    <Fragment>
      <div className='row wrapper'>
        <div className='col-10 col-lg-5'>
          <form className='shadow-lg'>
            <h1 className='mb-5 h1-wrapper'>RESET PASSWORD</h1>
            <div className='form-group mb-5'>
              <label htmlFor='email_field'>Enter Your Email</label>
              <input
                type='email'
                id='email_field'
                className='form-control'
                onChange={handleChange('email')}
                value={email}
              />
            </div>

            <div style={{ textAlign: 'center' }}>
              <Button
                id='login_button'
                type='submit'
                variant='primary'
                onClick={clickSubmit}
              >
                {buttonText}
              </Button>
            </div>
            <label htmlFor=''>
              <h5 className='text-center reset-desc'>
                Please Check Your Email Inbox for Password Reset Instructions
              </h5>
            </label>
          </form>
        </div>
      </div>
    </Fragment>
  )
}

export default ForgotPassword
