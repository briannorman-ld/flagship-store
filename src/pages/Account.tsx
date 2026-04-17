import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { useLDFlags } from '../hooks/useLDFlags'
import type { Order } from '../types'
import { showToast } from '../components/Toast'
import FlagImage from '../components/FlagImage'

type Tab = 'profile' | 'orders' | 'wishlist' | 'addresses'

export default function Account() {
  const { user, isLoggedIn, logout, updateUser } = useAuth()
  const { items: wishlistItems, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const flags = useLDFlags()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const defaultTab = (searchParams.get('tab') as Tab) ?? 'profile'
  const [tab, setTab] = useState<Tab>(defaultTab)
  const [orders, setOrders] = useState<Order[]>([])
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
  })

  useEffect(() => {
    if (!isLoggedIn) navigate('/login', { state: { from: '/account' } })
  }, [isLoggedIn, navigate])

  useEffect(() => {
    const allOrders: Order[] = JSON.parse(localStorage.getItem('flagship_orders') || '[]')
    const userOrders = user?.orderIds
      ? allOrders.filter(o => user.orderIds.includes(o.id))
      : []
    setOrders(userOrders)
  }, [user])

  if (!user) return null

  const tabs: { id: Tab; label: string }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'orders', label: 'Order History' },
    ...(flags['enable-wishlist'] ? [{ id: 'wishlist' as Tab, label: 'Wishlist' }] : []),
    { id: 'addresses', label: 'Addresses' },
  ]

  function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    updateUser(profileForm)
    showToast('Profile updated')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
        <button onClick={() => { logout(); navigate('/') }} className="text-sm text-red-600 hover:underline">Sign Out</button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <nav className="w-full md:w-48 shrink-0">
          <ul className="space-y-1">
            {tabs.map(t => (
              <li key={t.id}>
                <button
                  onClick={() => setTab(t.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? 'bg-[#1B2A4A] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <div className="flex-1">
          {tab === 'profile' && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-5">Profile Information</h2>
              <form onSubmit={saveProfile} className="space-y-4 max-w-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input value={profileForm.firstName} onChange={e => setProfileForm(f => ({ ...f, firstName: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input value={profileForm.lastName} onChange={e => setProfileForm(f => ({ ...f, lastName: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={profileForm.email} onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                </div>
                <button type="submit" className="bg-[#1B2A4A] text-white font-medium px-6 py-2.5 rounded-lg hover:bg-[#B22234] transition-colors text-sm">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {tab === 'orders' && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-5">Order History</h2>
              {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>No orders yet.</p>
                  <Link to="/" className="text-[#B22234] text-sm mt-2 inline-block hover:underline">Start shopping →</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                      <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                        <div>
                          <span className="font-mono text-sm font-semibold text-[#1B2A4A]">{order.id}</span>
                          <p className="text-xs text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          <p className="text-sm font-bold text-gray-900 mt-1">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 space-y-0.5">
                        {order.items.map(item => (
                          <p key={item.product.id}>{item.product.name} × {item.quantity}</p>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">Est. delivery: {order.estimatedDelivery}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'wishlist' && flags['enable-wishlist'] && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-5">Wishlist</h2>
              {wishlistItems.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>Your wishlist is empty.</p>
                  <Link to="/" className="text-[#B22234] text-sm mt-2 inline-block hover:underline">Browse flags →</Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlistItems.map(product => (
                    <div key={product.id} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                      <Link to={`/product/${product.id}`}>
                        <FlagImage flagImagePath={product.flagImagePath} isoCode={product.isoCode} alt={product.name} size="card" />
                      </Link>
                      <div className="p-3">
                        <Link to={`/product/${product.id}`} className="text-sm font-medium text-gray-900 hover:text-[#B22234] line-clamp-2">{product.name}</Link>
                        <p className="text-sm font-semibold text-gray-900 mt-1">${product.price.toFixed(2)}</p>
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => { addToCart(product, 1); showToast('Added to cart') }} className="flex-1 text-xs bg-[#1B2A4A] text-white py-1.5 rounded-lg hover:bg-[#B22234] transition-colors">
                            Add to Cart
                          </button>
                          <button onClick={() => removeFromWishlist(product.id)} className="text-xs border border-gray-200 px-2 py-1.5 rounded-lg text-gray-500 hover:text-red-500">✕</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'addresses' && (
            <div>
              <h2 className="font-semibold text-gray-900 mb-5">Saved Addresses</h2>
              {(user.addresses ?? []).length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>No saved addresses. Complete a checkout to save one.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {user.addresses.map(addr => (
                    <div key={addr.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-sm text-gray-700">
                      <p className="font-medium text-gray-900">{addr.firstName} {addr.lastName}</p>
                      <p>{addr.street}</p>
                      <p>{addr.city}, {addr.state} {addr.zip}</p>
                      <p>{addr.country}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
