import React, { useEffect, useState } from 'react'
import { Menu } from 'antd'
// import './ProductPage.scss'
import SubMenu from 'antd/lib/menu/SubMenu'
import './NewCategories.scss'
import Dashboard from '../Dashboard/Dashboard'
import AddNewCategory from '../../../pages/AdddNewCategory/AdddNewCategory'
import EditCategory from '../../../pages/EditCategory/EditCategory'

const url = process.env.REACT_APP_BACKEND_URL + '/category/get '
const getData = async () => {
  try {
    const res = await fetch(url)
    const data = await res.json()
    const fetchedCategory = data.data
    const newCategory = [...fetchedCategory]
    for (let i = 0; i < fetchedCategory.length; i++) {
      const subs = fetchedCategory.filter(
        (cat) => cat.parent_id === newCategory[i]._id
      )
      newCategory[i].subs = subs
    }
    const finalCategory = newCategory.filter((cat) => cat.parent_id === null)

    return finalCategory
  } catch (error) {}
}

const renderCategories = (cat, getCats) => {
  if (cat.subs.length) {
    return (
      <SubMenu key={cat._id} title={cat.name}>
        {cat.subs.map((c, idx) => {
          return renderCategories(c, getCats)
        })}

        <div className='d-flex justify-content-center align-items-center'>
          <AddNewCategory
            parent={cat._id}
            parentName={cat.name}
            allCategory={getCats}
          >
            <button className='btn add_newBtn mr-1 my-2 d-flex justify-content-center align-items-center'>
              <img className='mr-3' src='/assets/+.png' alt='' />
              New sub-category under {cat.name}
            </button>
          </AddNewCategory>{' '}
          <EditCategory allCategory={getCats} cat={cat}>
            <button className='btn edit_newBtn ml-1  my-2 d-flex justify-content-center align-items-center'>
              Edit category {cat.name}
              <img className='ml-3' src='/assets/edit.svg' alt='' />
            </button>
          </EditCategory>
        </div>
      </SubMenu>
    )
  }
  return (
    <SubMenu key={cat._id} title={cat.name}>
      <div className='d-flex justify-content-center align-items-center'>
        {!cat?.parent_id && (
          <AddNewCategory
            parent={cat._id}
            parentName={cat.name}
            allCategory={getCats}
          >
            <button className='btn add_newBtn mr-1  my-2 d-flex justify-content-center align-items-center'>
              <img className='mr-3' src='/assets/+.png' alt='' />
              New sub-category under {cat.name}
            </button>
          </AddNewCategory>
        )}
        <EditCategory allCategory={getCats} cat={cat}>
          <button className='btn edit_newBtn ml-1 my-2 d-flex justify-content-center align-items-center'>
            Edit category {cat.name}
            <img className='ml-3' src='/assets/edit.svg' alt='' />
          </button>
        </EditCategory>
      </div>
    </SubMenu>
  )
}

const NewCategories = () => {
  const ref = React.useRef()
  const [cats, setCats] = useState([])
  useEffect(() => {
    getCats()
  }, [])
  const getCats = async () => {
    const data = await getData()
    setCats(data)
  }

  return (
    <Dashboard>
      <div ref={ref} className='mt-5 '>
        <h4
          className='mb-4 d-flex align-items-center'
          style={{ fontWeight: 'bold' }}
        >
          Categories{' '}
        </h4>{' '}
        <Menu
          mode='inline'
          multiple={false}
          // onClick={(item) => handleClick(item)}
          className='categories'
        >
          {cats.map((cat) => renderCategories(cat, getCats))}
          <AddNewCategory
            parent=''
            parentName={'No parent'}
            allCategory={getCats}
          >
            <button className='btn add_newBtn my-2 d-flex justify-content-center align-items-center'>
              {' '}
              <img className='mr-3' src='/assets/+.png' alt='' />
              New Category
            </button>
          </AddNewCategory>
        </Menu>
      </div>
    </Dashboard>
  )
}

export default NewCategories
