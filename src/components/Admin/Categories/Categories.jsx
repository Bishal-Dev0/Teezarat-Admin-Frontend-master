import React, { useEffect, useState } from 'react'
import { Button, Col, ListGroup, Row, Spinner } from 'react-bootstrap'
import AddNewCategory from '../../../pages/AdddNewCategory/AdddNewCategory'
import AddNewSubCat from '../../../pages/AddNewSubCat/AddNewSubCat'
import EditCategory from '../../../pages/EditCategory/EditCategory'
import EditSubCategory from '../../../pages/EditSubCategory/EditSubCategory'
import Dashboard from '../Dashboard/Dashboard'
import './Category.scss'
const Categories = () => {
  const [subCate, setSubCate] = useState({})
  const [cate, setCate] = useState([])
  const [selectedCate, setSelectedCate] = useState(null)
  const [parentCate, setParentCate] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [spinner, setSpinner] = useState(false)

  useEffect(() => {
    allCategory()
  }, [selectedCate])

  const allCategory = () => {
    setSpinner(true)
    fetch(process.env.REACT_APP_BACKEND_URL + '/category/get')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // setSubCate(data.find((item) => item._id === selectedCate))
          setCate(data.data)
          setParentCate(data.data)
          // let parentArr = []
          // for (let i of data.data) {

          //   if (i.parent_id === null) {
          //     parentArr.push(i)
          //   }
          // }

          // setParentCate(parentArr)
        }
        // setSubCate(data)
        setSpinner(false)
      })
      .catch((err) => {
        setSpinner(false)
      })
  }

  const filterSubCate = (id) => {
    setSelectedCate(id)
    let subArr = []
    for (let i of cate) {
      if (i.parent_id === id) {
        subArr.push(i)
      }
    }
    setSubCategory(subArr)
  }

  return (
    <Dashboard>
      <Row className=' category_wrapper my-4'>
        <Col md={6} lg={6} xl={6} className='leftSidebar'>
          <h4
            className='mb-4 d-flex align-items-center'
            style={{ fontWeight: 'bold' }}
          >
            Categories{' '}
            {spinner && (
              <Spinner
                animation='border'
                role='status'
                size='md'
                className='mx-2'
              />
            )}
          </h4>

          <ListGroup style={{ backgroundColor: '#FFFEF0' }}>
            {parentCate &&
              parentCate.map((category) => (
                <ListGroup.Item
                  key={category._id}
                  onClick={() => {
                    setSubCate(category)

                    filterSubCate(category._id)
                  }}
                  style={{
                    background:
                      category._id === subCate?._id ? ' #FFFAC1' : '#FFFEF0',
                    cursor: 'pointer',
                  }}
                >
                  <div className='d-flex justify-content-center align-items-center'>
                    <img
                      src={'/assets/cooking-products.png'}
                      className='cate_img'
                      alt=''
                    />
                    <h5 className=' mx-2 my-0'>{category.name}</h5>
                    <EditCategory allCategory={allCategory} category={category}>
                      <img src='/assets/edit.png' className='edit_img' alt='' />
                    </EditCategory>
                  </div>
                </ListGroup.Item>
              ))}
            <AddNewCategory allCategory={allCategory} allCateInfo={parentCate}>
              <Button className=' d-flex justify-content-center align-items-center  my-2'>
                <img className='mr-3' src='/assets/+.png' alt='' /> New Category
              </Button>
            </AddNewCategory>
          </ListGroup>
        </Col>
        {
          // <>
          //   <Col md={6} lg={6} xl={6} className='rightSidebar'>
          //     {!selectedCate && (
          //       <div>
          //         <h6 className='mb-5' style={{ fontWeight: 'bold' }}>
          //           No Category Selected
          //         </h6>
          //         <p className='mt-5 '>
          //           Select a Category To See it’s Subcategory
          //         </p>
          //       </div>
          //     )}
          //     {selectedCate && (
          //       <h3 className='subCate_part'>Category: {subCate?.name}</h3>
          //     )}
          //     <ListGroup style={{ backgroundColor: '#FFFEF0' }}>
          //       {subCategory &&
          //         subCategory?.map((item) => (
          //           <ListGroup.Item
          //             key={item._id}
          //             style={{ backgroundColor: '#FFFEF0' }}
          //           >
          //             <div className='d-flex justify-content-center align-items-center'>
          //               <h6 className='mx-1 my-2'>{item.name}</h6>
          //               <EditSubCategory
          //                 subcategory={item}
          //                 cate={subCate}
          //                 allCategory={allCategory}
          //               >
          //                 <img
          //                   src='/assets/edit.png'
          //                   className='edit_img'
          //                   alt=''
          //                 />
          //               </EditSubCategory>
          //             </div>
          //           </ListGroup.Item>
          //         ))}
          //       {selectedCate && (
          //         <AddNewSubCat subCate={subCate} allCategory={allCategory}>
          //           <Button className=' d-flex justify-content-center align-items-center  my-2'>
          //             <img className='mr-3' src='/assets/+.png' alt='' /> New
          //             Sub-Category
          //           </Button>
          //         </AddNewSubCat>
          //       )}
          //     </ListGroup>
          //   </Col>
          // </>
        }
      </Row>
    </Dashboard>
  )
}

export default Categories
