'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  UtensilsCrossed,
  Clock,
  Users,
  Settings,
  LogOut,
  User,
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { id: 'orders', icon: ShoppingBag, label: 'Orders', badge: '6', href: '/admin/orders' },
  { id: 'reservations', icon: Calendar, label: 'Reservations', badge: '3', href: '/admin/reservations' },
  { id: 'menu', icon: UtensilsCrossed, label: 'Menu', href: '/admin/menu' },
  { id: 'schedule', icon: Clock, label: 'Schedule', href: '/admin/schedule' },
  { id: 'customers', icon: Users, label: 'Customers', href: '/admin/customers' },
  { id: 'settings', icon: Settings, label: 'Settings', href: '/admin/settings' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside className="fixed inset-y-0 left-0 bg-brand-green text-white w-64 hidden md:flex flex-col z-50">
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 bg-brand-gold rounded-md flex items-center justify-center text-brand-green font-bold text-xl">
          S
        </div>
        <div>
          <h1 className="font-lora font-bold text-lg leading-tight">Som Tam Thai</h1>
          <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">
            Admin Panel
          </span>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ id, icon: Icon, label, badge, href }) => {
          const active = isActive(href)
          return (
            <Link
              key={id}
              href={href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                active
                  ? 'bg-white/10 text-brand-gold font-bold'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center">
                <Icon
                  className={`w-5 h-5 mr-3 ${active ? 'text-brand-gold' : 'text-gray-400'}`}
                />
                {label}
              </div>
              {badge && (
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    active ? 'bg-brand-gold text-brand-green' : 'bg-red-500 text-white'
                  }`}
                >
                  {badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold">Admin User</div>
            <div className="text-xs text-gray-400">Restaurant Admin</div>
          </div>
        </div>
        <button className="w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 py-2 rounded transition-colors">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
