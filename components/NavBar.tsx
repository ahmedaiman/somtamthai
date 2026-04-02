'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ShoppingBag, User, LogOut, ChevronDown } from 'lucide-react'
import { OPERATING_HOURS } from '@/lib/mockData'
import { useCart } from '@/lib/cartContext'
import { useAuth } from '@/lib/authContext'
import OtpModal from '@/components/OtpModal'

const NAV_LINKS = [
  { href: '/', label: 'Menu' },
  { href: '/reservations', label: 'Reservations' },
  { href: '/orders', label: 'Orders' },
  { href: '/account', label: 'Account' },
]

export default function NavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { totalItems } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  const handleSignOut = () => {
    logout()
    setDropdownOpen(false)
    router.push('/')
  }

  return (
    <>
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

        <div className="flex items-center gap-3">
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

          {mounted && (
            isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-gray-200 hover:border-brand-green hover:bg-green-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-green text-white flex items-center justify-center text-xs font-bold font-lora">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-800 max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className={`hidden md:block w-3.5 h-3.5 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.phone}</p>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      My Account
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4 text-gray-400" />
                      My Orders
                    </Link>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowOtpModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-green text-white text-sm font-semibold hover:bg-green-900 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )
          )}
        </div>
      </nav>

      <OtpModal
        open={showOtpModal}
        onClose={() => setShowOtpModal(false)}
      />
    </>
  )
}
