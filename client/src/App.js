import React from 'react'
import 'antd/dist/antd.css';
import { Route, Switch, withRouter } from 'react-router-dom'

import { Product } from './Pages/Product/Product';

import { Orders } from './Pages/Profile/Order&Returns';
import { Profile } from './Pages/Profile/Profile';
import { TrackOrders } from './Pages/Profile/TrackOrders';
import { EditProfile } from './Pages/Profile/EditProfile';

import AdminRoute from './Routes/AdminRoute';

import { AdminLogin } from './Pages/Auth/AdminLogin';
import { DefaultComp } from './Pages/404';
import { CompletedOrders } from './Pages/Profile/CompletedOrders';
import { AllProducts } from './Pages/AllProducts/AllProducts';
import { Home } from './Pages/Home/Home';
import { Footer } from './Components/Footer/Footer';
import { NotAuthorisedPage } from './Pages/403';
import UserRoute from './Routes/UserRoutes';
import { Signup } from './Pages/Auth/Signup/Signup';
import { Login } from './Pages/Auth/Login/Login';
import { AdminProducts } from './Pages/Admin/Products/Products';
import { GetCategories } from './Pages/Admin/Categories/GetCategories';
import { AdminCreateProducts } from './Pages/Admin/Products/CreateProducts';
import { AdminUpdateProduct } from './Pages/Admin/Products/UpdateProduct';
import { AdminOrdersManagement } from './Pages/Admin/Orders/OrdersManagement';
import { AdminProfile } from './Pages/Admin/Profile/AdminProfile';
import { EditAdminProfile } from './Pages/Admin/Profile/EditAdminProfile';
import { SendResetPasswordLink } from './Pages/Auth/Forgot-Password/SendResetPasswordLink';
import { UpdatePassword } from './Pages/Auth/Forgot-Password/UpdatePassword';
import { Navbar } from './Components/Navbar/Navbar';
import Cart from './Pages/Cart/Cart';
import Faq from './Pages/Faq/Faq';
import Privacy from './Pages/Privacy/Privacy';
import TermsOfService from './Pages/TermsOfService/TermsOfService';
import { Users } from './Pages/Admin/Users/GetAllUsers';
import StaffRoutes from './Routes/StaffRoutes';
import { StaffOrdersManagement } from './Pages/Staff/Orders/OrdersManagement';
import Checkout from './Pages/Checkout/Checkout';
import { DiscountCodes } from './Pages/Admin/DiscountCodes/DiscountCodes';

const App = () => {

  let get = document.getElementsByClassName('paypal-button-tagline')[0];
  console.log(get)
  if (get) { get.style.visibility = 'hidden' }


  return (
    <div className='App'>
      <div>
        <Navbar />
        <div style={{ minHeight: "74.3vh" }}>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/all-products' component={AllProducts} />
            <UserRoute exact path='/orders' component={Orders} />
            <UserRoute exact path='/completed-orders' component={CompletedOrders} />
            <UserRoute exact path='/orders/track/:id' component={TrackOrders} />
            <UserRoute exact path='/profile' component={Profile} />
            <UserRoute exact path='/profile/update/:id' component={EditProfile} />

            <Route exact path='/forgot-password' component={SendResetPasswordLink} />
            <Route exact path='/update/:token' component={UpdatePassword} />

            <Route exact path='/login' component={Login} />
            <Route exact path='/signup' component={Signup} />
            <Route exact path='/product/:id' component={Product} />
            <Route exact path='/cart' component={Cart} />
            <Route exact path='/checkout' component={Checkout} />
            <Route exact path='/faq' component={Faq} />
            <Route exact path='/privacy' component={Privacy} />
            <Route exact path='/terms' component={TermsOfService} />

            <Route exact path='/admin/login' component={AdminLogin} />
            <AdminRoute exact path='/admin/all-products' component={AdminProducts} />
            <AdminRoute exact path='/admin/all-categories' component={GetCategories} />
            <AdminRoute exact path='/admin/discounts' component={DiscountCodes} />
            <AdminRoute exact path='/admin/create-products' component={AdminCreateProducts} />
            <AdminRoute exact path='/admin/product/update/:id' component={AdminUpdateProduct} />
            <AdminRoute exact path='/admin/orders' component={AdminOrdersManagement} />
            <AdminRoute exact path='/admin/users' component={Users} />
            <AdminRoute exact path='/admin/profile' component={AdminProfile} />
            <AdminRoute exact path='/admin/profile/update/:id' component={EditAdminProfile} />

            <StaffRoutes exact path='/staff/orders' component={StaffOrdersManagement} />

            <Route exact path='/no-permission' component={NotAuthorisedPage} />
            <Route component={DefaultComp} />
          </Switch>
        </div>
      </div>
      <Footer />
    </div>

  )
}

export default withRouter(App);