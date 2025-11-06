import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

const Register = () => {
  const [values, setValues] = useState({
    fullname: '',
    number: '',
    email: '',
    password: '',
    buttonText: 'Submit',
  })

  const { fullname, number, email, password, buttonText } = values

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value })
  }

  const HandleRegistration = (event) => {
    event.preventDefault()
    setValues({ ...values, buttonText: 'Submitting' })
    axios({
      method: 'POST',
      url: process.env.REACT_APP_BACKEND_URL + `/api/signup`,
      data: { fullname, number, email, password },
    })
      .then((response) => {
        setValues({
          ...values,
          fullname: '',
          email: '',
          number: '',
          password: '',
          buttonText: 'Submitted',
        })
        toast.success(response.data.message)
      })
      .catch((error) => {
        setValues({ ...values, buttonText: 'Submit' })
        toast.error(error.response.data.error)
      })
  }

  const signupForm = () => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Full Name</label>
        <input
          onChange={handleChange('fullname')}
          value={fullname}
          type='text'
          className='form-control'
        />
      </div>

      <div className='form-group'>
        <label className='text-muted'>Email</label>
        <input
          onChange={handleChange('email')}
          value={email}
          type='email'
          className='form-control'
        />
      </div>

      <div className='form-group'>
        <label className='text-muted'>Number</label>
        <input
          onChange={handleChange('number')}
          value={number}
          type='text'
          className='form-control'
        />
      </div>

      <div className='form-group'>
        <label className='text-muted'>Password</label>
        <input
          onChange={handleChange('password')}
          value={password}
          type='password'
          className='form-control'
        />
      </div>

      <div>
        <button className='btn btn-primary' onClick={HandleRegistration}>
          {buttonText}
        </button>
      </div>
    </form>
  )

  return (
    <div className='col-md-6 offset-md-3'>
      <ToastContainer />

      <h1 className='p-5 text-center'>Signup</h1>
      {signupForm()}
      <br />
      <Link
        to='/auth/password/forgot'
        className='btn btn-sm btn-outline-danger'
      >
        Forgot Password
      </Link>
    </div>
  )
}

export default Register
