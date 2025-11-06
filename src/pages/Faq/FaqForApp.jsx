import axios from 'axios'
import React, { useEffect } from 'react'
import SweetAlert from '../../lib/sweetalert'
import Editor from '../Editor/Editor'

const FaqForApp = () => {
  const [faq, setFaq] = React.useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const res = await axios.get(
        process.env.REACT_APP_BACKEND_URL + '/global/get'
      )

      if (res.status === 200) {
        setFaq(res?.data?.data?.faq)
      } else throw new Error('Something went wrong!')
    } catch (error) {
      SweetAlert.failed('Failed', error?.data?.msg)
    }
  }

  return (
    <div className='my-1 editorWrapper'>
      <Editor defaultValue={faq} readOnly />
    </div>
  )
}

export default FaqForApp
