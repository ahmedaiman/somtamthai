'use client'

import { useState } from 'react'
import { MOCK_ORDERS, COMPLETED_ORDERS, KANBAN_COLUMNS } from '@/lib/mockData'
import { Plus, X, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react'

type Order = (typeof MOCK_ORDERS)[0]

const COLUMN_COLORS: Record<string, string> = {
  Received: 'border-t-blue-400',
  Confirming: 'border-t-amber-400',
  Preparing: 'border-t-orange-500',
  Ready: 'border-t-green-500',
  Delivering: 'border-t-purple-500',
}

const COLUMN_BADGE: Record<string, string> = {
  Received: 'bg-blue-100 text-blue-700',
  Confirming: 'bg-amber-100 text-amber-700',
  Preparing: 'bg-orange-100 text-orange-700',
  Ready: 'bg-green-100 text-green-700',
  Delivering: 'bg-purple-100 text-purple-700',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)
  const [showModal, setShowModal] = useState(false)
  const [newOrder, setNewOrder] = useState({ customer: '', items: '', total: '', note: '' })

  const advanceOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o
        const currentIdx = KANBAN_COLUMNS.indexOf(o.status)
        if (currentIdx >= KANBAN_COLUMNS.length - 1) return o
        return { ...o, status: KANBAN_COLUMNS[currentIdx + 1] }
      })
    )
  }

  const cancelOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id))
  }

  const handleCreateOrder = () => {
    if (!newOrder.customer || !newOrder.items) return
    const order: Order = {
      id: `#${Math.floor(Math.random() * 9000 + 1000)}`,
      status: 'Received',
      customer: newOrder.customer,
      items: newOrder.items.split(',').map((s) => s.trim()),
      total: parseFloat(newOrder.total) || 0,
      time: 'Just now',
      note: newOrder.note,
    }
    setOrders((prev) => [order, ...prev])
    setNewOrder({ customer: '', items: '', total: '', note: '' })
    setShowModal(false)
  }

  return (
    <main className="flex-1 p-4 md:p-6 flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm">{orders.length} active orders</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-900 transition"
        >
          <Plus className="w-4 h-4" /> New Order
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 flex-1 min-h-[500px]">
        {KANBAN_COLUMNS.map((col) => {
          const colOrders = orders.filter((o) => o.status === col)
          const isLast = col === KANBAN_COLUMNS[KANBAN_COLUMNS.length - 1]
          return (
            <div
              key={col}
              className={`flex-shrink-0 w-60 bg-gray-50 rounded-xl border border-gray-200 border-t-4 ${COLUMN_COLORS[col]} flex flex-col`}
            >
              <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-bold text-gray-700 text-sm">{col}</h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${COLUMN_BADGE[col]}`}>
                  {colOrders.length}
                </span>
              </div>
              <div className="p-2 space-y-2 flex-1 overflow-y-auto">
                {colOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="font-bold text-sm text-gray-900">{order.id}</span>
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-medium">
                        {order.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium mb-1">{order.customer}</p>
                    <ul className="text-xs text-gray-500 mb-1.5 space-y-0.5">
                      {order.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    {order.note ? (
                      <p className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded mb-2 flex items-start gap-1">
                        <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        {order.note}
                      </p>
                    ) : null}
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-brand-green text-xs">MVR {order.total.toFixed(2)}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition rounded"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        {!isLast && (
                          <button
                            onClick={() => advanceOrder(order.id)}
                            className="p-1 text-brand-green hover:bg-green-50 rounded transition flex items-center gap-0.5 text-xs font-medium"
                            title="Advance"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {colOrders.length === 0 && (
                  <div className="text-center py-6 text-gray-300 text-xs">Empty</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Completed Today
          </h2>
          <span className="text-xs text-gray-400">{COMPLETED_ORDERS.length} orders</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
                <th className="px-4 py-3 font-medium text-right">Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {COMPLETED_ORDERS.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-gray-900">{o.id}</td>
                  <td className="px-4 py-3 text-gray-700">{o.customer}</td>
                  <td className="px-4 py-3 text-gray-500">{o.items} items</td>
                  <td className="px-4 py-3 text-right font-semibold text-brand-green">MVR {o.total.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-gray-400 text-xs">{o.completedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg text-gray-900">New Order</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  value={newOrder.customer}
                  onChange={(e) => setNewOrder((p) => ({ ...p, customer: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green"
                  placeholder="Ahmed Mohamed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Items (comma-separated)</label>
                <input
                  value={newOrder.items}
                  onChange={(e) => setNewOrder((p) => ({ ...p, items: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green"
                  placeholder="Pad Thai x1, Tom Yum x2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total (MVR)</label>
                <input
                  type="number"
                  value={newOrder.total}
                  onChange={(e) => setNewOrder((p) => ({ ...p, total: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green"
                  placeholder="350"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Note (optional)</label>
                <input
                  value={newOrder.note}
                  onChange={(e) => setNewOrder((p) => ({ ...p, note: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green"
                  placeholder="No peanuts..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrder}
                disabled={!newOrder.customer || !newOrder.items}
                className="flex-1 py-2.5 bg-brand-green text-white rounded-xl text-sm font-semibold hover:bg-green-900 disabled:opacity-50 transition"
              >
                Create Order
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
