import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import SweetAlert from '../../lib/sweetalert'

const Activate = ({ match }) => {
  const [values, setValues] = useState({
    name: '',
    token: '',
    show: true,
  })
  const history = useHistory()

  useEffect(() => {
    let token = match.params.token
    let { name } = jwt.decode(token)

    if (token) {
      setValues({ ...values, name, token })
    }
  }, [])

  const { name, token, show } = values

  const clickSubmit = (event) => {
    event.preventDefault()
    axios({
      method: 'POST',
      url: process.env.REACT_APP_BACKEND_URL + `/api/account-activation`,
      data: { token },
    })
      .then((response) => {
        SweetAlert.success(
          response.data.message,
          'ACCOUNT ACTIVATION SuccessFully'
        )
        setValues({ ...values, show: false })
        history.push('/')
      })
      .catch((error) => {
        toast.error(error.response.data.msg)
      })
  }

  const activationLink = () => (
    <div className='text-center'>
      <h1 className='p-5'>Hey {name}, Ready to activate your account?</h1>
      <button className='btn btn-outline-primary' onClick={clickSubmit}>
        Activate Account
      </button>
    </div>
  )

  return (
    <div className='col-md-6 offset-md-3'>
      <ToastContainer />
      {activationLink()}
    </div>
  )
}

export default Activate
