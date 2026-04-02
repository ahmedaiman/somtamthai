'use client'

import { useState } from 'react'
import { ADMIN_CUSTOMERS, CUSTOMER_KPIS, Customer } from '@/lib/mockData'
import { Search, X, Tag } from 'lucide-react'

const TAG_COLORS: Record<string, string> = {
  VIP: 'bg-brand-gold/20 text-yellow-800',
  Regular: 'bg-blue-100 text-blue-700',
  New: 'bg-green-100 text-green-700',
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(ADMIN_CUSTOMERS)
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState<'All' | 'VIP' | 'Regular' | 'New'>('All')
  const [drawer, setDrawer] = useState<Customer | null>(null)
  const [drawerNote, setDrawerNote] = useState('')

  const filtered = customers.filter((c) => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
    const matchTag = tagFilter === 'All' || c.tag === tagFilter
    return matchSearch && matchTag
  })

  const openDrawer = (c: Customer) => {
    setDrawer(c)
    setDrawerNote(c.note)
  }

  const saveNote = () => {
    if (!drawer) return
    setCustomers((prev) =>
      prev.map((c) => (c.id === drawer.id ? { ...c, note: drawerNote } : c))
    )
    setDrawer(null)
  }

  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-500 text-sm">{customers.length} registered customers</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {CUSTOMER_KPIS.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="text-xl font-bold text-gray-900 mb-1">{kpi.value}</div>
            <div className="text-xs text-gray-500">{kpi.label}</div>
            <div className="text-xs text-brand-green font-medium mt-1">{kpi.trend}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-[180px]">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or phone…"
              className="outline-none text-sm flex-1 bg-transparent"
            />
          </div>

          <div className="flex gap-2">
            {(['All', 'VIP', 'Regular', 'New'] as const).map((tag) => (
              <button
                key={tag}
                onClick={() => setTagFilter(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                  tagFilter === tag
                    ? 'bg-brand-green text-white border-brand-green'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand-green'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Tag</th>
                <th className="px-4 py-3 font-medium text-right">Total Spend</th>
                <th className="px-4 py-3 font-medium text-right">Orders</th>
                <th className="px-4 py-3 font-medium">Last Visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => openDrawer(c)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold text-sm flex-shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit ${TAG_COLORS[c.tag]}`}>
                      <Tag className="w-3 h-3" />
                      {c.tag}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-brand-green">MVR {c.totalSpend.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{c.totalOrders}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{c.lastVisit}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400 text-sm">No customers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {drawer && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setDrawer(null)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl z-50 flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold">
                  {drawer.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">{drawer.name}</h2>
                  <p className="text-xs text-gray-400">{drawer.phone}</p>
                </div>
              </div>
              <button onClick={() => setDrawer(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-5">
              <div className="flex gap-3 flex-wrap">
                <div className="flex-1 bg-gray-50 rounded-xl p-4 text-center min-w-[100px]">
                  <p className="text-xl font-bold text-brand-green">MVR {drawer.totalSpend.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Total Spend</p>
                </div>
                <div className="flex-1 bg-gray-50 rounded-xl p-4 text-center min-w-[80px]">
                  <p className="text-xl font-bold text-gray-900">{drawer.totalOrders}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Orders</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Customer Tag</p>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1 ${TAG_COLORS[drawer.tag]}`}>
                    <Tag className="w-3 h-3" /> {drawer.tag}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Last Visit</p>
                  <p className="text-sm font-medium text-gray-900">{drawer.lastVisit}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
                <textarea
                  value={drawerNote}
                  onChange={(e) => setDrawerNote(e.target.value)}
                  rows={3}
                  placeholder="Dietary restrictions, preferences…"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none resize-none focus:ring-2 focus:ring-brand-green"
                />
              </div>
            </div>

            <div className="p-5 border-t border-gray-100">
              <button
                onClick={saveNote}
                className="w-full py-2.5 bg-brand-green text-white rounded-xl text-sm font-semibold hover:bg-green-900 transition"
              >
                Save Notes
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  )
}
