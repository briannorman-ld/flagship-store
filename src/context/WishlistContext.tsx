import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Product } from '../types'

interface WishlistContextValue {
  items: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isWishlisted: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('flagship_wishlist') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('flagship_wishlist', JSON.stringify(items))
  }, [items])

  function addToWishlist(product: Product) {
    setItems(prev => prev.find(p => p.id === product.id) ? prev : [...prev, product])
  }

  function removeFromWishlist(productId: string) {
    setItems(prev => prev.filter(p => p.id !== productId))
  }

  function isWishlisted(productId: string) {
    return items.some(p => p.id === productId)
  }

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
