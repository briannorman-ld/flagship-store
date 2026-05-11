import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useLDFlags } from '../hooks/useLDFlags'
import { useStoreMetricTrack } from '../hooks/useStoreMetricTrack'
import { STORE_METRIC_EVENTS } from '../analytics/storeMetricEvents'
import { categoryMeta } from '../data/products'
import { ToastContainer } from './Toast'
import { showToast } from '../lib/toast-bus'

const PROMO_CODE = 'FLAGSHIP20'
const PROMO_COPY_FLAG_KEY = 'eh-desktop-promo-code-copy-desktop'

const categories = Object.entries(categoryMeta).map(([slug, meta]) => ({
  slug,
  label: meta.label,
  description: meta.description,
}))

/** Shorter header nav text (full labels stay in PLPs, footer, etc.) */
function navItemLabel(label: string) {
  return label.replace(/\s+Flags$/i, '').trim()
}

function isDesktopViewport() {
  return typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { itemCount } = useCart()
  const { isLoggedIn, user, logout } = useAuth()
  const flags = useLDFlags()
  const trackMetric = useStoreMetricTrack()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [promoCopied, setPromoCopied] = useState(false)
  const copyablePromoEnabled = flags[PROMO_COPY_FLAG_KEY]

  useEffect(() => {
    if (!flags['show-promo-banner'] || !isDesktopViewport()) return
    trackMetric(STORE_METRIC_EVENTS.promoBannerViewed, {
      flagKey: PROMO_COPY_FLAG_KEY,
      variation: copyablePromoEnabled ? 'eh-arm-1' : 'eh-arm-0',
      placement: 'top_promo_banner',
      promoCode: PROMO_CODE,
    })
  }, [copyablePromoEnabled, flags, trackMetric])

  useEffect(() => {
    if (!promoCopied) return
    const timer = window.setTimeout(() => setPromoCopied(false), 2200)
    return () => window.clearTimeout(timer)
  }, [promoCopied])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  async function copyPromoCode() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(PROMO_CODE)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = PROMO_CODE
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'absolute'
        textarea.style.left = '-9999px'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }

      setPromoCopied(true)
      showToast('Promo code copied')
      trackMetric(STORE_METRIC_EVENTS.promoCodeCopied, {
        flagKey: PROMO_COPY_FLAG_KEY,
        variation: 'eh-arm-1',
        placement: 'top_promo_banner',
        promoCode: PROMO_CODE,
      })
    } catch {
      showToast('Could not copy promo code', 'error')
    }
  }

  function handleCartClick() {
    trackMetric(STORE_METRIC_EVENTS.cartIconClicked, {
      itemCount,
      source: 'header_cart_icon',
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Promo banner */}
      {flags['show-promo-banner'] && (
        <div className="flex items-stretch justify-center bg-[#0f1729]">
          <div className="flex max-w-5xl w-full mx-auto shadow-md">
            <div className="flex items-center bg-[#3C3B6E] pl-2 pr-1.5 sm:pl-4 sm:pr-2 border-y border-l border-white/15 rounded-l-md">
              <span
                className="fi fi-us rounded shadow-md border border-black/20 overflow-hidden leading-none"
                style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}
                title="United States"
              />
            </div>
            <div className="flex-1 bg-[#B22234] text-white text-center text-xs sm:text-sm py-2.5 px-2 sm:px-5 flex items-center justify-center gap-1.5 sm:gap-2 border-y border-[#8B1538] leading-snug">
              <span>
                Free shipping on orders over ${flags['free-shipping-threshold']}
                <span className="hidden sm:inline"> &nbsp;|&nbsp; </span>
                <span className="sm:hidden"> · </span>
                Use code{' '}
              </span>
              {copyablePromoEnabled ? (
                <button
                  type="button"
                  onClick={copyPromoCode}
                  className="hidden lg:inline-flex items-center gap-1 rounded-full border border-white/35 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#B22234] shadow-sm transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#B22234]"
                  aria-label={`Copy promo code ${PROMO_CODE}`}
                >
                  <span>{PROMO_CODE}</span>
                  <span className="text-[10px] normal-case tracking-normal text-[#1B2A4A]">
                    {promoCopied ? 'Copied!' : 'Copy code'}
                  </span>
                </button>
              ) : null}
              <span className={`${copyablePromoEnabled ? 'lg:hidden' : ''} font-bold`}>{PROMO_CODE}</span>
              <span> for 20% off</span>
            </div>
            <div className="flex items-center bg-[#3C3B6E] pr-2 pl-1.5 sm:pr-4 sm:pl-2 border-y border-r border-white/15 rounded-r-md">
              <span
                className="fi fi-us rounded shadow-md border border-black/20 overflow-hidden leading-none"
                style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}
                title="United States"
              />
            </div>
          </div>
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
            <nav className="hidden lg:flex items-center gap-4 text-sm font-medium">
              {categories.map(cat => (
                <Link
                  key={cat.slug}
                  to={`/flags/${cat.slug}`}
                  className="text-gray-300 hover:text-white transition-colors whitespace-nowrap"
                >
                  {navItemLabel(cat.label)}
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
              <Link to="/cart" onClick={handleCartClick} className="relative text-gray-300 hover:text-white flex items-center">
                <span className="text-xl">🛒</span>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#B22234] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile menu button */}
              <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-gray-300 hover:text-white">
                <span className="text-2xl">☰</span>
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <form onSubmit={handleSearch} className="md:hidden pb-3">
            <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search flags..."
                className="bg-transparent text-white placeholder-gray-400 text-sm outline-none flex-1"
              />
              <button type="submit" className="text-gray-400 hover:text-white">🔍</button>
            </div>
          </form>

          {/* Mobile nav */}
          {menuOpen && (
            <nav className="lg:hidden pb-4 border-t border-white/10 pt-3">
              <div className="grid grid-cols-2 gap-2">
                {categories.map(cat => (
                  <Link
                    key={cat.slug}
                    to={`/flags/${cat.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-300 hover:text-white text-sm py-1"
                  >
                    {navItemLabel(cat.label)}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-3">🏳 FlagShip</h3>
              <p className="text-sm text-gray-400">Premium flags for every occasion. Quality materials, fast shipping.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Shop</h4>
              <ul className="space-y-2 text-sm">
                {categories.slice(0, 4).map(cat => (
                  <li key={cat.slug}><Link to={`/flags/${cat.slug}`} className="hover:text-white">{cat.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/account" className="hover:text-white">My Account</Link></li>
                <li><Link to="/cart" className="hover:text-white">Cart</Link></li>
                <li><a href="mailto:support@example.com" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Newsletter</h4>
              <p className="text-sm text-gray-400 mb-3">Get flag care tips and exclusive offers.</p>
              <div className="flex">
                <input type="email" placeholder="Email" className="flex-1 bg-white/10 rounded-l-lg px-3 py-2 text-sm outline-none" />
                <button className="bg-[#B22234] text-white px-4 rounded-r-lg text-sm font-medium hover:bg-red-700">Join</button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-gray-500">
            © 2025 FlagShip. Demo ecommerce store.
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  )
}
