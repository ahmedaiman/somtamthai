'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  UtensilsCrossed,
  Clock,
  Users,
  Settings,
  LogOut,
} from 'lucide-react'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: ShoppingBag, label: 'Orders', badge: '6', href: '/admin/orders' },
  { icon: Calendar, label: 'Reservations', badge: '3', href: '/admin/reservations' },
  { icon: UtensilsCrossed, label: 'Menu', href: '/admin/menu' },
  { icon: Clock, label: 'Schedule', href: '/admin/schedule' },
  { icon: Users, label: 'Customers', href: '/admin/customers' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
]

interface MobileHeaderProps {
  title?: string
}

export default function MobileHeader({ title = 'Admin' }: MobileHeaderProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <>
      <div className="md:hidden bg-brand-green text-white px-4 py-3 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-brand-gold rounded flex items-center justify-center text-brand-green font-bold text-sm">
            S
          </div>
          <span className="font-lora font-bold">{title}</span>
        </div>
        <button onClick={() => setOpen(true)} className="text-white p-1" aria-label="Open menu">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-50 md:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 w-72 bg-brand-green text-white z-50 flex flex-col shadow-2xl md:hidden">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-gold rounded-md flex items-center justify-center text-brand-green font-bold text-lg">
                  S
                </div>
                <div>
                  <p className="font-lora font-bold text-base leading-tight">Som Tam Thai</p>
                  <p className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">Admin Panel</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map(({ icon: Icon, label, badge, href }) => {
                const active = isActive(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between px-3 py-3 rounded-lg transition-colors ${
                      active
                        ? 'bg-white/10 text-brand-gold font-bold'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${active ? 'text-brand-gold' : 'text-gray-400'}`} />
                      {label}
                    </div>
                    {badge && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${active ? 'bg-brand-gold text-brand-green' : 'bg-red-500 text-white'}`}>
                        {badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>

            <div className="p-4 border-t border-white/10">
              <button className="w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 py-2.5 rounded-lg transition-colors">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
