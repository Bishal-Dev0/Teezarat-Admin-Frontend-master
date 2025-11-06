import axios from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import SweetAlert from '../lib/sweetalert'

const AuthContext = createContext({})

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || {
      effective_role: '',
      email: '',
      name: '',
      role: [],
      phone: '',
      _id: '',
    }
  )
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const history = useHistory()

  const getProfile = async (token) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_BACKEND_URL + '/admin/profile',
        {
          headers: {
            'Content-Type': 'application/json',
            teezarat: token,
          },
        }
      )
      if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify(response?.data?.data))
        return response?.data?.data
      } else throw new Error(response)
    } catch (error) {
      SweetAlert.failed(
        'error',
        error?.response?.data?.msg || error?.message || 'something went wrong'
      )
    }
  }

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        const user = await getProfile(token)
        if (user) {
          setUser(user)
          setIsLoggedIn(true)
        }
      }
    }
    init()
  }, [])

  const login = (email, password) => {
    fetch(process.env.REACT_APP_BACKEND_URL + '/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.teezarat) {
          localStorage.setItem('token', data.teezarat)
          const user = await getProfile(data.teezarat)
          if (user) {
            setUser(user)
            setIsLoggedIn(true)
            SweetAlert.success(
              data?.user?.fullname,
              data.msg || 'Login SuccessFully'
            )
            history.push('/admin/orders')
          }
        } else {
          throw new Error(data)
        }
      })
      .catch((error) => {
        SweetAlert.failed('error', error?.response?.data?.msg || 'Login Failed')
      })
  }
  const register = (data) => {
    localStorage.setItem('token', '')
    setUser({})
  }
  const logout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    localStorage.removeItem('user')

    setUser({
      effective_role: '',
      email: '',
      name: '',
      role: [],
      phone: '',
      _id: '',
    })
    SweetAlert.success('Success', 'Logout SuccessFull!')
    history.push('/login')
  }
  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
export const useAuth = () => useContext(AuthContext)
