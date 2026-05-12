import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { products } from '../data/products'
import { getReviewsForProduct } from '../data/reviews'
import FlagImage from '../components/FlagImage'
import StarRating from '../components/StarRating'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { DESKTOP_DEFAULT_POPULAR_SIZE_FLAG_KEY, useLDFlags } from '../hooks/useLDFlags'
import { showToast } from '../lib/toast-bus'
import { categoryMeta } from '../data/products'
import { useStoreMetricTrack } from '../hooks/useStoreMetricTrack'
import { STORE_METRIC_EVENTS } from '../analytics/storeMetricEvents'

const COLORADO_STATE_FLAG_PRODUCT_ID = 'state-co'
const POPULAR_HOME_SIZE = '3×5 ft'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const product = products.find(p => p.id === id)
  const flags = useLDFlags()
  const trackMetric = useStoreMetricTrack()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist()
  const popularSizeTreatment = Boolean(flags[DESKTOP_DEFAULT_POPULAR_SIZE_FLAG_KEY])
  const shouldPreselectPopularSize = Boolean(
    popularSizeTreatment &&
    product?.id === COLORADO_STATE_FLAG_PRODUCT_ID &&
    product.sizes.includes(POPULAR_HOME_SIZE),
  )
  const [selectedSize, setSelectedSize] = useState(() => shouldPreselectPopularSize ? POPULAR_HOME_SIZE : '')
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

  useEffect(() => {
    setSelectedSize(shouldPreselectPopularSize ? POPULAR_HOME_SIZE : '')
  }, [product?.id, shouldPreselectPopularSize])

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
        <Link to="/" className="text-[#B22234] hover:underline">← Back to home</Link>
      </div>
    )
  }

  const p = product
  const reviews = getReviewsForProduct(p.id)
  const related = products.filter(pr => pr.category === p.category && pr.id !== p.id).slice(0, 4)
  const wishlisted = isWishlisted(p.id)

  function handleSizeSelect(size: string) {
    setSelectedSize(size)
    trackMetric(STORE_METRIC_EVENTS.pdpVariantOptionSelected, {
      productId: p.id,
      optionName: 'size',
      optionValue: size,
      source: shouldPreselectPopularSize && size === POPULAR_HOME_SIZE ? 'popular-size-option-click' : 'manual',
      experimentFlagKey: DESKTOP_DEFAULT_POPULAR_SIZE_FLAG_KEY,
      experimentVariation: popularSizeTreatment ? 'eh-arm-1' : 'eh-arm-0',
      hadDefaultSelection: shouldPreselectPopularSize,
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
      experimentFlagKey: DESKTOP_DEFAULT_POPULAR_SIZE_FLAG_KEY,
      experimentVariation: popularSizeTreatment ? 'eh-arm-1' : 'eh-arm-0',
      sizeWasDefaultedByExperiment: shouldPreselectPopularSize && size === POPULAR_HOME_SIZE,
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
        <div>
          <FlagImage
            flagImagePath={p.flagImagePath}
            isoCode={p.isoCode}
            alt={p.name}
            size="pdp"
          />
        </div>

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

          {p.sizes.length > 1 && (
            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
              <div className="flex flex-wrap gap-2">
                {p.sizes.map(s => {
                  const isPopularHomeSize = shouldPreselectPopularSize && s === POPULAR_HOME_SIZE
                  return (
                    <button
                      key={s}
                      onClick={() => handleSizeSelect(s)}
                      className={`px-4 py-2 rounded-lg text-sm border ${selectedSize === s ? 'border-[#1B2A4A] bg-[#1B2A4A] text-white' : 'border-gray-200 text-gray-700 hover:border-gray-400'}`}
                    >
                      <span>{s}</span>
                      {isPopularHomeSize && (
                        <span className={`ml-2 text-xs font-semibold ${selectedSize === s ? 'text-yellow-200' : 'text-[#B22234]'}`}>
                          Most popular for homes
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

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

          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center border border-gray-200 rounded-lg w-32">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 text-gray-700 hover:bg-gray-50">−</button>
              <span className="flex-1 text-center text-sm">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 text-gray-700 hover:bg-gray-50">+</button>
            </div>
          </div>

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
              className={`px-5 rounded-lg border transition-colors ${wishlisted ? 'border-[#B22234] text-[#B22234] bg-red-50' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              ♥
            </button>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs text-gray-500">
            <div className="bg-gray-50 rounded-lg p-3">🚚<br />Fast shipping</div>
            <div className="bg-gray-50 rounded-lg p-3">↩️<br />30-day returns</div>
            <div className="bg-gray-50 rounded-lg p-3">🔒<br />Secure checkout</div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 mb-12">
        <div className="flex gap-6 border-b border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`py-3 text-sm font-medium capitalize ${activeTab === tab ? 'text-[#1B2A4A] border-b-2 border-[#1B2A4A]' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="py-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none text-gray-600">
              <p>{p.description}</p>
              <ul className="mt-4 list-disc pl-5 space-y-1">
                <li>Durable fabric with vivid, fade-resistant colors</li>
                <li>Canvas header with brass grommets for easy hanging</li>
                <li>Suitable for indoor or outdoor display</li>
              </ul>
            </div>
          )}
          {activeTab === 'shipping' && (
            <div className="text-gray-600 space-y-2">
              <p>Standard shipping arrives in 5–7 business days. Express and overnight options are available at checkout when enabled.</p>
              <p>Orders over ${flags['free-shipping-threshold']} qualify for free standard shipping.</p>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium text-gray-900">{review.title}</div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{review.body}</p>
                  <p className="text-xs text-gray-400">{review.author} · {new Date(review.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
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
