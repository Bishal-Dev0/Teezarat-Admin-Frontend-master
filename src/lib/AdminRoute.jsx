import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { useAuth } from '../Provider/AuthProvider'

const AdminRoute = ({ component: Component, ...restProps }) => {
  const { user } = useAuth()

  // if (!user) return null

  return (
    <Route
      {...restProps}
      render={(props) =>
        user?._id !== '' &&
        user?.role.find((dt) => dt === 'super_admin' || dt === 'admin') ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props },
            }}
          />
        )
      }
    />
  )
}

export default AdminRoute
