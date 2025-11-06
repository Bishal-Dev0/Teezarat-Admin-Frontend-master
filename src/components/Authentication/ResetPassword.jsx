import axios from 'axios'
import React, { Fragment, useState } from 'react'
import { useEffect } from 'react'
import SweetAlert from '../../lib/sweetalert'
import './Login.scss'
import { useHistory } from 'react-router-dom'
const ResetPassword = ({ match }) => {
  const history = useHistory()
  const [values, setValues] = useState({
    token: '',
    newPassword: '',
    buttonText: 'Reset password',
  })

  useEffect(() => {
    let token = match.params.token

    if (token) {
      setValues({ ...values, token })
    }
  }, [])

  const { token, newPassword, buttonText } = values

  const handleChange = (event) => {
    setValues({ ...values, newPassword: event.target.value })
  }

  const clickSubmit = (event) => {
    event.preventDefault()
    setValues({ ...values, buttonText: 'Submitting' })
    axios({
      method: 'PUT',
      url: process.env.REACT_APP_BACKEND_URL + `/api/reset-password`,
      data: { newPassword, resetPasswordLink: token },
    })
      .then((response) => {
        SweetAlert.success(response.data.message, 'SuccessFull')
        history.push('/')
        setValues({ ...values, buttonText: 'Done' })
      })
      .catch((error) => {
        SweetAlert.success(error.response.data.error, 'Error')
        setValues({ ...values, buttonText: 'Reset password' })
      })
  }

  return (
    <Fragment>
      <div className='row wrapper'>
        <div className='col-10 col-lg-5'>
          <form className='shadow-lg'>
            <h1 className='mb-5 h1-wrapper'>RESET PASSWORD</h1>
            <div className='form-group mb-5'>
              <h6>Hey , Type your new password</h6>
              <input
                onChange={handleChange}
                value={newPassword}
                type='password'
                className='form-control'
                placeholder='Type new password'
                required
              />
            </div>

            <button
              id='login_button'
              type='submit'
              className='btn btn-block reset-btn'
              onClick={clickSubmit}
            >
              {buttonText}
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  )
}

export default ResetPassword
