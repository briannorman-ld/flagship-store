import { Link } from 'react-router-dom'
import type { Product } from '../types'
import FlagImage from './FlagImage'
import StarRating from './StarRating'
import { useCart } from '../context/CartContext'
import { useLDFlags } from '../hooks/useLDFlags'
import { showToast } from './Toast'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const flags = useLDFlags()
  const isOnSale = !!product.originalPrice

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    addToCart(product, 1, product.sizes[0], product.material[0])
    showToast(`${product.name} added to cart`)
  }

  return (
    <Link to={`/product/${product.id}`} className="group flex h-full min-h-0 flex-col">
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
            className="w-full rounded-lg bg-[#1B2A4A] py-2 text-sm font-medium text-white opacity-0 transition-opacity duration-150 hover:bg-[#B22234] group-hover:opacity-100 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  )
}
