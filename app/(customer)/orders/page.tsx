'use client'

import { useState } from 'react'
import { MOCK_ACTIVE_ORDER, MOCK_ORDER_HISTORY, ORDER_STATUSES } from '@/lib/mockData'
import Link from 'next/link'
import { Package, Clock, ChevronDown, RotateCcw, Check } from 'lucide-react'

export default function OrdersPage() {
  const order = MOCK_ACTIVE_ORDER
  const [historyExpanded, setHistoryExpanded] = useState(true)

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-28 md:pb-10 space-y-8">
      <h1 className="font-lora text-2xl font-bold text-gray-900">My Orders</h1>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-brand-green text-white p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/70 uppercase tracking-wider font-medium">Active Order</p>
            <p className="font-lora text-xl font-bold mt-0.5">Order {order.id}</p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 bg-brand-gold text-brand-green text-xs font-bold px-3 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5" />
              {order.estimatedTime}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start mb-6">
            {ORDER_STATUSES.map((status, i) => {
              const done = i < order.statusIndex
              const current = i === order.statusIndex
              return (
                <div key={status} className="flex-1 flex flex-col items-center">
                  <div className="flex items-center w-full">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-colors z-10 ${
                        done
                          ? 'bg-brand-green border-brand-green text-white'
                          : current
                          ? 'bg-brand-terracotta border-brand-terracotta text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}
                    >
                      {done ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-current" />
                      )}
                    </div>
                    {i < ORDER_STATUSES.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 ${i < order.statusIndex ? 'bg-brand-green' : 'bg-gray-200'}`}
                      />
                    )}
                  </div>
                  <p
                    className={`text-center mt-1.5 leading-snug ${
                      current ? 'text-brand-terracotta font-bold text-xs' : done ? 'text-brand-green text-xs' : 'text-gray-400 text-xs'
                    }`}
                    style={{ fontSize: '0.65rem' }}
                  >
                    {status}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-700">{item.name} × {item.qty}</span>
                <span className="font-medium text-gray-900">MVR {item.price * item.qty}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-2 mt-2 space-y-1">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span><span>MVR {order.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Delivery</span><span>MVR {order.deliveryFee}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900">
                <span>Total</span><span className="text-brand-green">MVR {order.total}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-3 text-center">Placed at {order.placedAt} · Paying cash on delivery</p>
        </div>
      </div>

      <div>
        <button
          onClick={() => setHistoryExpanded((e) => !e)}
          className="w-full flex items-center justify-between mb-4 group"
        >
          <h2 className="font-lora text-xl font-bold text-gray-900">
            Order History
            <span className="ml-2 text-sm font-normal text-gray-400">({MOCK_ORDER_HISTORY.length})</span>
          </h2>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${historyExpanded ? 'rotate-180' : ''}`}
          />
        </button>

        {historyExpanded && (
          MOCK_ORDER_HISTORY.length === 0 ? (
            <p className="text-gray-500 text-sm">No past orders yet.</p>
          ) : (
            <div className="space-y-3">
              {MOCK_ORDER_HISTORY.map((pastOrder) => (
                <div
                  key={pastOrder.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">{pastOrder.id}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        {pastOrder.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{pastOrder.date}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{pastOrder.items.join(', ')}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-brand-green text-sm">MVR {pastOrder.total}</p>
                    <Link
                      href="/"
                      className="text-xs text-brand-terracotta hover:underline mt-1 flex items-center gap-0.5 justify-end"
                    >
                      <RotateCcw className="w-3 h-3" /> Reorder
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
