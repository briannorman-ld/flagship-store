import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    const ok = register(form.firstName, form.lastName, form.email, form.password)
    if (ok) navigate('/')
    else setError('An account with this email already exists')
  }

  const field = (name: keyof typeof form, label: string, type = 'text') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={form[name]}
        onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
        required
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1B2A4A]"
      />
    </div>
  )

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-[#1B2A4A]">🏳 FlagShip</Link>
          <h1 className="text-xl font-semibold text-gray-900 mt-4">Create your account</h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            {field('firstName', 'First Name')}
            {field('lastName', 'Last Name')}
          </div>
          {field('email', 'Email', 'email')}
          {field('password', 'Password', 'password')}
          {field('confirm', 'Confirm Password', 'password')}
          <button type="submit" className="w-full bg-[#1B2A4A] text-white font-semibold py-3 rounded-lg hover:bg-[#B22234] transition-colors">
            Create Account
          </button>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-[#B22234] font-medium hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
