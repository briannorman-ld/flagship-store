import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { products } from '../data/products'
import { getReviewsForProduct } from '../data/reviews'
import FlagImage from '../components/FlagImage'
import StarRating from '../components/StarRating'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useLDFlags } from '../hooks/useLDFlags'
import { showToast } from '../components/Toast'
import { categoryMeta } from '../data/products'
import { useStoreMetricTrack } from '../hooks/useStoreMetricTrack'
import { STORE_METRIC_EVENTS } from '../analytics/storeMetricEvents'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const product = products.find(p => p.id === id)
  const flags = useLDFlags()
  const trackMetric = useStoreMetricTrack()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist()
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedMaterial, setSelectedMaterial] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'shipping' | 'reviews'>('description')

  useEffect(() => {
    if (!product) return
    trackMetric(STORE_METRIC_EVENTS.pdpView, {
      productId: product.id,
      category: product.category,
    })
  }, [product, trackMetric])

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
        <Link to="/" className="text-[#B22234] hover:underline">← Back to home</Link>
      </div>
    )
  }

  // product is defined here — early return above handles undefined
  const p = product!
  const reviews = getReviewsForProduct(p.id)
  const related = products.filter(pr => pr.category === p.category && pr.id !== p.id).slice(0, 4)
  const wishlisted = isWishlisted(p.id)

  function handleAddToCart() {
    const size = selectedSize || p.sizes[0]
    const material = selectedMaterial || p.material[0]
    addToCart(p, quantity, size, material)
    trackMetric(STORE_METRIC_EVENTS.addToCart, {
      productId: p.id,
      category: p.category,
      quantity,
      size,
      material,
    })
    showToast(`${p.name} added to cart`)
  }

  function handleWishlist() {
    if (wishlisted) {
      removeFromWishlist(p.id)
      showToast('Removed from wishlist', 'info')
    } else {
      addToWishlist(p)
      showToast('Added to wishlist')
    }
  }

  const tabs = ['description', 'shipping', flags['show-reviews-tab'] ? 'reviews' : null].filter(Boolean) as string[]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
        <Link to="/" className="hover:text-gray-900">Home</Link>
        <span>›</span>
        <Link to={`/flags/${p.category}`} className="hover:text-gray-900">
          {categoryMeta[p.category]?.label}
        </Link>
        <span>›</span>
        <span className="text-gray-900">{p.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        {/* Image */}
        <div>
          <FlagImage
            flagImagePath={p.flagImagePath}
            isoCode={p.isoCode}
            alt={p.name}
            size="pdp"
          />
        </div>

        {/* Details */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{p.name}</h1>
          <StarRating rating={p.rating} reviewCount={p.reviewCount} size="md" />

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">${p.price.toFixed(2)}</span>
            {p.originalPrice && (
              <span className="text-lg text-gray-400 line-through">${p.originalPrice.toFixed(2)}</span>
            )}
            {p.originalPrice && (
              <span className="text-sm font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                Save ${(p.originalPrice - p.price).toFixed(2)}
              </span>
            )}
          </div>

          <p className="mt-4 text-gray-600 leading-relaxed">{p.description}</p>

          {/* Size selector */}
          {p.sizes.length > 1 && (
            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
              <div className="flex flex-wrap gap-2">
                {p.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-lg text-sm border ${selectedSize === s ? 'border-[#1B2A4A] bg-[#1B2A4A] text-white' : 'border-gray-200 text-gray-700 hover:border-gray-400'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Material selector */}
          {p.material.length > 1 && (
            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
              <div className="flex flex-wrap gap-2">
                {p.material.map(m => (
                  <button
                    key={m}
                    onClick={() => setSelectedMaterial(m)}
                    className={`px-4 py-2 rounded-lg text-sm border ${selectedMaterial === m ? 'border-[#1B2A4A] bg-[#1B2A4A] text-white' : 'border-gray-200 text-gray-700 hover:border-gray-400'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center border border-gray-200 rounded-lg w-fit">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 text-gray-700 hover:bg-gray-50 text-lg">−</button>
              <span className="px-4 py-2 text-sm font-medium w-12 text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 text-gray-700 hover:bg-gray-50 text-lg">+</button>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-6 flex gap-3 flex-wrap">
            <button
              onClick={handleAddToCart}
              disabled={!p.inStock}
              className="flex-1 bg-[#1B2A4A] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#B22234] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {p.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            {flags['enable-wishlist'] && (
              <button
                onClick={handleWishlist}
                className={`px-4 py-3 rounded-lg border font-medium text-sm transition-colors ${wishlisted ? 'border-red-300 bg-red-50 text-red-600' : 'border-gray-200 text-gray-700 hover:border-gray-400'}`}
              >
                {wishlisted ? '♥ Saved' : '♡ Wishlist'}
              </button>
            )}
          </div>

          {!p.inStock && (
            <p className="mt-3 text-sm text-red-600">This item is currently out of stock.</p>
          )}

          {/* Trust signals */}
          <div className="mt-6 border-t border-gray-100 pt-5 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>🚚</span> Free shipping on orders over $75
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>↩️</span> 30-day hassle-free returns
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>✅</span> Satisfaction guaranteed
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-0">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'description' | 'shipping' | 'reviews')}
              className={`px-6 py-3 text-sm font-medium border-b-2 capitalize transition-colors ${
                activeTab === tab
                  ? 'border-[#B22234] text-[#B22234]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-12">
        {activeTab === 'description' && (
          <div className="prose max-w-none text-gray-600">
            <p className="text-base leading-relaxed">{p.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-900">Available Sizes:</span>
                <ul className="mt-1 space-y-1">
                  {p.sizes.map(s => <li key={s} className="text-gray-600">• {s}</li>)}
                </ul>
              </div>
              <div>
                <span className="font-medium text-gray-900">Materials:</span>
                <ul className="mt-1 space-y-1">
                  {p.material.map(m => <li key={m} className="text-gray-600">• {m}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'shipping' && (
          <div className="text-sm text-gray-600 space-y-3">
            <p><strong className="text-gray-900">Standard Shipping (5–7 business days):</strong> Free on orders over $75, otherwise $8.99.</p>
            <p><strong className="text-gray-900">Express Shipping (2–3 business days):</strong> $14.99</p>
            <p><strong className="text-gray-900">Overnight Shipping:</strong> $29.99</p>
            <p><strong className="text-gray-900">Returns:</strong> We accept returns within 30 days of delivery. Items must be unused and in original packaging.</p>
          </div>
        )}
        {activeTab === 'reviews' && flags['show-reviews-tab'] && (
          <div className="space-y-5">
            {reviews.map(r => (
              <div key={r.id} className="border border-gray-100 rounded-xl p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-semibold text-gray-900 text-sm">{r.author}</span>
                    <div className="mt-0.5"><StarRating rating={r.rating} /></div>
                  </div>
                  <span className="text-xs text-gray-400">{r.date}</span>
                </div>
                <p className="font-medium text-sm text-gray-900 mb-1">{r.title}</p>
                <p className="text-sm text-gray-600">{r.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related products */}
      {flags['show-product-recommendations'] && related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-5">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
