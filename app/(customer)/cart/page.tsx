'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cartContext'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Info } from 'lucide-react'

const DELIVERY_FEE = 30

export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCart()
  const [notes, setNotes] = useState('')
  const router = useRouter()

  const addOnCost = (item: (typeof items)[0]) =>
    item.addOns.reduce((s, name) => {
      const ao = item.product.addOns?.find((a) => a.name === name)
      return s + (ao?.price ?? 0)
    }, 0)

  const itemTotal = (item: (typeof items)[0]) =>
    (item.product.price + addOnCost(item)) * item.quantity

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 px-4 text-center pb-28 md:pb-0">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">Your cart is empty</h2>
          <p className="text-gray-500 text-sm">Add items from the menu to get started.</p>
        </div>
        <Link
          href="/"
          className="px-6 py-3 bg-brand-green text-white rounded-xl font-semibold hover:bg-green-900 transition"
        >
          Browse Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-28 md:pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-lora text-2xl font-bold text-gray-900">Your Cart</h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-700 transition-colors font-medium"
        >
          Clear all
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4 shadow-sm"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-brand-green/10 to-brand-gold/10 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                {item.product.emoji || '🍲'}
              </div>

              <div className="flex-grow min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug">{item.product.name}</h3>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 mt-0.5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {(item.spiceLevel || item.addOns.length > 0) && (
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {[item.spiceLevel, ...item.addOns].filter(Boolean).join(' · ')}
                  </p>
                )}

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                    <span className="px-3 text-sm font-semibold text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                  </div>
                  <span className="font-semibold text-brand-green text-sm">MVR {itemTotal(item)}</span>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Order Notes <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any allergies, special requests…"
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 resize-none outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm sticky top-24">
            <h2 className="font-lora text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>MVR {totalPrice}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery fee</span>
                <span>MVR {DELIVERY_FEE}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span className="text-brand-green">MVR {totalPrice + DELIVERY_FEE}</span>
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-3 mt-4 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">Cash on delivery only. Payment is collected upon arrival.</p>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full mt-4 py-3 bg-brand-terracotta text-white rounded-xl font-semibold hover:bg-orange-700 transition flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link href="/" className="block text-center text-sm text-gray-500 hover:text-brand-green mt-3 transition-colors">
              + Add more items
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
