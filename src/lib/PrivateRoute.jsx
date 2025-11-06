import React from 'react'
import { Redirect, Route } from 'react-router'
import { useAuth } from '../Provider/AuthProvider'

function PrivateRoute({ children, ...rest }) {
  const { user } = useAuth()

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user?._id !== '' ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  )
}
export default PrivateRoute

// && user?.role.find((dt) => dt === 'super_admin' || dt === 'admin')
