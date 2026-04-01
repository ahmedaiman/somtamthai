import { OPERATING_HOURS, MENU_CATEGORIES, PRODUCTS } from '@/lib/mockData'
import { Info } from 'lucide-react'

export const metadata = {
  title: 'Menu — Som Tam Thai',
}

export default function HomePage() {
  return (
    <>
      {/* Hero Banner */}
      <div className="bg-brand-green text-white py-12 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/food.png')" }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="font-lora text-4xl md:text-5xl font-bold mb-4 text-brand-cream">
            Som Tam Thai
          </h1>
          <p className="text-lg md:text-xl text-brand-cream/90 mb-6">
            Authentic Thai, Scratch-Cooked – Maafannu, Malé.
          </p>
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm bg-brand-gold text-brand-green">
            {OPERATING_HOURS.isOpen
              ? `Open Now • Closes ${OPERATING_HOURS.closesAt}`
              : 'Closed • Preorder for next service'}
          </div>
        </div>
      </div>

      {/* Preorder Banner */}
      {!OPERATING_HOURS.isOpen && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 m-4 max-w-7xl mx-auto rounded flex items-start">
          <Info className="w-5 h-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-amber-800 font-medium">We&apos;re currently closed</h3>
            <p className="text-amber-700 text-sm mt-1">
              You are viewing our menu in preorder mode. Orders placed now will be scheduled for our
              next service window.
            </p>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="sticky top-[60px] z-40 bg-brand-cream/95 backdrop-blur border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto hide-scroll">
          <div className="flex space-x-6 w-max">
            {MENU_CATEGORIES.map((cat, idx) => (
              <a
                key={cat}
                href={`#${cat}`}
                className={`text-sm font-medium whitespace-nowrap pb-1 ${
                  idx === 0
                    ? 'text-brand-terracotta border-b-2 border-brand-terracotta'
                    : 'text-gray-600 hover:text-brand-green'
                }`}
              >
                {cat}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="max-w-7xl mx-auto w-full px-4 py-8 space-y-12">
        {MENU_CATEGORIES.map((category) => {
          const categoryProducts = PRODUCTS.filter((p) => p.category === category)
          if (categoryProducts.length === 0) return null
          return (
            <section key={category} id={category} className="scroll-mt-32">
              <h2 className="font-lora text-2xl font-bold mb-6 text-brand-green border-b border-gray-200 pb-2">
                {category}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {categoryProducts.map((product) => (
                  <a
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative cursor-pointer group"
                  >
                    <div className="h-40 bg-gray-200 relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-brand-green/20 to-brand-gold/20 flex items-center justify-center text-4xl">
                        {product.emoji || '🍲'}
                      </div>
                      {product.isSoldOut && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                          <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2 h-10">{product.desc}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="font-semibold text-brand-green">MVR {product.price}</span>
                        <button
                          disabled={product.isSoldOut}
                          className={`p-2 rounded-full flex items-center justify-center transition-colors ${
                            product.isSoldOut
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-brand-terracotta text-white hover:bg-orange-700'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}
