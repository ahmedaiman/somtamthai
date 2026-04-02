'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Home, Calendar, User } from 'lucide-react'

const BOTTOM_NAV_ITEMS = [
  { href: '/', label: 'Menu', Icon: Home },
  { href: '/reservations', label: 'Book', Icon: Calendar },
  { href: '/account', label: 'Account', Icon: User },
]

export default function BottomNav() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 z-50">
      {BOTTOM_NAV_ITEMS.map(({ href, label, Icon }) => {
        const isActive = mounted && pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center transition-colors ${
              isActive ? 'text-brand-terracotta' : 'text-gray-500 hover:text-brand-green'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">{label}</span>
          </Link>
        )
      })}
    </div>
  )
}
