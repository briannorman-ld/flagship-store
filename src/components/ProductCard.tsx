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
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
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
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          <div className="mt-2 flex items-center gap-2">
            <span className="text-base font-semibold text-gray-900">${product.price.toFixed(2)}</span>
            {isOnSale && product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="mt-3 w-full bg-[#1B2A4A] text-white text-sm font-medium py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:bg-[#B22234] disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  )
}
