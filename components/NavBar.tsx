'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { OPERATING_HOURS } from '@/lib/mockData'
import { useCart } from '@/lib/cartContext'

const NAV_LINKS = [
  { href: '/', label: 'Menu' },
  { href: '/reservations', label: 'Reservations' },
  { href: '/orders', label: 'Orders' },
  { href: '/account', label: 'Account' },
]

export default function NavBar() {
  const pathname = usePathname()
  const { totalItems } = useCart()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Link href="/" className="font-lora font-bold text-xl text-brand-green">
          Som Tam Thai
        </Link>
      </div>

      <div className="hidden md:flex gap-6 font-medium text-sm">
        {NAV_LINKS.map(({ href, label }) => {
          const isActive = mounted && pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={
                isActive
                  ? 'text-brand-terracotta border-b-2 border-brand-terracotta pb-1'
                  : 'text-gray-600 hover:text-brand-terracotta transition-colors'
              }
            >
              {label}
            </Link>
          )
        })}
      </div>

      <div className="flex items-center gap-4">
        {OPERATING_HOURS.isOpen ? (
          <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Open Now
          </span>
        ) : (
          <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            Preorder
          </span>
        )}

        <Link href="/cart" className="relative p-2 text-gray-600 hover:text-brand-green">
          <ShoppingBag className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white translate-x-1/4 -translate-y-1/4 bg-brand-terracotta rounded-full">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  )
}
