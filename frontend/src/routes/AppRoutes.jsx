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
import NotFound from '../pages/NotFound'
import Dashboard from '../pages/admin/Dashboard'
import ProductManagement from '../pages/admin/ProductManagement'
import OrderManagement from '../pages/admin/OrderManagement'
import UserManagement from '../pages/admin/UserManagement'

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
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="orders" element={<Orders />} />

        {/* Admin routes */}
        <Route path="admin" element={<Dashboard />} />
        <Route path="admin/products" element={<ProductManagement />} />
        <Route path="admin/orders" element={<OrderManagement />} />
        <Route path="admin/users" element={<UserManagement />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
