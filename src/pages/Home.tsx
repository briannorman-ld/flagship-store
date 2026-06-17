import { Link } from 'react-router-dom'
import { products, categoryMeta } from '../data/products'
import type { Product } from '../types'
import ProductCard from '../components/ProductCard'
import { useLDFlags } from '../hooks/useLDFlags'

const categoryCards = [
  { slug: 'american', emoji: '🇺🇸', bg: 'from-blue-900 to-red-700' },
  { slug: 'nautical', emoji: '⚓', bg: 'from-blue-700 to-cyan-500' },
  { slug: 'state', emoji: '🗺️', bg: 'from-green-700 to-emerald-500' },
  { slug: 'golf', emoji: '⛳', bg: 'from-green-600 to-lime-400' },
]

/** Same four categories as the hero category cards — one standout per category. */
const BEST_SELLER_CATEGORY_SLUGS = ['american', 'nautical', 'state', 'golf'] as const

function bestSellersShowcase(catalog: Product[]): Product[] {
  const seenImages = new Set<string>()
  const out: Product[] = []

  for (const slug of BEST_SELLER_CATEGORY_SLUGS) {
    const inCat = catalog.filter(p => p.category === slug)
    if (inCat.length === 0) continue

    const preferFeatured = inCat.filter(p => p.featured)
    const pool = preferFeatured.length > 0 ? preferFeatured : inCat
    let sorted = [...pool].sort((a, b) => b.reviewCount - a.reviewCount)

    // Golf: numbered sets share one artwork — prefer the next-strongest item with a different graphic.
    if (slug === 'golf') {
      const allGolf = [...inCat].sort((a, b) => b.reviewCount - a.reviewCount)
      const alt = allGolf.find(p => !p.flagImagePath.includes('golf-numbered'))
      if (alt) sorted = [alt, ...sorted.filter(p => p.id !== alt.id)]
    }

    const choice = sorted.find(p => !seenImages.has(p.flagImagePath)) ?? sorted[0]
    out.push(choice)
    seenImages.add(choice.flagImagePath)
  }

  return out
}

const bestSellerProducts = bestSellersShowcase(products)
const newArrivals = products.slice(-4)

/** Self-hosted in /public; works with Vite `base` on GitHub Pages */
const heroImageSrc = `${import.meta.env.BASE_URL}hero-american-flag-mountains.jpg`

function BenefitRow() {
  const benefits = [
    { icon: '🇺🇸', title: 'Made in USA Options', copy: 'Domestic craftsmanship on select American flags.' },
    { icon: '🚚', title: 'Fast Shipping', copy: 'Most in-stock flags ship quickly from our warehouse.' },
    { icon: '✅', title: 'Satisfaction Guaranteed', copy: 'Quality materials, clear returns, and helpful support.' },
    { icon: '📦', title: 'Bulk Discounts', copy: 'Save on event, school, business, and municipal orders.' },
  ]

  return (
    <section className="bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map(benefit => (
            <div key={benefit.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="text-2xl mb-2">{benefit.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{benefit.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CompactTrustStrip() {
  const items = ['Made in USA options', 'Fast shipping', 'Satisfaction guarantee', 'Bulk discounts']

  return (
    <div className="hidden lg:flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-[#1B2A4A]">
      {items.map(item => (
        <span key={item} className="inline-flex items-center gap-1.5 font-medium whitespace-nowrap">
          <span className="text-green-600" aria-hidden>✓</span>
          {item}
        </span>
      ))}
    </div>
  )
}

export default function Home() {
  const flags = useLDFlags()
  const heroVariant = flags['homepage-hero-variant']
  const showTrustNearBestSellers = flags['eh-desktop-trust-near-products-desktop']

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
              className={`bg-gradient-to-br ${bg} text-white rounded-xl py-2.5 px-3 flex flex-col items-center justify-center text-center min-h-24 shadow-sm hover:shadow-md transition-shadow`}
            >
              <span className="text-3xl mb-1">{emoji}</span>
              <span className="font-semibold text-sm sm:text-base">{categoryMeta[slug].label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14" aria-labelledby="best-sellers-heading">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 id="best-sellers-heading" className="text-2xl font-bold text-gray-900">Best Sellers</h2>
            <p className="text-sm text-gray-500 mt-1">Customer favorites across our most popular flag categories.</p>
          </div>
          {showTrustNearBestSellers && <CompactTrustStrip />}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {bestSellerProducts.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      {/* Control keeps the full benefit row between Best Sellers and New Arrivals; variant keeps it lower. */}
      {!showTrustNearBestSellers && <BenefitRow />}

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
            <p className="text-sm text-gray-500 mt-1">Fresh additions to the FlagShip catalog.</p>
          </div>
          <Link to="/search?q=flag" className="text-sm font-medium text-[#B22234] hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {newArrivals.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      {showTrustNearBestSellers && <BenefitRow />}
    </div>
  )
}
