import React from 'react'
import Barcode from 'react-barcode'

export class PrintProductBarCode extends React.PureComponent {
  render() {
    const data = this.props?.data

    return (
      <div
        style={{ backgroundColor: 'white', display: 'inline-block' }}
        className='p-3 text-center '
      >
        <h5 className='m-0 text-center ' style={{ fontWeight: 'bold' }}>
          {data?.product[0]?.name}
        </h5>
        <p className='m-0 text-center' style={{ fontWeight: 'bold' }}>
          BDT {data?.product[0]?.discount_price} / {data?.product[0]?.unit}
        </p>
        <Barcode value={data?.product[0]?.short_id} />
      </div>
    )
  }
}
export default PrintProductBarCode
