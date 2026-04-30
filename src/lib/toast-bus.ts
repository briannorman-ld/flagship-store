export type ToastItem = {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

let toastId = 0
const listeners = new Set<(toast: ToastItem) => void>()

export function subscribeToasts(handler: (toast: ToastItem) => void): () => void {
  listeners.add(handler)
  return () => {
    listeners.delete(handler)
  }
}

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  const toast: ToastItem = { id: ++toastId, message, type }
  listeners.forEach(l => l(toast))
}
