import React from 'react'
import Header from '../Header/Header'

const HeaderLayout = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}

export default HeaderLayout
