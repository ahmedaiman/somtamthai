'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Product } from '@/lib/mockData'

export interface CartItem {
  id: string
  product: Product
  quantity: number
  spiceLevel?: string
  addOns: string[]
}

interface CartContextValue {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (product: Product, qty?: number, spiceLevel?: string, addOns?: string[]) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback(
    (product: Product, qty = 1, spiceLevel?: string, addOns: string[] = []) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex(
          (i) =>
            i.product.id === product.id &&
            i.spiceLevel === spiceLevel &&
            JSON.stringify(i.addOns.sort()) === JSON.stringify([...addOns].sort())
        )
        if (existingIndex >= 0) {
          const updated = [...prev]
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + qty,
          }
          return updated
        }
        return [
          ...prev,
          {
            id: `${product.id}-${Date.now()}`,
            product,
            quantity: qty,
            spiceLevel,
            addOns,
          },
        ]
      })
    },
    []
  )

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId))
  }, [])

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== itemId))
    } else {
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
      )
    }
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  const totalPrice = items.reduce((sum, i) => {
    const addOnCost = i.addOns.reduce((aSum, addOnName) => {
      const addOn = i.product.addOns?.find((a) => a.name === addOnName)
      return aSum + (addOn?.price ?? 0)
    }, 0)
    return sum + (i.product.price + addOnCost) * i.quantity
  }, 0)

  return (
    <CartContext.Provider
      value={{ items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart }}
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
