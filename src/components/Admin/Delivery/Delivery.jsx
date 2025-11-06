import React, { useEffect, useState } from 'react'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import SweetAlert from '../../../lib/sweetalert'
import Dashboard from '../Dashboard/Dashboard'
import './Delivery.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { useRef } from 'react'

const Delivery = () => {
  const [btn, setBtn] = useState(false)
  const [deliveryCharge, setDeliveryCharge] = useState(0)
  const [show, setShow] = useState(false)
  const [globalData, setGlobalData] = useState({
    min_amount_for_free_delivery: 0,
    delivery_charge: 0,
    faq: '',
    about_us: '',
    terms: '',
    banner: [],
  })
  const [minOrderForFreeDelivery, setMinOrderForFreeDelivery] = useState(0)
  const [photoSpinner, setPhotoSpinner] = useState(false)
  const [bannerSpinner, setBannerSpinner] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  useEffect(() => {
    deliveryFee()
  }, [])

  const deliveryFee = async () => {
    setBannerSpinner(true)
    fetch(process.env.REACT_APP_BACKEND_URL + '/global/get')
      .then((res) => res.json())
      .then((data) => {
        if (data.success === 'yes') {
          setGlobalData(data.data)
          setDeliveryCharge(data.data.delivery_charge)
          setMinOrderForFreeDelivery(data.data.min_amount_for_free_delivery)
          setBannerSpinner(false)
        } else {
          setBannerSpinner(false)
          SweetAlert.failed('Can not get data!', data.msg)
        }
      })
  }

  const chargeUpdate = (e) => {
    if (deliveryCharge === '' || minOrderForFreeDelivery === '')
      return SweetAlert.failed('Error', 'Please fill up all required field')
    setBtn(true)

    const updatedData = {
      min_amount_for_free_delivery: minOrderForFreeDelivery,
      delivery_charge: deliveryCharge,
      banner: globalData?.banner,
    }

    fetch(process.env.REACT_APP_BACKEND_URL + '/global/edit', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        teezarat: `${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === 'yes') {
          deliveryFee()
          setDeliveryCharge('')
          setMinOrderForFreeDelivery('')
          SweetAlert.success('Charge Updated Successfully!')
        } else {
        }
        setBtn(false)
      })
      .catch((err) => {
        SweetAlert.failed('Failed!', err.message)

        setBtn(false)
      })
  }

  const fileInputRef = useRef()

  // useEffect(() => {
  //   handleImageUpload()
  // }, [image])

  const handleImageUpload = async (file) => {
    setPhotoSpinner(true)
    const formData = new FormData()
    formData.append('photo', file)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          teezarat: `${localStorage.getItem('token')}`,
        },
      }

      const { data } = await axios.post(process.env.REACT_APP_BACKEND_URL + '/file/upload', formData, config)
      // setBanner(data.path)
      setPhotoSpinner(false)
      upDateGlobalData(data?.path, 'add')
    } catch (error) {
      // setPhotoSpinner(false)

      SweetAlert.failed('Photo upload Failed!', error.message)
    }
  }

  const upDateGlobalData = async (path, type) => {
    let updatedObj = {}
    if (type === 'add') {
      updatedObj = {
        ...globalData,
        banner: [...globalData.banner, path],
      }
    } else if (type === 'delete') {
      let newBannerArr = globalData.banner.filter((photo) => photo !== path)
      updatedObj = {
        ...globalData,
        banner: newBannerArr,
      }
    }

    try {
      const res = await axios.put(process.env.REACT_APP_BACKEND_URL + '/global/edit', updatedObj, {
        headers: {
          teezarat: `${localStorage.getItem('token')}`,
        },
      })
      if (res.status === 200) {
        SweetAlert.success(`Banner ${type === 'delete' ? 'deleted' : 'updated'} successfully`)
        deliveryFee()
        setPhotoSpinner(false)
      } else throw new Error(res?.data?.msg)
    } catch (error) {
      SweetAlert.failed(`Banner ${type === 'delete' ? 'deleted' : 'updated'} Failed!`, error.message)
    }
  }

  return (
    <Dashboard>
      <div className='d-flex main-top '>
        <h4 className='d-flex justify-content-center align-items-center'>
          Delivery Charge {bannerSpinner && <Spinner animation='border' size='sm' className='ml-2' />}{' '}
        </h4>
        <span className='ml-auto'></span>
      </div>
      <div className='main-wrapped'>
        <h6>Current Delivery Charge</h6>
        <h6 className='fees'>
          <span className='mt-5'>BDT {globalData?.delivery_charge}</span>
        </h6>
        <button onClick={handleShow} className='dlb d-flex justify-content-center align-items-center'>
          Change Charge
          <Spinner
            animation='border'
            role='status'
            size='sm'
            className='mx-2'
            style={{ display: btn ? 'block' : 'none' }}
          />
        </button>
      </div>
      <div className='main-wrapped'>
        <h6>Min Order For Free Delivery</h6>
        <h6 className='fees'>
          <span className='mt-5'>BDT {globalData?.min_amount_for_free_delivery}</span>
        </h6>
      </div>
      <div className='my-5 d-flex justify-content-between align-items-center'>
        <h4 className='d-flex justify-content-center align-items-center'>
          Banner {bannerSpinner && <Spinner animation='border' size='sm' className='ml-2' />}{' '}
        </h4>

        <button
          onClick={(event) => {
            fileInputRef.current.click()
          }}
          className='btn-primary '
        >
          Add New Banner
          {photoSpinner && <Spinner animation='border' size='sm' />}
        </button>
        <input
          type='file'
          className='d-none'
          ref={fileInputRef}
          accept='image/*'
          onChange={(event) => {
            const file = event.target.files[0]
            if (file && file.type.substr(0, 5) === 'image') {
              handleImageUpload(file)
            }
          }}
        />
        {/* <button type=''>
          Add New Banner
          <input
            className='d-none btn-primary '
            type='file'
            onClick={() => handleImageUpload()}
          />
        </button> */}
      </div>
      <div className='my-5'>
        {globalData?.banner?.map((item, bannerInd) => (
          <div className='mt-4 d-flex banner-wrapper' key={bannerInd}>
            <img src={item} alt='' height='100%' width='100%' />
            <div style={{ position: 'relative', right: '4.5rem' }}>
              <button
                className='p-3 mt-1 ml-1 trash-btn'
                style={{ border: 'none', borderRadius: '4px' }}
                onClick={() => upDateGlobalData(item, 'delete')}
              >
                <FontAwesomeIcon icon={faTrash} style={{ width: '2rem', height: '2rem' }} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delivery Charge</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {' '}
          <Form.Group className='' controlId='formDeliveryName'>
            <Form.Label>Delivery Charge</Form.Label>
            <Form.Control
              type='text'
              className=''
              value={deliveryCharge}
              onChange={(e) => setDeliveryCharge(e.target.value)}
            />
          </Form.Group>
          <Form.Group className='' controlId='formDeliveryName'>
            <Form.Label>Min Order For Free Delivery</Form.Label>
            <Form.Control
              type='text'
              className=''
              value={minOrderForFreeDelivery}
              onChange={(e) => setMinOrderForFreeDelivery(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer onClick={handleClose}>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <button onClick={chargeUpdate} className='dlb2'>
            Save
          </button>
        </Modal.Footer>
      </Modal>
    </Dashboard>
  )
}

export default Delivery
