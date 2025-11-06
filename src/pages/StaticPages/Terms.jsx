import axios from 'axios'
import React, { useEffect } from 'react'
import SweetAlert from '../../lib/sweetalert'
import Editor from '../Editor/Editor'

const Terms = () => {
  const [appTerms, setAppTerms] = React.useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const res = await axios.get(
        process.env.REACT_APP_BACKEND_URL + '/global/get'
      )

      if (res.status === 200) {
        setAppTerms(res?.data?.data?.terms)
      } else throw new Error('Something went wrong!')
    } catch (error) {
      SweetAlert.failed('Failed', error?.data?.msg)
    }
  }

  return (
    <div className='my-3 editorWrapper'>
      <Editor defaultValue={appTerms} readOnly />
    </div>
  )
}

export default Terms
