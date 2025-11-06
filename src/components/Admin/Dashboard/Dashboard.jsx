import React from 'react'
import Sidebar from '../Sidebar/Sidebar'
import './Dashboard.scss'

const Dashboard = ({ children }) => {
  return (
    <div className='admin__dashboard'>
      <div className='container'>
        <div className='admin__main'>
          <Sidebar />
          <div className='admin__section'>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
