import React, { useState } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../../Provider/AuthProvider'
import './Login.scss'

const Login = () => {
  const { login, user } = useAuth()
  const history = useHistory()

  const [email, setEmail] = useState('')
  const [btn, setBtn] = useState(false)
  const [password, setPassword] = useState('')

  if (user?._id) {
    history.push('/admin/orders')
  }

  const submitHandler = (e) => {
    // setBtn(true)
    e.preventDefault()
    login(email, password)
  }

  return (
    <div className='row wrapper'>
      <div className='col-10 col-lg-5'>
        <form className='shadow-lg' onSubmit={submitHandler}>
          <h1 className='mb-5 h1-wrapper'>Login</h1>
          <div className='form-group'>
            <label htmlFor='email_field'>Email</label>
            <input
              type='email'
              id='email_field'
              className='form-control'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='password_field'>Password</label>
            <input
              type='password'
              id='password_field'
              className='form-control'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            variant='primary'
            id='login_button'
            type='submit'
            style={{ width: '100%' }}
            className='d-flex justify-content-center align-items-center'
          >
            <Spinner
              animation='border'
              role='status'
              size='sm'
              className='mr-2'
              style={{ display: btn ? 'block' : 'none' }}
            />
            LOGIN
          </Button>
          <div className='text-center mt-5'>
            <label htmlFor='password_field'>
              <Link to='/auth/password/forgot' className='mb-4 mt-5 py-3'>
                Forgot Password?
              </Link>
            </label>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
