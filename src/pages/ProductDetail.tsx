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
import { showToast } from '../lib/toast-bus'
import { categoryMeta } from '../data/products'
import { useStoreMetricTrack } from '../hooks/useStoreMetricTrack'
import { STORE_METRIC_EVENTS } from '../analytics/storeMetricEvents'

const POPULAR_SIZE_EXPERIMENT_FLAG = 'eh-desktop-default-popular-size-desktop'
const POPULAR_SIZE_PRODUCT_ID = 'state-co'
const POPULAR_SIZE_LABEL = 'Most popular for homes'

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

  const popularSizeExperimentEnabled =
    product?.id === POPULAR_SIZE_PRODUCT_ID && flags[POPULAR_SIZE_EXPERIMENT_FLAG]
  const popularSize = product?.sizes.find(s => s === '3×5 ft') ?? product?.sizes[0]

  useEffect(() => {
    if (!product) return
    trackMetric(STORE_METRIC_EVENTS.pdpView, {
      productId: product.id,
      category: product.category,
    })
  }, [product, trackMetric])

  useEffect(() => {
    if (!popularSizeExperimentEnabled || !popularSize) return
    setSelectedSize(current => current || popularSize)
  }, [popularSizeExperimentEnabled, popularSize])

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

  function handleSizeSelect(size: string) {
    setSelectedSize(size)
    trackMetric(STORE_METRIC_EVENTS.pdpVariantOptionSelected, {
      productId: p.id,
      category: p.category,
      optionName: 'size',
      optionValue: size,
      source: 'manual',
      experimentFlagKey: POPULAR_SIZE_EXPERIMENT_FLAG,
      experimentVariant: popularSizeExperimentEnabled ? 'eh-arm-1' : 'eh-arm-0',
    })
  }

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
      sizeSelectionSource: selectedSize ? 'selected' : 'fallback',
      experimentFlagKey: POPULAR_SIZE_EXPERIMENT_FLAG,
      experimentVariant: popularSizeExperimentEnabled ? 'eh-arm-1' : 'eh-arm-0',
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
                {p.sizes.map(s => {
                  const isPopularSize = popularSizeExperimentEnabled && s === popularSize
                  return (
                    <button
                      key={s}
                      onClick={() => handleSizeSelect(s)}
                      className={`px-4 py-2 rounded-lg text-sm border ${selectedSize === s ? 'border-[#1B2A4A] bg-[#1B2A4A] text-white' : 'border-gray-200 text-gray-700 hover:border-gray-400'}`}
                    >
                      <span>{s}</span>
                      {isPopularSize && (
                        <span className={`block text-[11px] leading-tight ${selectedSize === s ? 'text-white/80' : 'text-[#B22234]'}`}>
                          {POPULAR_SIZE_LABEL}
                        </span>
                      )}
                    </button>
                  )
                })}
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
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 text-gray-700 hover:bg-gray-50">−</button>
              <span className="px-4 py-2 text-sm border-x border-gray-200">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 text-gray-700 hover:bg-gray-50">+</button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!p.inStock}
              className="flex-1 bg-[#1B2A4A] text-white font-semibold py-3 rounded-lg hover:bg-[#B22234] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {p.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button
              onClick={handleWishlist}
              className={`px-5 rounded-lg border transition-colors ${wishlisted ? 'border-[#B22234] bg-red-50 text-[#B22234]' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {wishlisted ? '♥' : '♡'}
            </button>
          </div>

          <div className="mt-5 text-sm text-gray-500 space-y-1">
            <p>✓ Ships within 1–2 business days</p>
            <p>✓ 30-day returns</p>
            <p>✓ Secure checkout</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t as 'description' | 'shipping' | 'reviews')}
              className={`py-3 text-sm font-medium capitalize border-b-2 ${activeTab === t ? 'border-[#B22234] text-[#B22234]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-12 text-gray-700 leading-relaxed">
        {activeTab === 'description' && <p>{p.description}</p>}
        {activeTab === 'shipping' && (
          <div className="space-y-2">
            <p>Standard shipping typically arrives in 5–7 business days.</p>
            <p>Express and overnight options may be available at checkout.</p>
            <p>All flags are carefully packed to protect stitching, grommets, and finish.</p>
          </div>
        )}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{r.title}</p>
                    <p className="text-xs text-gray-500">By {r.author} · {new Date(r.date).toLocaleDateString()}</p>
                  </div>
                  <StarRating rating={r.rating} />
                </div>
                <p className="text-sm text-gray-600">{r.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {flags['show-product-recommendations'] && related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-5">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map(pr => <ProductCard key={pr.id} product={pr} />)}
          </div>
        </section>
      )}
    </div>
  )
}
