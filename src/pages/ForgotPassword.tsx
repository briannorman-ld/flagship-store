import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-[#1B2A4A]">🏳 FlagShip</Link>
          <h1 className="text-xl font-semibold text-gray-900 mt-4">Reset your password</h1>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
          {sent ? (
            <div className="text-center">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="font-semibold text-gray-900 mb-2">Check your email</h2>
              <p className="text-sm text-gray-500 mb-6">If an account exists for {email}, we sent a password reset link.</p>
              <Link to="/login" className="text-[#B22234] font-medium hover:underline text-sm">← Back to sign in</Link>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="space-y-4">
              <p className="text-sm text-gray-500">Enter your email address and we'll send you a link to reset your password.</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1B2A4A]" placeholder="you@example.com" />
              </div>
              <button type="submit" className="w-full bg-[#1B2A4A] text-white font-semibold py-3 rounded-lg hover:bg-[#B22234] transition-colors">
                Send Reset Link
              </button>
              <p className="text-center text-sm">
                <Link to="/login" className="text-[#B22234] hover:underline">← Back to sign in</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
