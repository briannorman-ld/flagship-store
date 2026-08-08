import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { products } from '../data/products'
import { getReviewsForProduct } from '../data/reviews'
import FlagImage from '../components/FlagImage'
import StarRating from '../components/StarRating'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { PDP_SHIPPING_THRESHOLD_INLINE_FOLLOWUP_FLAG, useLDFlags } from '../hooks/useLDFlags'
import { showToast } from '../lib/toast-bus'
import { categoryMeta } from '../data/products'
import { useStoreMetricTrack } from '../hooks/useStoreMetricTrack'
import { STORE_METRIC_EVENTS } from '../analytics/storeMetricEvents'

const TARGET_PRODUCT_ID = 'golf-numbered-set-9'

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

  const p = product
  const reviews = getReviewsForProduct(p.id)
  const related = products.filter(pr => pr.category === p.category && pr.id !== p.id).slice(0, 4)
  const wishlisted = isWishlisted(p.id)
  const threshold = flags['free-shipping-threshold']
  const itemQualifiesForFreeShipping = p.price >= threshold
  const showInlineFreeShippingCopy =
    p.id === TARGET_PRODUCT_ID &&
    itemQualifiesForFreeShipping &&
    flags[PDP_SHIPPING_THRESHOLD_INLINE_FOLLOWUP_FLAG]

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
    trackMetric(STORE_METRIC_EVENTS.pdpWishlistClicked, {
      productId: p.id,
      category: p.category,
      wishlisted: !wishlisted,
    })

    if (wishlisted) {
      removeFromWishlist(p.id)
      showToast('Removed from wishlist', 'info')
    } else {
      addToWishlist(p)
      showToast('Added to wishlist')
    }
  }

  function handleQuantityChange(nextQuantity: number) {
    const clamped = Math.max(1, nextQuantity)
    setQuantity(clamped)
    trackMetric(STORE_METRIC_EVENTS.pdpQuantityStepperUsed, {
      productId: p.id,
      category: p.category,
      quantity: clamped,
    })
  }

  function handleTabChange(tab: 'description' | 'shipping' | 'reviews') {
    setActiveTab(tab)
    if (tab === 'shipping') {
      trackMetric(STORE_METRIC_EVENTS.pdpShippingTabOpened, { productId: p.id, category: p.category })
    }
    if (tab === 'reviews') {
      trackMetric(STORE_METRIC_EVENTS.pdpReviewsTabOpened, { productId: p.id, category: p.category })
    }
  }

  function handleRecommendationClick(recommendedProductId: string) {
    trackMetric(STORE_METRIC_EVENTS.pdpRecommendationClicked, {
      productId: p.id,
      recommendedProductId,
      category: p.category,
    })
  }

  const tabs = ['description', 'shipping', flags['show-reviews-tab'] ? 'reviews' : null].filter(Boolean) as Array<'description' | 'shipping' | 'reviews'>

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
            <div className="inline-flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="px-4 py-2 text-sm min-w-10 text-center">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {showInlineFreeShippingCopy && (
              <div className="hidden md:flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
                <span aria-hidden>🚚</span>
                <span>Free shipping included with this item.</span>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={!p.inStock}
              className="w-full bg-[#1B2A4A] text-white font-semibold py-3 rounded-lg hover:bg-[#B22234] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {p.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>

            <button
              onClick={handleWishlist}
              className="w-full border border-gray-200 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {wishlisted ? '♥ Remove from Wishlist' : '♡ Add to Wishlist'}
            </button>

            {!showInlineFreeShippingCopy && (
              <p className="text-sm text-gray-500 text-center">
                Free shipping on orders over ${threshold}
              </p>
            )}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-gray-500">
            <div className="bg-gray-50 rounded-lg p-3">🚚<br />Fast shipping</div>
            <div className="bg-gray-50 rounded-lg p-3">↩️<br />30-day returns</div>
            <div className="bg-gray-50 rounded-lg p-3">🔒<br />Secure checkout</div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-8">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`py-3 text-sm font-medium border-b-2 capitalize ${
                activeTab === tab
                  ? 'border-[#1B2A4A] text-[#1B2A4A]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="mb-12">
        {activeTab === 'description' && (
          <div className="prose max-w-none text-gray-600">
            <p>{p.description}</p>
            <ul className="mt-4 space-y-2">
              <li>Premium materials selected for indoor and outdoor display.</li>
              <li>Reinforced edges and brass grommets for reliable mounting.</li>
              <li>Fade-resistant colors designed to look sharp season after season.</li>
            </ul>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="text-gray-600 space-y-3">
            <p>Standard shipping usually arrives in 5–7 business days.</p>
            <p>Orders over ${threshold} qualify for free standard shipping.</p>
            <p>Express and overnight options are available during checkout when enabled.</p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium text-gray-900">{review.author}</div>
                    <StarRating rating={review.rating} />
                  </div>
                  <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{review.title}</h3>
                <p className="text-sm text-gray-600">{review.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {flags['show-product-recommendations'] && related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-5">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map(pr => (
              <div key={pr.id} onClick={() => handleRecommendationClick(pr.id)}>
                <ProductCard product={pr} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
