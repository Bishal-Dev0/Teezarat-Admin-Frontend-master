import React from 'react'
import '../Order/Order.scss'

export class ComponentToPrint extends React.PureComponent {
  render() {
    const data = this.props?.data

    return (
      <div id={data?._id} className=' px-3 py-1 w-100 mt-2'>
        <div className='d-flex justify-content-between align-items-start mb-3'>
          <img src='/assets/MoneyReceipt.svg' alt='' width='240px' />
          <div className='mt-4 d-flex flex-column justify-content-end align-items-end'>
            <p>Ugharia Road, Chitoshi Bazar, Shahrasti, Chandpur</p>
            <p className=''>+8801916123480</p>
          </div>
        </div>
        <div className='d-flex justify-content-start align-items-center'>
          <h6 className='mr-3'>
            {' '}
            <span style={{ fontWeight: 'bold' }}> Order ID: </span> {data?._id}
          </h6>
          <h6>
            <span style={{ fontWeight: 'bold' }}> Time: </span>{' '}
            {data?.createdAt?.substring(0, 10)}
          </h6>
        </div>
        <h6>
          <span style={{ fontWeight: 'bold' }}>
            Customer: {data?.customer_name || data?.customers[0]?.name}
          </span>
        </h6>
        <h6>Address: {data?.address || data?.customers[0]?.address}</h6>
        <h6>Phone: {data?.customer_phone || data?.customers[0]?.phone}</h6>
        <h6>Note to Deliverer: {data?.note}</h6>
        <h5 className='mt-2'>
          <span style={{ fontWeight: 'bold' }}>Products</span>
        </h5>

        <div className='product-side'>
          {data?.details?.map((prd, idx) => (
            <React.Fragment key={idx}>
              <div
                className='d-flex justify-content-between align-items-end my-2 w-100 p-2 '
                style={{ backgroundColor: '#FAFAFA' }}
              >
                <div>
                  <p style={{ margin: 0 }}>{prd?.product?.name}</p>
                  <p style={{ margin: 0 }}>
                    <span style={{ fontWeight: 'bold' }}>
                      {' '}
                      {prd?.product?.discount_price} BDT{' '}
                    </span>{' '}
                    <span style={{ color: 'dimgray' }}>
                      / {prd?.product?.unit}{' '}
                    </span>{' '}
                    X {prd?.quantity}
                  </p>
                </div>
                <div>
                  {' '}
                  <p
                    style={{
                      margin: '0px',
                      fontWeight: 'bold',
                    }}
                  >
                    BDT {prd?.product?.discount_price * prd?.quantity}
                  </p>
                </div>
              </div>
            </React.Fragment>
          ))}

          <div className='deliver-side '>
            <h5 style={{ fontWeight: 'bold' }}>Bill Summary</h5>

            <div
              className='delivery-inner px-2 py-1'
              style={{ backgroundColor: '#FAFAFA' }}
            >
              <div className=' mt-3'>
                <div className='d-flex justify-content-between align-items-center'>
                  <p>Items</p>
                  <p style={{ fontWeight: 'bold' }}>BDT {data?.sub_total}</p>
                </div>
                <div className='d-flex justify-content-between align-items-center'>
                  <p>Delivery Charge</p>
                  <p style={{ fontWeight: 'bold' }}>
                    BDT {data?.delivery_charge}
                  </p>
                </div>
                <div className='d-flex justify-content-between align-items-center '>
                  <p>Discount</p>
                  <p style={{ fontWeight: 'bold' }}>BDT {data?.discount}</p>
                </div>
                <div className='d-flex justify-content-between align-items-center'>
                  <p>Total Bill</p>
                  <p style={{ fontWeight: 'bold' }}>BDT {data?.grand_total}</p>
                </div>
                <div className='d-flex justify-content-between align-items-center'>
                  <p>Paid Bill</p>
                  <p style={{ fontWeight: 'bold' }}>
                    BDT {data?.paidAmount || 0}
                  </p>
                </div>
                <div className='d-flex justify-content-between align-items-center'>
                  <p>Due Bill</p>
                  <p style={{ fontWeight: 'bold' }}>
                    BDT {data?.grand_total - (data?.paidAmount || 0)}
                  </p>
                </div>
                <div className='d-flex justify-content-between align-items-center'>
                  <p>Payment Method</p>
                  <p style={{ fontWeight: 'bold' }}>Cash On Delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className='text-center mt-1'>
          <i>Thank YOU for Shopping with TEEZARAT</i>{' '}
        </p>
      </div>
    )
  }
}
export default ComponentToPrint
