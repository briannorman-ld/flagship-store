import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import CategoryPLP from './pages/CategoryPLP'
import Search from './pages/Search'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Account from './pages/Account'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import FlagsDebug from './pages/FlagsDebug'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flags/:slug" element={<CategoryPLP />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/flags-debug" element={<FlagsDebug />} />
        <Route path="*" element={
          <div className="max-w-2xl mx-auto px-4 py-24 text-center">
            <div className="text-6xl mb-6">🏳</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h1>
            <a href="/" className="text-[#B22234] hover:underline">← Back to home</a>
          </div>
        } />
      </Routes>
    </Layout>
  )
}
