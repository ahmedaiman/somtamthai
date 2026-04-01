'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PRODUCTS } from '@/lib/mockData'
import { useCart } from '@/lib/cartContext'
import { ArrowLeft, Minus, Plus, ShoppingBag, Check } from 'lucide-react'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const product = PRODUCTS.find((p) => p.id === Number(id))
  const router = useRouter()
  const { addItem, totalItems } = useCart()

  const [selectedSpice, setSelectedSpice] = useState(product?.spiceLevels?.[0] ?? '')
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Item not found.</p>
        <Link href="/" className="text-brand-terracotta hover:underline font-medium">← Back to Menu</Link>
      </div>
    )
  }

  const addOnTotal = selectedAddOns.reduce((sum, name) => {
    const ao = product.addOns?.find((a) => a.name === name)
    return sum + (ao?.price ?? 0)
  }, 0)
  const subtotal = (product.price + addOnTotal) * quantity

  const handleToggleAddOn = (name: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    )
  }

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSpice || undefined, selectedAddOns)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-28 md:pb-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-gray-500 hover:text-brand-green text-sm font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Menu
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-brand-green/10 to-brand-gold/10 rounded-2xl flex items-center justify-center h-64 md:h-full min-h-[260px] relative">
          <span className="text-8xl">{product.emoji || '🍲'}</span>
          {product.isSoldOut && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-2xl">
              <span className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                Sold Out
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <span className="text-xs font-semibold text-brand-terracotta uppercase tracking-wider bg-orange-50 px-2.5 py-1 rounded-full">
              {product.category}
            </span>
            <h1 className="font-lora text-2xl md:text-3xl font-bold text-gray-900 mt-2 mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600 leading-relaxed">{product.desc}</p>
          </div>

          <div className="text-2xl font-bold text-brand-green">MVR {product.price}</div>

          {product.spiceLevels && product.spiceLevels.length > 0 && (
            <div>
              <p className="font-semibold text-gray-800 mb-2 text-sm">Spice Level</p>
              <div className="flex flex-wrap gap-2">
                {product.spiceLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedSpice(level)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      selectedSpice === level
                        ? 'bg-brand-green text-white border-brand-green'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-brand-green'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.addOns && product.addOns.length > 0 && (
            <div>
              <p className="font-semibold text-gray-800 mb-2 text-sm">Add-ons</p>
              <div className="space-y-2">
                {product.addOns.map((ao) => (
                  <label
                    key={ao.name}
                    className="flex items-center justify-between p-3 rounded-lg border bg-white cursor-pointer hover:border-brand-green transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-brand-green"
                        checked={selectedAddOns.includes(ao.name)}
                        onChange={() => handleToggleAddOn(ao.name)}
                      />
                      <span className="text-sm text-gray-700">{ao.name}</span>
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      {ao.price === 0 ? 'Free' : `+MVR ${ao.price}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="font-semibold text-gray-800 mb-2 text-sm">Quantity</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 py-2 font-semibold text-gray-900 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-gray-500 text-sm">Subtotal: <strong className="text-brand-green">MVR {subtotal}</strong></span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.isSoldOut}
            className={`w-full py-3.5 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 ${
              product.isSoldOut
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : added
                ? 'bg-green-600 text-white'
                : 'bg-brand-terracotta text-white hover:bg-orange-700 active:scale-95'
            }`}
          >
            {added ? (
              <>
                <Check className="w-5 h-5" />
                Added to Cart!
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                {product.isSoldOut ? 'Sold Out' : `Add to Cart · MVR ${subtotal}`}
              </>
            )}
          </button>

          {totalItems > 0 && (
            <Link
              href="/cart"
              className="text-center text-brand-green text-sm font-medium hover:underline"
            >
              View cart ({totalItems} item{totalItems !== 1 ? 's' : ''}) →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
