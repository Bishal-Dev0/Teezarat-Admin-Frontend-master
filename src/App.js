import { Redirect, Route, Switch } from 'react-router-dom'
import './App.scss'
import NewCategories from './components/Admin/Categories/NewCategories'
import Delivery from './components/Admin/Delivery/Delivery'
import Order from './components/Admin/Order/Order'
import Products from './components/Admin/Products/Products'
import Promotions from './components/Admin/Promotions/Promotions'
import Receipts from './components/Admin/Receipts/Receipts'
import Users from './components/Admin/Users/Users'
import Activate from './components/Authentication/Activate'
import ForgotPassword from './components/Authentication/ForgotPassword'
import Login from './components/Authentication/Login'
import Register from './components/Authentication/Register'
import ResetPassword from './components/Authentication/ResetPassword'
import PrivateRoute from './lib/PrivateRoute'
import 'antd/dist/antd.css'
import Stocks from './components/Admin/Stocks/Stocks'
import AddNewStocks from './components/Admin/Stocks/AddNewStocks'
// import Faq from './pages/Faq/Faq'
import HeaderLayout from './components/HeaderLayout/HeaderLayout'
import StaticPages from './pages/StaticPages/StaticPages'
import AppFaq from './pages/StaticPages/AppFaq'
import AboutUs from './pages/StaticPages/AboutUs'
import Terms from './pages/StaticPages/Terms'
import SystemReport from './pages/SystemReport/SystemReport'
import AdNewOrder from './components/Admin/Order/AdNewOrder'
import Home from './pages/Home/Home'
import Footer from './components/Footer/Footer'
import Policy from './pages/StaticPages/Policy'

// const fetcher = (...args) => fetch(...args).then((res) => res.json())

function App() {
  return (
    <>
      {/* <Provider> */}
      <Switch>
        <Route path='/' exact>
          <Home />
        </Route>
        <Redirect from='/admin' to='admin/orders' exact />

        <Route path='/login' exact>
          <HeaderLayout>
            <Login />
          </HeaderLayout>
        </Route>
        <Route path='/register' exact>
          <HeaderLayout>
            <Register />
          </HeaderLayout>
        </Route>
        <Route path='/auth/activate/:token' exact>
          <HeaderLayout>
            <Activate />
          </HeaderLayout>
        </Route>
        <Route path='/auth/password/forgot' exact>
          <HeaderLayout>
            <ForgotPassword />
          </HeaderLayout>
        </Route>
        <Route path='/auth/password/reset/:token' exact>
          <HeaderLayout>
            <ResetPassword />
          </HeaderLayout>
        </Route>
        <PrivateRoute path='/admin/user' exact>
          <HeaderLayout>
            <Users />
          </HeaderLayout>
        </PrivateRoute>
        <PrivateRoute path='/admin/receipts' exact>
          <HeaderLayout>
            <Receipts />
          </HeaderLayout>
        </PrivateRoute>
        <PrivateRoute path='/admin/orders' exact>
          <HeaderLayout>
            <Order />
          </HeaderLayout>
        </PrivateRoute>
        <PrivateRoute path='/admin/category' exact>
          <HeaderLayout>
            <NewCategories />
          </HeaderLayout>
        </PrivateRoute>
        <PrivateRoute path='/admin/products' exact>
          <HeaderLayout>
            <Products />
          </HeaderLayout>
        </PrivateRoute>
        <PrivateRoute path='/admin/promotion' exact>
          <HeaderLayout>
            <Promotions />
          </HeaderLayout>
        </PrivateRoute>
        <PrivateRoute path='/admin/delivery' exact>
          <HeaderLayout>
            <Delivery />
          </HeaderLayout>
        </PrivateRoute>
        <PrivateRoute path='/admin/stocks' exact>
          <HeaderLayout>
            <Stocks />
          </HeaderLayout>
        </PrivateRoute>
        <PrivateRoute path='/admin/stocks/add-new-stocks' exact>
          <HeaderLayout>
            <AddNewStocks />
          </HeaderLayout>
        </PrivateRoute>
        <PrivateRoute path='/admin/order/create-new-order' exact>
          <HeaderLayout>
            <AdNewOrder />
          </HeaderLayout>
        </PrivateRoute>
        {/* <Route path='/faq' exact>
              <HeaderLayout>
                <Faq />
              </HeaderLayout>
            </Route> */}
        <PrivateRoute path='/static-pages' exact>
          <HeaderLayout>
            <StaticPages />
          </HeaderLayout>
        </PrivateRoute>
        <PrivateRoute path='/admin/system-report' exact>
          <HeaderLayout>
            <SystemReport />
          </HeaderLayout>
        </PrivateRoute>
        <Route path='/static-pages/faq' exact>
          <AppFaq />
        </Route>
        <Route path='/static-pages/terms' exact>
          <Terms />
        </Route>
        <Route path='/static-pages/policy' exact>
          <Policy />
        </Route>
        <Route path='/static-pages/about-us' exact>
          <AboutUs />
        </Route>
        <Route path='*'>
          <HeaderLayout>
            <h1 className='fw-bold text-center' style={{ margin: '5rem auto' }}>
              Not Found!
            </h1>
          </HeaderLayout>
        </Route>
      </Switch>

      {/* </Provider> */}
      <Footer />
    </>
  )
}

export default App
