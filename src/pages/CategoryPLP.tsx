import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { products, categoryMeta } from '../data/products'
import ProductCard from '../components/ProductCard'

const ITEMS_PER_PAGE = 12

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating'

export default function CategoryPLP() {
  const { slug } = useParams<{ slug: string }>()
  const [sort, setSort] = useState<SortOption>('featured')
  const [page, setPage] = useState(1)
  const [maxPrice, setMaxPrice] = useState(300)

  const meta = slug ? categoryMeta[slug] : null
  const categoryProducts = useMemo(() => {
    let list = slug ? products.filter(p => p.category === slug) : products
    list = list.filter(p => p.price <= maxPrice)
    switch (sort) {
      case 'price-asc': return [...list].sort((a, b) => a.price - b.price)
      case 'price-desc': return [...list].sort((a, b) => b.price - a.price)
      case 'rating': return [...list].sort((a, b) => b.rating - a.rating)
      default: return [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }
  }, [slug, sort, maxPrice])

  const totalPages = Math.ceil(categoryProducts.length / ITEMS_PER_PAGE)
  const paged = categoryProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  if (!meta && slug) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Category not found</h1>
        <Link to="/" className="text-[#B22234] mt-4 inline-block">← Back to home</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-2">
        <Link to="/" className="hover:text-gray-900">Home</Link>
        <span>›</span>
        <span className="text-gray-900">{meta?.label ?? 'All Products'}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-56 shrink-0">
          <div className="bg-gray-50 rounded-xl p-5 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Filter</h3>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price: <span className="text-[#B22234]">${maxPrice}</span>
              </label>
              <input
                type="range"
                min={10}
                max={300}
                step={5}
                value={maxPrice}
                onChange={e => { setMaxPrice(Number(e.target.value)); setPage(1) }}
                className="w-full accent-[#B22234]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>$10</span><span>$300</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Browse Categories</label>
              <ul className="space-y-1">
                {Object.entries(categoryMeta).map(([s, m]) => (
                  <li key={s}>
                    <Link
                      to={`/flags/${s}`}
                      className={`block text-sm py-1 px-2 rounded-md ${s === slug ? 'bg-[#1B2A4A] text-white font-medium' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                      {m.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{meta?.label ?? 'All Flags'}</h1>
              <p className="text-sm text-gray-500">{categoryProducts.length} products</p>
            </div>
            <select
              value={sort}
              onChange={e => { setSort(e.target.value as SortOption); setPage(1) }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Best Rating</option>
            </select>
          </div>

          {paged.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No products match your filters.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {paged.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium ${n === page ? 'bg-[#1B2A4A] text-white' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
