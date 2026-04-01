'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { OPERATING_HOURS, MENU_CATEGORIES, PRODUCTS } from '@/lib/mockData'
import { useCart } from '@/lib/cartContext'
import { Info, Plus } from 'lucide-react'

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0])
  const { addItem, totalItems } = useCart()
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    MENU_CATEGORIES.forEach((cat) => {
      const el = sectionRefs.current[cat]
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveCategory(cat)
        },
        { rootMargin: '-40% 0px -55% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const scrollToCategory = (cat: string) => {
    sectionRefs.current[cat]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveCategory(cat)
  }

  return (
    <>
      <div className="bg-brand-green text-white py-14 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="font-lora text-4xl md:text-5xl font-bold mb-4 text-brand-cream">
            Som Tam Thai
          </h1>
          <p className="text-lg text-brand-cream/80 mb-6">
            Authentic Thai, Scratch-Cooked — Maafannu, Malé.
          </p>
          <div className="inline-flex items-center px-5 py-2 rounded-full text-sm font-semibold bg-brand-gold text-brand-green shadow">
            {OPERATING_HOURS.isOpen
              ? `Open Now • Closes ${OPERATING_HOURS.closesAt}`
              : 'Closed • Preorder for next service'}
          </div>
        </div>
      </div>

      {!OPERATING_HOURS.isOpen && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 flex items-start gap-3 max-w-7xl mx-auto mt-4 rounded-r-xl">
          <Info className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-amber-800 text-sm">We&apos;re currently closed</p>
            <p className="text-amber-700 text-sm mt-0.5">
              Orders placed now will be scheduled for our next service window.
            </p>
          </div>
        </div>
      )}

      <div className="sticky top-[60px] z-40 bg-brand-cream/95 backdrop-blur border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="flex space-x-6 w-max">
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => scrollToCategory(cat)}
                className={`text-sm font-medium whitespace-nowrap pb-1 transition-colors ${
                  activeCategory === cat
                    ? 'text-brand-terracotta border-b-2 border-brand-terracotta'
                    : 'text-gray-500 hover:text-brand-green'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 py-8 space-y-12 pb-28 md:pb-8">
        {MENU_CATEGORIES.map((category) => {
          const items = PRODUCTS.filter((p) => p.category === category)
          if (items.length === 0) return null
          return (
            <section
              key={category}
              id={category}
              className="scroll-mt-32"
              ref={(el) => { sectionRefs.current[category] = el }}
            >
              <h2 className="font-lora text-2xl font-bold mb-5 text-brand-green border-b border-gray-200 pb-2">
                {category}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative group flex flex-col"
                  >
                    <Link href={`/product/${product.id}`} className="block">
                      <div className="h-36 bg-gradient-to-br from-brand-green/10 to-brand-gold/10 flex items-center justify-center text-5xl relative">
                        {product.emoji || '🍲'}
                        {product.isSoldOut && (
                          <div className="absolute inset-0 bg-white/75 backdrop-blur-sm flex items-center justify-center">
                            <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                              Sold Out
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="p-3 flex flex-col flex-grow">
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1 hover:text-brand-green transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-grow">{product.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-brand-green text-sm">MVR {product.price}</span>
                        {product.isSoldOut ? (
                          <span className="text-xs text-gray-400">Unavailable</span>
                        ) : product.spiceLevels || product.addOns ? (
                          <Link
                            href={`/product/${product.id}`}
                            className="p-1.5 rounded-full bg-brand-terracotta text-white hover:bg-orange-700 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </Link>
                        ) : (
                          <button
                            onClick={() => addItem(product)}
                            className="p-1.5 rounded-full bg-brand-terracotta text-white hover:bg-orange-700 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {totalItems > 0 && (
        <div className="fixed bottom-20 left-0 right-0 z-50 flex justify-center pointer-events-none md:bottom-8">
          <Link
            href="/cart"
            className="pointer-events-auto inline-flex items-center gap-3 bg-brand-green text-white px-6 py-3 rounded-full shadow-xl font-semibold text-sm hover:bg-green-800 transition-colors"
          >
            <span className="bg-brand-gold text-brand-green rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {totalItems}
            </span>
            View Cart
          </Link>
        </div>
      )}
    </>
  )
}
