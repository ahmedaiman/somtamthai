'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MOCK_ORDER_HISTORY, MOCK_UPCOMING_RESERVATIONS } from '@/lib/mockData'
import { useAuth } from '@/lib/authContext'
import OtpModal from '@/components/OtpModal'
import {
  User,
  Phone,
  MapPin,
  ShoppingBag,
  CalendarDays,
  RotateCcw,
  LogOut,
  ChevronRight,
  Save,
  Check,
  LogIn,
} from 'lucide-react'

export default function AccountPage() {
  const router = useRouter()
  const { user, isAuthenticated, logout, updateUser } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('G.Sunset, Maafannu, Malé')
  const [saved, setSaved] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (user) {
      setName(user.name)
      setPhone(user.phone)
    }
  }, [user])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateUser({ name, phone })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSignOut = () => {
    logout()
    router.push('/')
  }

  const upcoming = MOCK_UPCOMING_RESERVATIONS[0]

  if (mounted && !isAuthenticated) {
    return (
      <>
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 px-4 pb-28 md:pb-0 text-center">
          <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-brand-green" />
          </div>
          <div>
            <h2 className="font-lora text-2xl font-bold text-gray-900 mb-2">My Account</h2>
            <p className="text-gray-500 text-sm max-w-xs">
              Sign in with your phone number to view your account, track orders, and manage reservations.
            </p>
          </div>
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-brand-green text-white rounded-xl font-semibold hover:bg-green-900 transition"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </button>
          <p className="text-sm text-gray-400">
            New here?{' '}
            <Link href="/" className="text-brand-terracotta font-medium hover:underline">
              Browse menu
            </Link>
          </p>
        </div>

        <OtpModal
          open={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          title="Sign In"
          subtitle="Enter your phone number to access your account."
        />
      </>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-28 md:pb-10 space-y-6">
      <h1 className="font-lora text-2xl font-bold text-gray-900">My Account</h1>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center text-white font-bold text-2xl font-lora flex-shrink-0">
            {name.charAt(0) || '?'}
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg">{name || 'Guest'}</h2>
            <p className="text-gray-500 text-sm">{phone}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-gray-400" /> Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-gray-400" /> Mobile Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gray-400" /> Saved Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green"
            />
          </div>

          <button
            type="submit"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition ${
              saved ? 'bg-green-600 text-white' : 'bg-brand-green text-white hover:bg-green-900'
            }`}
          >
            {saved ? (
              <><Check className="w-4 h-4" /> Saved!</>
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </form>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { icon: <ShoppingBag className="w-5 h-5" />, label: 'My Orders', desc: 'Track and reorder', href: '/orders', color: 'text-brand-terracotta bg-orange-50' },
          { icon: <CalendarDays className="w-5 h-5" />, label: 'Reservations', desc: 'View and manage', href: '/reservations', color: 'text-brand-green bg-green-50' },
          { icon: <RotateCcw className="w-5 h-5" />, label: 'Reorder Last', desc: 'Quick reorder', href: '/', color: 'text-brand-gold bg-yellow-50' },
          { icon: <ShoppingBag className="w-5 h-5" />, label: 'Browse Menu', desc: 'See all dishes', href: '/', color: 'text-blue-600 bg-blue-50' },
        ].map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow group"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.color} flex-shrink-0`}>
              {card.icon}
            </div>
            <div className="flex-grow min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{card.label}</p>
              <p className="text-xs text-gray-400">{card.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-green transition-colors" />
          </Link>
        ))}
      </div>

      {upcoming && (
        <div className="bg-brand-green text-white rounded-2xl p-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-white/60 uppercase tracking-wider font-medium mb-1">
              Upcoming Reservation
            </p>
            <p className="font-lora text-lg font-bold">{upcoming.date}</p>
            <p className="text-white/80 text-sm mt-1">
              {upcoming.time} · {upcoming.party} guests · {upcoming.table}
            </p>
          </div>
          <Link
            href="/reservations"
            className="flex-shrink-0 bg-white/20 hover:bg-white/30 transition text-white text-xs font-semibold px-3 py-2 rounded-lg"
          >
            Manage
          </Link>
        </div>
      )}

      {MOCK_ORDER_HISTORY.length > 0 && (
        <div>
          <h2 className="font-lora text-xl font-bold text-gray-900 mb-3">Recent Orders</h2>
          <div className="space-y-2">
            {MOCK_ORDER_HISTORY.slice(0, 3).map((o) => (
              <div
                key={o.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900">{o.id}</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      {o.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{o.date}</p>
                  <p className="text-xs text-gray-500 truncate">{o.items.join(', ')}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-brand-green text-sm">MVR {o.total}</p>
                  <Link
                    href="/"
                    className="text-xs text-brand-terracotta hover:underline flex items-center gap-0.5 justify-end mt-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reorder
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <button
          onClick={handleSignOut}
          className="w-full p-4 flex items-center gap-3 text-red-500 hover:bg-red-50 transition rounded-xl"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  )
}
