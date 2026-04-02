'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { MOCK_ACTIVE_ORDER, ORDER_STATUSES } from '@/lib/mockData'
import { Check, Clock, ArrowLeft, Home } from 'lucide-react'

type OrderItem = {
  name: string
  qty: number
  price: number
}

type TrackedOrder = {
  id: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  paymentMethod: string
  deliveryType?: string
  address?: string
  timeSlot?: string
  placedAt: string
  statusIndex: number
  estimatedTime: string
}

const PAYMENT_LABELS: Record<string, string> = {
  cod: 'Cash on Delivery',
  bml: 'BML Mobile Pay',
}

function buildFallbackOrder(): TrackedOrder {
  return {
    id: MOCK_ACTIVE_ORDER.id.replace(/^#/, ''),
    items: MOCK_ACTIVE_ORDER.items.map((i) => ({
      name: i.name,
      qty: i.qty,
      price: i.price,
    })),
    subtotal: MOCK_ACTIVE_ORDER.subtotal,
    deliveryFee: MOCK_ACTIVE_ORDER.deliveryFee,
    total: MOCK_ACTIVE_ORDER.total,
    paymentMethod: 'cod',
    deliveryType: 'delivery',
    placedAt: MOCK_ACTIVE_ORDER.placedAt,
    statusIndex: MOCK_ACTIVE_ORDER.statusIndex,
    estimatedTime: MOCK_ACTIVE_ORDER.estimatedTime,
  }
}

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [order, setOrder] = useState<TrackedOrder | null>(null)

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(`order_${id}`)
      if (stored) {
        setOrder(JSON.parse(stored))
        return
      }
    } catch {}
    setOrder(buildFallbackOrder())
  }, [id])

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const paymentLabel =
    PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28 md:pb-10 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/orders"
          className="text-gray-400 hover:text-gray-700 transition"
          aria-label="Back to orders"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-lora text-2xl font-bold text-gray-900">Order Tracking</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-brand-green text-white p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/70 uppercase tracking-wider font-medium">Your Order</p>
            <p className="font-lora text-xl font-bold mt-0.5">#{order.id}</p>
            <p className="text-sm text-white/70 mt-1">Placed at {order.placedAt}</p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 bg-brand-gold text-brand-green text-xs font-bold px-3 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5" />
              {order.estimatedTime}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Order Status
            </p>
            <div className="flex items-start">
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
                            ? 'bg-brand-terracotta border-brand-terracotta text-white animate-pulse'
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
                          className={`flex-1 h-0.5 ${
                            i < order.statusIndex ? 'bg-brand-green' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                    <p
                      className={`text-center mt-1.5 leading-snug ${
                        current
                          ? 'text-brand-terracotta font-bold'
                          : done
                          ? 'text-brand-green'
                          : 'text-gray-400'
                      }`}
                      style={{ fontSize: '0.6rem' }}
                    >
                      {status}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Items
            </p>
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {item.name} × {item.qty}
                </span>
                <span className="font-medium text-gray-900">
                  MVR {item.price * item.qty}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-2 mt-2 space-y-1">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>MVR {order.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Delivery</span>
                <span>MVR {order.deliveryFee}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-1">
                <span>Total</span>
                <span className="text-brand-green">MVR {order.total}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-0.5">Payment</p>
              <p className="font-medium text-gray-900">{paymentLabel}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-0.5">
                {order.deliveryType === 'pickup' ? 'Pickup' : 'Delivery'}
              </p>
              <p className="font-medium text-gray-900">
                {order.deliveryType === 'pickup'
                  ? 'Self Pickup'
                  : order.address || 'Maafannu, Malé'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          href="/orders"
          className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition text-sm"
        >
          View All Orders
        </Link>
        <Link
          href="/"
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-green text-white rounded-xl font-semibold hover:bg-green-900 transition text-sm"
        >
          <Home className="w-4 h-4" />
          Back to Menu
        </Link>
      </div>
    </div>
  )
}
