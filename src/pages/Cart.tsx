import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import FlagImage from '../components/FlagImage'
import { useLDFlags } from '../hooks/useLDFlags'
import { useStoreMetricTrack } from '../hooks/useStoreMetricTrack'
import { STORE_METRIC_EVENTS } from '../analytics/storeMetricEvents'

export default function Cart() {
  const { items, removeFromCart, updateQuantity, subtotal } = useCart()
  const flags = useLDFlags()
  const trackMetric = useStoreMetricTrack()
  const navigate = useNavigate()
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState('')

  const threshold = flags['free-shipping-threshold']
  const shipping = subtotal >= threshold ? 0 : 8.99
  const discount = promoApplied ? subtotal * 0.2 : 0
  const discountedSubtotal = subtotal - discount
  const tax = (discountedSubtotal + shipping) * 0.08
  const total = discountedSubtotal + shipping + tax

  useEffect(() => {
    trackMetric(STORE_METRIC_EVENTS.cartView, {
      itemCount: items.length,
      empty: items.length === 0,
    })
  }, [items.length, trackMetric])

  function applyPromo() {
    if (promoCode.toUpperCase() === 'FLAGSHIP20') {
      setPromoApplied(true)
      setPromoError('')
    } else {
      setPromoError('Invalid promo code')
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Add some flags to get started!</p>
        <Link to="/" className="inline-block bg-[#1B2A4A] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#B22234] transition-colors">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Line items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => {
            const key = `${item.product.id}__${item.selectedSize}__${item.selectedMaterial}`
            return (
              <div key={key} className="flex gap-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <div className="w-24 shrink-0">
                  <FlagImage
                    flagImagePath={item.product.flagImagePath}
                    isoCode={item.product.isoCode}
                    alt={item.product.name}
                    size="thumb"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.id}`} className="font-medium text-gray-900 hover:text-[#B22234] text-sm leading-tight line-clamp-2">
                    {item.product.name}
                  </Link>
                  {item.selectedSize && <p className="text-xs text-gray-500 mt-0.5">Size: {item.selectedSize}</p>}
                  {item.selectedMaterial && <p className="text-xs text-gray-500">Material: {item.selectedMaterial}</p>}

                  <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedMaterial)} className="px-3 py-1 text-gray-700 hover:bg-gray-50">−</button>
                      <span className="px-3 py-1 text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedMaterial)} className="px-3 py-1 text-gray-700 hover:bg-gray-50">+</button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                      <button onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedMaterial)} className="text-gray-400 hover:text-red-500 text-sm">✕</button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          <Link to="/" className="inline-block text-sm text-[#B22234] hover:underline mt-2">← Continue Shopping</Link>
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
            <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-green-600">
                  <span>Discount (20%)</span>
                  <span>−${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400">Add ${(threshold - subtotal).toFixed(2)} more for free shipping</p>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo code */}
            <div className="mt-5">
              {promoApplied ? (
                <div className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">✓ FLAGSHIP20 applied — 20% off!</div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={e => setPromoCode(e.target.value)}
                      placeholder="Promo code"
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1B2A4A]"
                    />
                    <button onClick={applyPromo} className="bg-[#1B2A4A] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#B22234] transition-colors">
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="text-xs text-red-600 mt-1">{promoError}</p>}
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="mt-5 w-full bg-[#B22234] text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
