import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { Order } from '../types'

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const orders: Order[] = JSON.parse(localStorage.getItem('flagship_orders') || '[]')
    const found = orders.find(o => o.id === orderId)
    setOrder(found ?? null)
    setTimeout(() => setShow(true), 100)
  }, [orderId])

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Order not found</h1>
        <Link to="/" className="text-[#B22234] hover:underline">← Back to home</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className={`text-center mb-10 transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="text-7xl mb-4">✅</div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Thank you, {order.shippingAddress.firstName}!
        </h1>
        <p className="text-gray-500">Your order has been placed and is being processed.</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Order Details</h2>
          <span className="text-sm font-mono bg-[#1B2A4A] text-white px-3 py-1 rounded-full">{order.id}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm mb-5">
          <div>
            <span className="text-gray-500 block mb-0.5">Estimated Delivery</span>
            <span className="font-medium text-gray-900">{order.estimatedDelivery}</span>
          </div>
          <div>
            <span className="text-gray-500 block mb-0.5">Shipping Method</span>
            <span className="font-medium text-gray-900">{order.shippingMethod}</span>
          </div>
          <div>
            <span className="text-gray-500 block mb-0.5">Ship To</span>
            <span className="font-medium text-gray-900">
              {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block mb-0.5">Payment</span>
            <span className="font-medium text-gray-900">Card ending in {order.paymentLast4}</span>
          </div>
        </div>

        {/* Items */}
        <div className="border-t border-gray-200 pt-4 space-y-2">
          {order.items.map(item => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span className="text-gray-700">{item.product.name} × {item.quantity}</span>
              <span className="text-gray-900 font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-gray-200 mt-4 pt-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>−${order.discount.toFixed(2)}</span></div>}
          <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span></div>
          <div className="flex justify-between text-gray-600"><span>Tax</span><span>${order.tax.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-200 pt-2">
            <span>Total</span><span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Link to="/" className="flex-1 bg-[#1B2A4A] text-white text-center font-semibold py-3 rounded-lg hover:bg-[#B22234] transition-colors">
          Continue Shopping
        </Link>
        <Link to="/account?tab=orders" className="flex-1 border border-gray-200 text-gray-700 text-center font-medium py-3 rounded-lg hover:bg-gray-50">
          View Order History
        </Link>
      </div>
    </div>
  )
}
