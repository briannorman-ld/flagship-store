import { createContext, useContext, useReducer, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { CartItem, Product } from '../types'

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD'; payload: { product: Product; quantity: number; size?: string; material?: string } }
  | { type: 'REMOVE'; payload: { productId: string; size?: string; material?: string } }
  | { type: 'UPDATE_QTY'; payload: { productId: string; size?: string; material?: string; quantity: number } }
  | { type: 'CLEAR' }
  | { type: 'LOAD'; payload: CartItem[] }

function itemKey(productId: string, size?: string, material?: string) {
  return `${productId}__${size ?? ''}__${material ?? ''}`
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'LOAD':
      return { items: action.payload }
    case 'ADD': {
      const { product, quantity, size, material } = action.payload
      const key = itemKey(product.id, size, material)
      const existing = state.items.find(i => itemKey(i.product.id, i.selectedSize, i.selectedMaterial) === key)
      if (existing) {
        return {
          items: state.items.map(i =>
            itemKey(i.product.id, i.selectedSize, i.selectedMaterial) === key
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        }
      }
      return { items: [...state.items, { product, quantity, selectedSize: size, selectedMaterial: material }] }
    }
    case 'REMOVE':
      return {
        items: state.items.filter(
          i => itemKey(i.product.id, i.selectedSize, i.selectedMaterial) !== itemKey(action.payload.productId, action.payload.size, action.payload.material)
        ),
      }
    case 'UPDATE_QTY':
      if (action.payload.quantity <= 0) {
        return {
          items: state.items.filter(
            i => itemKey(i.product.id, i.selectedSize, i.selectedMaterial) !== itemKey(action.payload.productId, action.payload.size, action.payload.material)
          ),
        }
      }
      return {
        items: state.items.map(i =>
          itemKey(i.product.id, i.selectedSize, i.selectedMaterial) === itemKey(action.payload.productId, action.payload.size, action.payload.material)
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

interface CartContextValue extends CartState {
  addToCart: (product: Product, quantity?: number, size?: string, material?: string) => void
  removeFromCart: (productId: string, size?: string, material?: string) => void
  updateQuantity: (productId: string, quantity: number, size?: string, material?: string) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, () => {
    try {
      const saved = localStorage.getItem('flagship_cart')
      return saved ? { items: JSON.parse(saved) } : { items: [] }
    } catch {
      return { items: [] }
    }
  })

  useEffect(() => {
    localStorage.setItem('flagship_cart', JSON.stringify(state.items))
  }, [state.items])

  const itemCount = state.items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0)
  const subtotal = state.items.reduce((sum: number, i: CartItem) => sum + i.product.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart: (product, quantity = 1, size, material) =>
          dispatch({ type: 'ADD', payload: { product, quantity, size, material } }),
        removeFromCart: (productId, size, material) =>
          dispatch({ type: 'REMOVE', payload: { productId, size, material } }),
        updateQuantity: (productId, quantity, size, material) =>
          dispatch({ type: 'UPDATE_QTY', payload: { productId, size, material, quantity } }),
        clearCart: () => dispatch({ type: 'CLEAR' }),
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
