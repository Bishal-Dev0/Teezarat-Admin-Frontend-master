import axios from 'axios'
import React, { useEffect } from 'react'
import SweetAlert from '../../lib/sweetalert'
import Editor from '../Editor/Editor'

const AboutUs = () => {
  const [aboutUs, setAboutUs] = React.useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const res = await axios.get(
        process.env.REACT_APP_BACKEND_URL + '/global/get'
      )

      if (res.status === 200) {
        setAboutUs(res?.data?.data?.about_us)
      } else throw new Error('Something went wrong!')
    } catch (error) {
      SweetAlert.failed('Failed', error?.data?.msg)
    }
  }

  return (
    <div className='my-1 editorWrapper'>
      <Editor readOnly defaultValue={aboutUs} />
    </div>
  )
}

export default AboutUs
