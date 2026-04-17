import { Link } from 'react-router-dom'
import { products, categoryMeta } from '../data/products'
import ProductCard from '../components/ProductCard'
import { useLDFlags } from '../hooks/useLDFlags'

const categoryCards = [
  { slug: 'american', emoji: '🇺🇸', bg: 'from-blue-900 to-red-700' },
  { slug: 'nautical', emoji: '⚓', bg: 'from-blue-700 to-cyan-500' },
  { slug: 'state', emoji: '🗺️', bg: 'from-green-700 to-emerald-500' },
  { slug: 'golf', emoji: '⛳', bg: 'from-green-600 to-lime-400' },
]

const featuredProducts = products.filter(p => p.featured).slice(0, 4)
const newArrivals = products.slice(-4)

/** Self-hosted in /public; works with Vite `base` on GitHub Pages */
const heroImageSrc = `${import.meta.env.BASE_URL}hero-american-flag-mountains.jpg`

export default function Home() {
  const flags = useLDFlags()
  const heroVariant = flags['homepage-hero-variant']

  return (
    <div>
      {/* Hero */}
      {heroVariant === 'minimal' ? (
        <section className="bg-white border-b border-gray-100 py-16 px-4 text-center">
          <h1 className="text-4xl font-bold text-[#1B2A4A] mb-4">Raise Your Colors.</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">Quality flags for every occasion, from American flags to nautical signal sets.</p>
          <Link to="/flags/american" className="inline-block bg-[#B22234] text-white font-semibold px-8 py-3 rounded-lg hover:bg-red-700 transition-colors">
            Shop All Flags
          </Link>
        </section>
      ) : heroVariant === 'dark' ? (
        <section className="bg-gray-950 text-white py-24 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="text-6xl mb-6">🏳</div>
            <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Raise Your Colors.</h1>
            <p className="text-xl text-gray-400 mb-8">Premium flags for patriots, sailors, golfers, and everyone in between.</p>
            <Link to="/flags/american" className="inline-block bg-[#C9A027] text-gray-950 font-bold px-10 py-4 rounded-lg hover:bg-yellow-500 transition-colors text-lg">
              Shop Now →
            </Link>
          </div>
        </section>
      ) : (
        /* control / default hero — American flag, Black Canyon of the Gunnison (CO) */
        <section className="relative text-white overflow-hidden min-h-[min(85vh,640px)] flex flex-col">
          <img
            src={heroImageSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
            decoding="async"
            fetchPriority="high"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#0f1729] via-[#1B2A4A]/85 to-[#1B2A4A]/55"
            aria-hidden
          />
          <div className="relative flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 flex flex-col items-center justify-center text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-sm">
              Raise Your Colors.
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-xl drop-shadow-sm">
              The finest flags for patriots, sailors, golfers, and collectors. Ships fast, built to last.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link to="/flags/american" className="bg-[#B22234] text-white font-semibold px-8 py-3 rounded-lg hover:bg-red-700 transition-colors shadow-lg">
                Shop American Flags
              </Link>
              <Link to="/flags/nautical" className="bg-white/15 backdrop-blur-sm text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/25 transition-colors border border-white/20">
                Browse All Categories
              </Link>
            </div>
          </div>
          <p className="relative z-10 text-center text-[10px] sm:text-xs text-white/50 pb-3 px-4">
            Photo:{' '}
            <a
              href="https://unsplash.com/photos/LgYYGtA23RY"
              className="underline hover:text-white/70"
              target="_blank"
              rel="noreferrer noopener"
            >
              Laura Seaman
            </a>
            {' '}/ Unsplash
          </p>
        </section>
      )}

      {/* Category cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categoryCards.map(({ slug, emoji, bg }) => (
            <Link
              key={slug}
              to={`/flags/${slug}`}
              className={`bg-gradient-to-br ${bg} text-white rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:scale-105 transition-transform shadow-md aspect-square`}
            >
              <span className="text-4xl">{emoji}</span>
              <span className="font-semibold text-center text-sm">{categoryMeta[slug].label}</span>
            </Link>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(categoryMeta).slice(4).map(([slug, meta]) => (
            <Link
              key={slug}
              to={`/flags/${slug}`}
              className="border border-gray-200 text-gray-700 rounded-xl p-4 flex items-center gap-3 hover:border-[#1B2A4A] hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-sm">{meta.label} →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Best Sellers</h2>
            <Link to="/flags/american" className="text-sm text-[#B22234] font-medium hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: '🇺🇸', title: 'Made in USA Options', desc: 'Proudly American-made flags available' },
            { icon: '🚚', title: 'Fast Shipping', desc: 'Most orders ship within 1 business day' },
            { icon: '✅', title: 'Satisfaction Guaranteed', desc: '30-day returns on all items' },
            { icon: '📦', title: 'Bulk Discounts', desc: 'Save more when you order in quantity' },
          ].map(item => (
            <div key={item.title} className="flex flex-col items-center gap-2 p-4">
              <span className="text-3xl">{item.icon}</span>
              <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
            <Link to="/flags/garden" className="text-sm text-[#B22234] font-medium hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Email signup */}
      <section className="bg-[#1B2A4A] text-white py-14 px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Stay in the Loop</h2>
        <p className="text-gray-300 mb-6">Get new products and exclusive deals delivered to your inbox.</p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 outline-none"
          />
          <button type="submit" className="bg-[#B22234] text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap">
            Subscribe
          </button>
        </form>
      </section>
    </div>
  )
}
