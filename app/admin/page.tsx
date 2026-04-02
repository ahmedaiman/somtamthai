import { Download, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import {
  KPI_DATA,
  LIVE_QUEUE,
  TODAY_RESERVATIONS,
  TOP_ITEMS,
  REVENUE_CHART,
} from '@/lib/mockData'

export const metadata = {
  title: 'Dashboard — Som Tam Thai Admin',
}

const ICON_MAP: Record<string, string> = {
  'dollar-sign': '💰',
  'shopping-bag': '🛍️',
  'trending-up': '📈',
  users: '👥',
}

export default function AdminDashboardPage() {
  return (
    <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">Operational overview for today, April 1, 2026</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {KPI_DATA.map((kpi) => (
          <div key={kpi.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-xl">
                {ICON_MAP[kpi.icon] || '📊'}
              </div>
              <span
                className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
                  kpi.isUp ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
                }`}
              >
                {kpi.isUp ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {kpi.trend}
              </span>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">{kpi.title}</h3>
              <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Queue + Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Live Order Queue */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-900 flex items-center">
              <span className="w-2 h-2 rounded-full bg-brand-terracotta mr-2 animate-pulse inline-block" />
              Live Order Queue
            </h2>
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-brand-green hover:underline"
            >
              View Kanban
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto hide-scroll pb-2 flex-1">
            {['Received', 'Confirming', 'Preparing'].map((status) => (
              <div
                key={status}
                className="flex-1 min-w-[200px] bg-gray-50 rounded-lg p-3 border border-gray-100"
              >
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">
                  {status}
                </h3>
                <div className="space-y-2">
                  {LIVE_QUEUE.filter((o) => o.status === status).map((order) => (
                    <div
                      key={order.id}
                      className="bg-white p-3 rounded shadow-sm border border-gray-100 border-l-2 border-l-brand-green cursor-pointer hover:shadow transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-sm text-gray-900">{order.id}</span>
                        <span className="text-[10px] text-gray-500 font-medium bg-gray-100 px-1.5 py-0.5 rounded">
                          {order.time}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 mb-2">{order.customer}</div>
                      <div className="font-bold text-brand-green text-xs">
                        MVR {order.total.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-gray-900">Revenue This Week</h2>
            <span className="text-xs text-brand-green font-bold">MVR 17,200</span>
          </div>
          <p className="text-xs text-gray-400 mb-5">Daily breakdown</p>
          <div className="h-36 relative flex items-end gap-1.5">
            {[25, 50, 75].map((g) => (
              <div
                key={g}
                className="absolute left-0 right-0 border-t border-dashed border-gray-100"
                style={{ bottom: `${g}%` }}
              />
            ))}
            {REVENUE_CHART.map((bar) => (
              <div key={bar.day} className="flex-1 h-full flex flex-col justify-end items-center gap-1 group">
                <div className="relative w-full flex justify-center">
                  <div
                    className="w-full rounded-t-md bg-brand-green/40 group-hover:bg-brand-green transition-all duration-200 cursor-default"
                    style={{ height: `${(bar.pct / 100) * 144}px` }}
                  />
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[9px] px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow z-10">
                    MVR {bar.mvr.toLocaleString()}
                  </div>
                </div>
                <span className="text-[9px] text-gray-400 font-medium flex-shrink-0">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reservations + Top Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Reservations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-gray-900">Today&apos;s Reservations</h2>
            <Link
              href="/admin/reservations"
              className="text-sm font-medium text-brand-green hover:underline"
            >
              Manage
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-5 py-3 font-medium">Time</th>
                  <th className="px-5 py-3 font-medium">Details</th>
                  <th className="px-5 py-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {TODAY_RESERVATIONS.map((res, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-5 py-3 font-medium text-gray-900 whitespace-nowrap">
                      {res.time}
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-900">{res.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {res.party} pax • {res.table}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className={`inline-flex px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                          res.status === 'Confirmed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {res.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top-Selling Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-gray-900">Top-Selling Items</h2>
            <select className="text-sm border-none bg-transparent text-gray-500 font-medium focus:outline-none cursor-pointer">
              <option>Today</option>
              <option>This Week</option>
            </select>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-center space-y-4">
            {TOP_ITEMS.map((item) => (
              <div key={item.rank} className="flex items-center">
                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center font-bold text-gray-500 mr-4">
                  #{item.rank}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.count} orders</div>
                </div>
                <div
                  className={`flex items-center text-sm font-bold ${
                    item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {item.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
