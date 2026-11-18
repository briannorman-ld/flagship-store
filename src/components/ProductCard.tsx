import { Link } from 'react-router-dom'
import type { Product } from '../types'
import FlagImage from './FlagImage'
import StarRating from './StarRating'
import { useCart } from '../context/CartContext'
import { useLDFlags } from '../hooks/useLDFlags'
import { useStoreMetricTrack } from '../hooks/useStoreMetricTrack'
import { STORE_METRIC_EVENTS } from '../analytics/storeMetricEvents'
import { showToast } from '../lib/toast-bus'

/** Where the card is rendered; scopes homepage-only experiments and metric attribution. */
export type ProductCardPlacement = 'homepage' | 'homepage-best-sellers' | 'listing'

interface ProductCardProps {
  product: Product
  placement?: ProductCardPlacement
  /** Called when the card itself (link to the PDP) is clicked. */
  onProductClick?: (product: Product) => void
  /** Called after the card's "Add to Cart" button adds the item. */
  onAddToCart?: (product: Product) => void
}

export default function ProductCard({ product, placement = 'listing', onProductClick, onAddToCart }: ProductCardProps) {
  const { addToCart } = useCart()
  const flags = useLDFlags()
  const trackMetric = useStoreMetricTrack()
  const isOnSale = !!product.originalPrice
  const onHomepage = placement === 'homepage' || placement === 'homepage-best-sellers'
  const inBestSellers = placement === 'homepage-best-sellers'
  /**
   * Experiments: show "Add to Cart" without hovering. Homepage cards follow
   * `eh-desktop-visible-card-atc-desktop`; Best Sellers cards also follow
   * `eh-d-best-sellers-atc-visible-desktop`. Default (flags off) keeps the hover-only button.
   */
  const addToCartVisible =
    (onHomepage && flags['eh-desktop-visible-card-atc-desktop']) ||
    (inBestSellers && flags['eh-d-best-sellers-atc-visible-desktop'])

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation() // keep the card's onProductClick from also firing
    addToCart(product, 1, product.sizes[0], product.material[0])
    trackMetric(STORE_METRIC_EVENTS.addToCart, {
      productId: product.id,
      category: product.category,
      quantity: 1,
      size: product.sizes[0],
      material: product.material[0],
      placement,
      source: 'product-card',
      experimentKey: inBestSellers
        ? 'eh-d-best-sellers-atc-visible-desktop'
        : onHomepage
          ? 'eh-desktop-visible-card-atc-desktop'
          : undefined,
    })
    onAddToCart?.(product)
    showToast(`${product.name} added to cart`)
  }

  return (
    <Link to={`/product/${product.id}`} onClick={() => onProductClick?.(product)} className="group flex h-full min-h-0 flex-col">
      <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
        {isOnSale && flags['show-sale-badge'] && (
          <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            SALE
          </div>
        )}
        {!product.inStock && (
          <div className="absolute top-3 right-3 z-10 bg-gray-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            OUT OF STOCK
          </div>
        )}
        <FlagImage
          flagImagePath={product.flagImagePath}
          isoCode={product.isoCode}
          alt={product.name}
          size="card"
        />
        <div className="flex min-h-0 flex-1 flex-col p-4">
          <h3 className="mb-1 min-h-[2.5rem] text-sm font-medium leading-snug text-gray-900 line-clamp-2">
            {product.name}
          </h3>
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          <div className="mt-2 flex items-center gap-2">
            <span className="text-base font-semibold text-gray-900">${product.price.toFixed(2)}</span>
            {isOnSale && product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <div className="min-h-3 flex-1" aria-hidden />
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full rounded-lg bg-[#1B2A4A] py-2 text-sm font-medium text-white transition-opacity duration-150 hover:bg-[#B22234] disabled:cursor-not-allowed disabled:bg-gray-300 ${
              addToCartVisible ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  )
}
