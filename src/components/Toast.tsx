import { useEffect, useState } from 'react'
import { subscribeToasts, type ToastItem } from '../lib/toast-bus'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  onClose: () => void
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${colors[type]} text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in`}>
      <span>{message}</span>
      <button onClick={onClose} className="text-white/80 hover:text-white">✕</button>
    </div>
  )
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    return subscribeToasts(toast => {
      setToasts(prev => [...prev, toast])
    })
  }, [])

  function remove(id: number) {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => remove(t.id)} />
      ))}
    </div>
  )
}
