import React, { Component } from 'react'

class ComponentToPrint extends Component {
  constructor(props) {
    super(props)
    this.state = this.props.data
  }

  render() {
    return (
      <div className='ml-5 mt-5'>
        {this.props.data.map((dt, idx) => (
          <div className='d-flex align-items-start mb-3 '>
            <h5>{idx + 1}.</h5>
            <div className='mx-3'>
              <h5>Id: {dt._id}</h5>
              <h5>Name: {dt?.name}</h5>
              <h5>Email: {dt?.email}</h5>
              <h5>Phone: {dt?.phone}</h5>
              <h5>Verified: {dt?.verified ? 'Yes' : 'No'}</h5>
              <h5>Address: {dt?.address}</h5>
              <h5>Id Created At: {dt?.createdAt}</h5>
              <h5>Id Updated At: {dt?.updatedAt}</h5>
              <h5>
                Wishlist:{' '}
                {dt?.wishlist &&
                  dt?.wishlist.map((d, index) => (
                    <span key={index} className='mx-1'>
                      {d},{' '}
                    </span>
                  ))}
              </h5>
              <h5>
                {' '}
                Voucher List:{' '}
                {dt?.voucher_list &&
                  dt?.voucher_list.map((v, index) => (
                    <span key={index} className='mx-1'>
                      {v},{' '}
                    </span>
                  ))}
              </h5>
              <h5>Total order: {dt?.total_order}</h5>
            </div>
          </div>
        ))}
      </div>
    )
  }
}

export default ComponentToPrint

// "_id": "616590dca6ec060ec82bb3fd",
// "verified": true,
// "address": null,
// "voucher_list": [
//   "percentage",
//   "percentage",
//   "test",
//   "test now",
//   "string",
//   "panda30",
//   "stringg",
//   "striiing"
// ],
// "name": "Customer",
// "email": "a@gmail.com",
// "phone": "+8801521222512",
// "createdAt": "2021-10-12T13:42:52.639Z",
// "updatedAt": "2021-11-17T06:36:09.014Z",
// "__v": 0,
// "wishlist": [
//   "6166784dceffd11a91570f30"
// ],
// "total_order": 3
