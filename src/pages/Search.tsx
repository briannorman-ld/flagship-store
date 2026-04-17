import { useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'

export default function Search() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''

  const results = useMemo(() => {
    if (!q.trim()) return []
    const lower = q.toLowerCase()
    return products.filter(p =>
      p.name.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower)
    )
  }, [q])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-2">
        <Link to="/" className="hover:text-gray-900">Home</Link>
        <span>›</span>
        <span className="text-gray-900">Search</span>
      </nav>
      <h1 className="text-xl font-bold text-gray-900 mb-1">
        {q ? `Results for "${q}"` : 'Search'}
      </h1>
      <p className="text-sm text-gray-500 mb-6">{results.length} product{results.length !== 1 ? 's' : ''} found</p>

      {results.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-4">No results found for "{q}"</p>
          <Link to="/" className="text-[#B22234] hover:underline">← Back to home</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {results.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
