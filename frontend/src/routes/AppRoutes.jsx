import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import Books from '../pages/Books'
import BookDetails from '../pages/BookDetails'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import Orders from '../pages/Orders'
import Profile from '../pages/Profile'
import Wishlist from '../pages/Wishlist'
import PaymentSuccess from '../pages/PaymentSuccess'
import NotFound from '../pages/NotFound'
import Dashboard from '../pages/admin/Dashboard'
import ProductManagement from '../pages/admin/ProductManagement'
import OrderManagement from '../pages/admin/OrderManagement'
import UserManagement from '../pages/admin/UserManagement'
import PrivateRoute from '../components/PrivateRoute'
import AdminRoute from '../components/AdminRoute'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path="books" element={<Books />} />
        <Route path="books/:id" element={<BookDetails />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        {/* Protected routes */}
        <Route path="cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path="wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
        <Route path="checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="payment-success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />
        <Route path="orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
        <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

        {/* Admin routes — requires ADMIN role */}
        <Route path="admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="admin/products" element={<AdminRoute><ProductManagement /></AdminRoute>} />
        <Route path="admin/orders" element={<AdminRoute><OrderManagement /></AdminRoute>} />
        <Route path="admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
