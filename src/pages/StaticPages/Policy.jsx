import axios from 'axios'
import React, { useEffect } from 'react'
import SweetAlert from '../../lib/sweetalert'
import Editor from '../Editor/Editor'

const Policy = () => {
  const [appPolicy, setAppPolicy] = React.useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const res = await axios.get(process.env.REACT_APP_BACKEND_URL + '/global/get')

      if (res.status === 200) {
        setAppPolicy(res?.data?.data?.policy)
      } else throw new Error('Something went wrong!')
    } catch (error) {
      SweetAlert.failed('Failed', error?.data?.msg)
    }
  }

  return (
    <div className='my-3 editorWrapper'>
      <Editor defaultValue={appPolicy} readOnly />
    </div>
  )
}

export default Policy
