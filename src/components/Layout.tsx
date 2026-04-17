import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useLDFlags } from '../hooks/useLDFlags'
import { categoryMeta } from '../data/products'
import { ToastContainer } from './Toast'

const categories = Object.entries(categoryMeta).map(([slug, meta]) => ({
  slug,
  label: meta.label,
  description: meta.description,
}))

export default function Layout({ children }: { children: React.ReactNode }) {
  const { itemCount } = useCart()
  const { isLoggedIn, user, logout } = useAuth()
  const flags = useLDFlags()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Promo banner */}
      {flags['show-promo-banner'] && (
        <div className="bg-[#B22234] text-white text-center text-sm py-2 px-4">
          Free shipping on orders over ${flags['free-shipping-threshold']} &nbsp;|&nbsp; Use code{' '}
          <span className="font-bold">FLAGSHIP20</span> for 20% off
        </div>
      )}

      {/* Nav */}
      <header className="bg-[#1B2A4A] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <span className="text-2xl">🏳</span>
              <span>FlagShip</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
              {categories.map(cat => (
                <Link
                  key={cat.slug}
                  to={`/flags/${cat.slug}`}
                  className="text-gray-300 hover:text-white transition-colors whitespace-nowrap"
                >
                  {cat.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="hidden md:flex items-center bg-white/10 rounded-lg px-3 py-1.5">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search flags..."
                  className="bg-transparent text-white placeholder-gray-400 text-sm outline-none w-36"
                />
                <button type="submit" className="text-gray-400 hover:text-white ml-1">🔍</button>
              </form>

              {/* Account */}
              {isLoggedIn ? (
                <div className="relative group">
                  <button className="flex items-center gap-1 text-sm text-gray-300 hover:text-white">
                    <span>👤</span>
                    <span className="hidden sm:inline">{user?.firstName}</span>
                  </button>
                  <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Account</Link>
                    <Link to="/account?tab=orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Order History</Link>
                    {flags['enable-wishlist'] && (
                      <Link to="/account?tab=wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Wishlist</Link>
                    )}
                    <hr className="my-1" />
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Sign Out</button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="text-sm text-gray-300 hover:text-white flex items-center gap-1">
                  <span>👤</span>
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative flex items-center gap-1 text-gray-300 hover:text-white">
                <span className="text-xl">🛒</span>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#B22234] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden text-gray-300 hover:text-white text-2xl"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#1B2A4A]">
            <div className="px-4 py-3 space-y-1">
              {categories.map(cat => (
                <Link
                  key={cat.slug}
                  to={`/flags/${cat.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 text-sm text-gray-300 hover:text-white"
                >
                  {cat.label}
                </Link>
              ))}
              <form onSubmit={handleSearch} className="flex items-center mt-3 bg-white/10 rounded-lg px-3 py-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search flags..."
                  className="bg-transparent text-white placeholder-gray-400 text-sm outline-none flex-1"
                />
                <button type="submit">🔍</button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#1B2A4A] text-gray-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
                <span>🏳</span> FlagShip
              </div>
              <p className="text-sm">Raise Your Colors. Quality flags for every occasion, delivered fast.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Shop</h4>
              <ul className="space-y-2 text-sm">
                {categories.slice(0, 4).map(c => (
                  <li key={c.slug}><Link to={`/flags/${c.slug}`} className="hover:text-white">{c.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">More</h4>
              <ul className="space-y-2 text-sm">
                {categories.slice(4).map(c => (
                  <li key={c.slug}><Link to={`/flags/${c.slug}`} className="hover:text-white">{c.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Help</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link to="/shipping" className="hover:text-white">Shipping & Returns</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
                {isLoggedIn
                  ? <li><Link to="/account" className="hover:text-white">My Account</Link></li>
                  : <li><Link to="/login" className="hover:text-white">Sign In</Link></li>
                }
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs">
            © {new Date().getFullYear()} FlagShip. All rights reserved.
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  )
}
