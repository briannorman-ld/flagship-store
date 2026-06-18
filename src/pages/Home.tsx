import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { products, categoryMeta } from '../data/products'
import type { Product } from '../types'
import ProductCard from '../components/ProductCard'
import { useLDFlags } from '../hooks/useLDFlags'
import { useStoreMetricTrack } from '../hooks/useStoreMetricTrack'
import { STORE_METRIC_EVENTS } from '../analytics/storeMetricEvents'

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

export default function Home() {
  const flags = useLDFlags()
  const trackMetric = useStoreMetricTrack()
  const heroVariant = flags['homepage-hero-variant']
  const hasNewsletterIncentive = flags['eh-desktop-newsletter-incentive-desktop']
  const newsletterArm = hasNewsletterIncentive ? 'eh-arm-1' : 'eh-arm-0'
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterFocused, setNewsletterFocused] = useState(false)
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false)

  useEffect(() => {
    return () => {
      if (newsletterFocused && newsletterEmail.trim() && !newsletterSubmitted) {
        trackMetric(STORE_METRIC_EVENTS.newsletterFormAbandoned, {
          flagKey: 'eh-desktop-newsletter-incentive-desktop',
          variation: newsletterArm,
        })
      }
    }
  }, [newsletterEmail, newsletterFocused, newsletterSubmitted, newsletterArm, trackMetric])

  function handleNewsletterFocus() {
    if (!newsletterFocused) {
      trackMetric(STORE_METRIC_EVENTS.newsletterEmailFocus, {
        flagKey: 'eh-desktop-newsletter-incentive-desktop',
        variation: newsletterArm,
      })
      setNewsletterFocused(true)
    }
  }

  function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault()
    setNewsletterSubmitted(true)
    trackMetric(STORE_METRIC_EVENTS.newsletterSignupSubmitted, {
      flagKey: 'eh-desktop-newsletter-incentive-desktop',
      variation: newsletterArm,
      hasIncentive: hasNewsletterIncentive,
    })
    setNewsletterEmail('')
  }

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
              className={`bg-gradient-to-br ${bg} text-white rounded-xl py-2.5 px-3 flex flex-col items-center justify-center aspect-[16/9] hover:scale-[1.02] transition-transform shadow-sm text-center`}
            >
              <span className="text-3xl mb-1.5" aria-hidden>{emoji}</span>
              <span className="font-semibold text-sm sm:text-base leading-tight">{categoryMeta[slug].label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Best Sellers</h2>
          <Link to="/flags/american" className="text-sm font-medium text-[#B22234] hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {bestSellerProducts.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      {/* Newsletter */}
      <section className="hidden md:block bg-[#1B2A4A] text-white py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">
            {hasNewsletterIncentive ? 'Get 10% off your next flag order' : 'Stay in the Loop'}
          </h2>
          <p className="text-gray-300 mb-6">
            {hasNewsletterIncentive
              ? 'Sign up for our newsletter and get 10% off your next flag order, plus new arrivals and seasonal offers.'
              : 'Subscribe to receive updates on new products and exclusive deals.'}
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={e => setNewsletterEmail(e.target.value)}
              onFocus={handleNewsletterFocus}
              placeholder="Enter your email"
              className="flex-1 rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-[#B22234]"
            />
            <button type="submit" className="bg-[#B22234] text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
              Sign Up
            </button>
          </form>
        </div>
      </section>

      {/* New arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
          <Link to="/flags/nautical" className="text-sm font-medium text-[#B22234] hover:underline">
            Shop more →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {newArrivals.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </div>
  )
}
