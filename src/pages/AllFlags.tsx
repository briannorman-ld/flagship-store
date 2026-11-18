import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { categoryMeta, products } from '../data/products'
import { useStoreMetricTrack } from '../hooks/useStoreMetricTrack'
import { STORE_METRIC_EVENTS } from '../analytics/storeMetricEvents'

const categoryVisuals: Record<string, { emoji: string; bg: string }> = {
  american: { emoji: '🇺🇸', bg: 'from-blue-900 to-red-700' },
  nautical: { emoji: '⚓', bg: 'from-blue-700 to-cyan-500' },
  state: { emoji: '🗺️', bg: 'from-green-700 to-emerald-500' },
  country: { emoji: '🌎', bg: 'from-indigo-700 to-sky-500' },
  golf: { emoji: '⛳', bg: 'from-green-600 to-lime-400' },
  military: { emoji: '🎖️', bg: 'from-slate-800 to-amber-700' },
  historical: { emoji: '📜', bg: 'from-stone-700 to-yellow-700' },
  garden: { emoji: '🌻', bg: 'from-emerald-700 to-yellow-500' },
}

function fallbackVisual(slug: string) {
  return categoryVisuals[slug] ?? { emoji: '🏳', bg: 'from-[#1B2A4A] to-[#B22234]' }
}

const categories = Object.entries(categoryMeta).map(([slug, meta]) => ({
  slug,
  ...meta,
  count: products.filter(product => product.category === slug).length,
  ...fallbackVisual(slug),
}))

export default function AllFlags() {
  const trackMetric = useStoreMetricTrack()

  useEffect(() => {
    trackMetric(STORE_METRIC_EVENTS.plpView, { category: 'all', page: '/flags' })
  }, [trackMetric])

  useEffect(() => {
    const milestones = new Set<number>()

    function onScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      if (scrollable <= 0) return

      const depth = Math.round((window.scrollY / scrollable) * 100)
      for (const milestone of [25, 50, 75, 100]) {
        if (depth >= milestone && !milestones.has(milestone)) {
          milestones.add(milestone)
          trackMetric(STORE_METRIC_EVENTS.scrollDepthReached, {
            page: '/flags',
            depth: milestone,
          })
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [trackMetric])

  function trackCategoryClick(slug: string, label: string, count: number) {
    trackMetric(STORE_METRIC_EVENTS.categoryTileClick, {
      category: slug,
      categoryLabel: label,
      productCount: count,
      destinationUrl: `/flags/${slug}`,
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-2">
        <Link to="/" className="hover:text-gray-900">Home</Link>
        <span>›</span>
        <span className="text-gray-900">All Flag Categories</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Browse All Categories</h1>
        <p className="text-gray-600 max-w-2xl">
          Explore every FlagShip collection in one place. Choose a category below to see available flags, sizes, and materials.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map(category => (
          <Link
            key={category.slug}
            to={`/flags/${category.slug}`}
            onClick={() => trackCategoryClick(category.slug, category.label, category.count)}
            className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className={`bg-gradient-to-br ${category.bg} text-white min-h-32 p-6 flex items-center justify-between`}>
              <div>
                <div className="text-4xl mb-3">{category.emoji}</div>
                <h2 className="text-xl font-bold">{category.label}</h2>
              </div>
              <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold backdrop-blur-sm">
                {category.count} {category.count === 1 ? 'product' : 'products'}
              </span>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-600 min-h-10">{category.description}</p>
              <span className="mt-4 inline-flex text-sm font-semibold text-[#B22234] group-hover:underline">
                Shop {category.label} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
