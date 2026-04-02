'use client'

import { useState } from 'react'
import { ADMIN_RESERVATIONS, TABLE_OPTIONS } from '@/lib/mockData'
import { X, Search, Users, Check, XCircle } from 'lucide-react'

type Res = (typeof ADMIN_RESERVATIONS)[0]

const STATUS_COLOR: Record<string, string> = {
  Confirmed: 'bg-green-100 text-green-700',
  Pending: 'bg-amber-100 text-amber-700',
  Cancelled: 'bg-red-100 text-red-700',
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Res[]>(ADMIN_RESERVATIONS)
  const [filterDate, setFilterDate] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [search, setSearch] = useState('')
  const [drawer, setDrawer] = useState<Res | null>(null)

  const confirm = (id: string) =>
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Confirmed' } : r)))

  const cancel = (id: string) =>
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Cancelled' } : r)))

  const filtered = reservations.filter((r) => {
    const matchDate = !filterDate || r.date.includes(filterDate)
    const matchStatus = filterStatus === 'All' || r.status === filterStatus
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.phone.includes(search)
    return matchDate && matchStatus && matchSearch
  })

  const confirmed = reservations.filter((r) => r.status === 'Confirmed').length
  const pending = reservations.filter((r) => r.status === 'Pending').length

  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
          <p className="text-gray-500 text-sm">{reservations.length} total</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: reservations.length, color: 'text-gray-900' },
          { label: 'Confirmed', value: confirmed, color: 'text-green-600' },
          { label: 'Pending', value: pending, color: 'text-amber-600' },
          { label: 'Tables', value: TABLE_OPTIONS.length, color: 'text-brand-green' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <div className={`text-2xl font-bold mb-1 ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5">
        <h2 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-gray-400" />
          Table Layout
        </h2>
        <div className="flex gap-3 flex-wrap">
          {TABLE_OPTIONS.map((t) => {
            const tablesForThisTable = reservations.filter((r) => r.table === t.label && r.status === 'Confirmed')
            const occupied = tablesForThisTable.length > 0
            return (
              <div
                key={t.id}
                className={`px-4 py-3 rounded-xl border-2 text-center min-w-[100px] ${
                  occupied ? 'border-brand-terracotta bg-orange-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <p className="font-bold text-sm text-gray-900">{t.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t.capacity} seats</p>
                <p className={`text-xs font-semibold mt-1 ${occupied ? 'text-brand-terracotta' : 'text-green-600'}`}>
                  {occupied ? 'Reserved' : 'Available'}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-[160px]">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or phone…"
              className="outline-none text-sm flex-1 bg-transparent"
            />
          </div>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-green"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-green"
          >
            {['All', 'Confirmed', 'Pending', 'Cancelled'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Guest</th>
                <th className="px-4 py-3 font-medium">Date & Time</th>
                <th className="px-4 py-3 font-medium">Table</th>
                <th className="px-4 py-3 font-medium">Party</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setDrawer(r)}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{r.date} · {r.time}</td>
                  <td className="px-4 py-3 text-gray-700">{r.table}</td>
                  <td className="px-4 py-3 text-gray-700">{r.party} pax</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[r.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                      {r.status === 'Pending' && (
                        <button
                          onClick={() => confirm(r.id)}
                          className="text-xs text-green-600 hover:text-green-800 font-medium flex items-center gap-1 transition"
                        >
                          <Check className="w-3.5 h-3.5" /> Confirm
                        </button>
                      )}
                      {r.status !== 'Cancelled' && (
                        <button
                          onClick={() => cancel(r.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400 text-sm">No reservations found</td>
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
              <h2 className="font-bold text-gray-900">Reservation {drawer.id}</h2>
              <button onClick={() => setDrawer(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Guest Name', value: drawer.name },
                  { label: 'Phone', value: drawer.phone },
                  { label: 'Date', value: drawer.date },
                  { label: 'Time', value: drawer.time },
                  { label: 'Table', value: drawer.table },
                  { label: 'Party Size', value: `${drawer.party} guests` },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-xs text-gray-400 mb-0.5">{f.label}</p>
                    <p className="font-medium text-gray-900 text-sm">{f.value}</p>
                  </div>
                ))}
              </div>
              {drawer.note && (
                <div className="bg-amber-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Note</p>
                  <p className="text-sm text-amber-800">{drawer.note}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${STATUS_COLOR[drawer.status] ?? 'bg-gray-100 text-gray-500'}`}>
                  {drawer.status}
                </span>
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 flex gap-3">
              {drawer.status === 'Pending' && (
                <button
                  onClick={() => { confirm(drawer.id); setDrawer({ ...drawer, status: 'Confirmed' }) }}
                  className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition"
                >
                  Confirm
                </button>
              )}
              {drawer.status !== 'Cancelled' && (
                <button
                  onClick={() => { cancel(drawer.id); setDrawer(null) }}
                  className="flex-1 py-2.5 border border-red-300 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  )
}
