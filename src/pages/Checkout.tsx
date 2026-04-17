import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useLDFlags } from '../hooks/useLDFlags'
import type { Order, Address } from '../types'
import { showToast } from '../components/Toast'

type Step = 1 | 2 | 3

interface ShippingForm {
  firstName: string
  lastName: string
  email: string
  street: string
  city: string
  state: string
  zip: string
  country: string
}

interface PaymentForm {
  cardNumber: string
  nameOnCard: string
  expiry: string
  cvv: string
}

const shippingMethods = [
  { id: 'standard', label: 'Standard Shipping', days: '5–7 business days', price: 8.99 },
  { id: 'express', label: 'Express Shipping', days: '2–3 business days', price: 14.99 },
  { id: 'overnight', label: 'Overnight Shipping', days: 'Next business day', price: 29.99 },
]

function formatCard(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return digits
}

function cardType(number: string) {
  const d = number.replace(/\D/g, '')
  if (d.startsWith('4')) return 'Visa'
  if (d.startsWith('5')) return 'Mastercard'
  if (d.startsWith('3')) return 'Amex'
  return ''
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const flags = useLDFlags()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>(1)
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [promoApplied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [shipping, setShippingForm] = useState<ShippingForm>({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  })

  const [payment, setPayment] = useState<PaymentForm>({
    cardNumber: '',
    nameOnCard: '',
    expiry: '',
    cvv: '',
  })

  const selectedMethod = shippingMethods.find(m => m.id === shippingMethod) ?? shippingMethods[0]
  const shippingCost = subtotal >= flags['free-shipping-threshold'] && shippingMethod === 'standard' ? 0 : selectedMethod.price
  const discount = promoApplied ? subtotal * 0.2 : 0
  const discountedSub = subtotal - discount
  const tax = (discountedSub + shippingCost) * 0.08
  const total = discountedSub + shippingCost + tax

  const visibleMethods = flags['enable-express-checkout']
    ? shippingMethods
    : shippingMethods.filter(m => m.id === 'standard')

  function handlePlaceOrder() {
    setIsSubmitting(true)
    const orderId = `FS-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`
    const daysMap: Record<string, number> = { standard: 7, express: 3, overnight: 1 }
    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + (daysMap[shippingMethod] ?? 7))

    const address: Address = {
      id: crypto.randomUUID(),
      ...shipping,
      isDefault: false,
    }

    const order: Order = {
      id: orderId,
      userId: user?.id,
      items,
      subtotal,
      shipping: shippingCost,
      tax,
      discount,
      total,
      shippingAddress: address,
      shippingMethod: selectedMethod.label,
      paymentLast4: payment.cardNumber.replace(/\D/g, '').slice(-4),
      estimatedDelivery: deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      createdAt: new Date().toISOString(),
      status: 'processing',
    }

    // Persist
    const orders: Order[] = JSON.parse(localStorage.getItem('flagship_orders') || '[]')
    orders.unshift(order)
    localStorage.setItem('flagship_orders', JSON.stringify(orders))

    if (user) {
      const users = JSON.parse(localStorage.getItem('flagship_users') || '[]')
      const idx = users.findIndex((u: { id: string }) => u.id === user.id)
      if (idx !== -1) {
        users[idx].orderIds = [orderId, ...(users[idx].orderIds ?? [])]
        localStorage.setItem('flagship_users', JSON.stringify(users))
      }
    }

    clearCart()
    setTimeout(() => navigate(`/order-confirmation/${orderId}`), 600)
  }

  const stepLabels = ['Contact & Shipping', 'Shipping Method', 'Payment']

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      {/* Progress */}
      {flags['checkout-progress-indicator'] && (
        <div className="flex items-center mb-8">
          {stepLabels.map((label, i) => {
            const n = (i + 1) as Step
            const active = n === step
            const done = n < step
            return (
              <div key={label} className="flex items-center flex-1">
                <div className={`flex items-center gap-2 ${active ? 'text-[#1B2A4A]' : done ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${active ? 'border-[#1B2A4A] bg-[#1B2A4A] text-white' : done ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'}`}>
                    {done ? '✓' : n}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">{label}</span>
                </div>
                {i < 2 && <div className={`flex-1 h-0.5 mx-2 ${done ? 'bg-green-600' : 'bg-gray-200'}`} />}
              </div>
            )
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 1 */}
          {step === 1 && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-5">Contact & Shipping</h2>
              <div className="grid grid-cols-2 gap-4">
                {([['firstName', 'First Name'], ['lastName', 'Last Name']] as const).map(([field, label]) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input
                      type="text"
                      value={shipping[field]}
                      onChange={e => setShippingForm(s => ({ ...s, [field]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1B2A4A]"
                      required
                    />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={shipping.email} onChange={e => setShippingForm(s => ({ ...s, email: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input type="text" value={shipping.street} onChange={e => setShippingForm(s => ({ ...s, street: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" value={shipping.city} onChange={e => setShippingForm(s => ({ ...s, city: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input type="text" value={shipping.state} onChange={e => setShippingForm(s => ({ ...s, state: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP</label>
                    <input type="text" value={shipping.zip} onChange={e => setShippingForm(s => ({ ...s, zip: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1B2A4A]" />
                  </div>
                </div>
              </div>
              <button onClick={() => setStep(2)} className="mt-6 w-full bg-[#1B2A4A] text-white font-semibold py-3 rounded-lg hover:bg-[#B22234] transition-colors">
                Continue to Shipping Method →
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-5">Shipping Method</h2>
              <div className="space-y-3">
                {visibleMethods.map(m => (
                  <label key={m.id} className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-colors ${shippingMethod === m.id ? 'border-[#1B2A4A] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="shipping" value={m.id} checked={shippingMethod === m.id} onChange={() => setShippingMethod(m.id)} className="accent-[#1B2A4A]" />
                      <div>
                        <div className="font-medium text-sm text-gray-900">{m.label}</div>
                        <div className="text-xs text-gray-500">{m.days}</div>
                      </div>
                    </div>
                    <span className="font-semibold text-sm text-gray-900">
                      {m.id === 'standard' && subtotal >= flags['free-shipping-threshold'] ? 'Free' : `$${m.price.toFixed(2)}`}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50">← Back</button>
                <button onClick={() => setStep(3)} className="flex-1 bg-[#1B2A4A] text-white font-semibold py-3 rounded-lg hover:bg-[#B22234] transition-colors">Continue to Payment →</button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-5">Payment</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number {cardType(payment.cardNumber) && <span className="text-[#1B2A4A] font-semibold ml-1">{cardType(payment.cardNumber)}</span>}
                  </label>
                  <input
                    type="text"
                    value={payment.cardNumber}
                    onChange={e => setPayment(p => ({ ...p, cardNumber: formatCard(e.target.value) }))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1B2A4A] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                  <input type="text" value={payment.nameOnCard} onChange={e => setPayment(p => ({ ...p, nameOnCard: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1B2A4A]" placeholder="Jane Smith" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                    <input type="text" value={payment.expiry} onChange={e => setPayment(p => ({ ...p, expiry: formatExpiry(e.target.value) }))} placeholder="MM/YY" maxLength={5} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1B2A4A] font-mono" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input type="text" value={payment.cvv} onChange={e => setPayment(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))} placeholder="123" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1B2A4A] font-mono" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50">← Back</button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="flex-1 bg-[#B22234] text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                </button>
              </div>

              <div className="mt-4 flex gap-3">
                <button onClick={() => showToast('PayPal not available in demo', 'info')} className="flex-1 border border-gray-200 text-gray-500 text-sm py-2 rounded-lg hover:bg-gray-50">PayPal</button>
                <button onClick={() => showToast('Apple Pay not available in demo', 'info')} className="flex-1 border border-gray-200 text-gray-500 text-sm py-2 rounded-lg hover:bg-gray-50"> Apple Pay</button>
              </div>
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        <div>
          <div className="bg-gray-50 rounded-xl p-5 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.product.id} className="flex items-start gap-3">
                  <div className="w-12 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-xs overflow-hidden">
                    <img
                      src={item.product.isoCode
                        ? `https://cdn.jsdelivr.net/npm/flag-icons@7.2.3/flags/4x3/${item.product.isoCode}.svg`
                        : undefined}
                      alt=""
                      className="w-full h-full object-contain"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  </div>
                  <div className="flex-1 text-xs">
                    <p className="text-gray-900 font-medium line-clamp-2">{item.product.name}</p>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-medium text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span></div>
              <div className="flex justify-between text-gray-600"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-200 pt-2 mt-1">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
