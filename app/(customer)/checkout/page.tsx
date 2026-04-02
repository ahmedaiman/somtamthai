'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/lib/cartContext'
import { useAuth } from '@/lib/authContext'
import { DINNER_TIME_SLOTS, OPERATING_HOURS } from '@/lib/mockData'
import { Check, ChevronRight, ShoppingBag, LogIn } from 'lucide-react'
import OtpModal from '@/components/OtpModal'

const DELIVERY_FEE = 30

const STEPS = ['Delivery', 'Schedule', 'Payment']
const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives.' },
  { id: 'bml', label: 'BML Mobile Pay', desc: 'Pay via Bank of Maldives app.' },
]

type FormData = {
  name: string
  phone: string
  address: string
  notes: string
  deliveryType: 'delivery' | 'pickup'
  timeSlot: string
  paymentMethod: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const { user, isAuthenticated, isAuthHydrated } = useAuth()
  const [step, setStep] = useState(0)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [form, setForm] = useState<FormData>({
    name: '',
    phone: '',
    address: '',
    notes: '',
    deliveryType: 'delivery',
    timeSlot: DINNER_TIME_SLOTS[0],
    paymentMethod: 'cod',
  })

  useEffect(() => {
    if (isAuthHydrated && !isAuthenticated) {
      setShowAuthModal(true)
    }
  }, [isAuthHydrated, isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      setShowAuthModal(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.name,
        phone: prev.phone || user.phone,
      }))
    }
  }, [user])

  const total = totalPrice + DELIVERY_FEE

  const update = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const canProceed = () => {
    if (step === 0)
      return (
        form.name.trim().length > 1 &&
        form.phone.trim().length > 5 &&
        (form.deliveryType === 'pickup' || form.address.trim().length > 3)
      )
    if (step === 1) return form.timeSlot !== ''
    return form.paymentMethod !== ''
  }

  const handleConfirm = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    const orderId = `ST${Math.floor(1000 + Math.random() * 9000)}`
    const now = new Date()
    const placedAt = now.toLocaleTimeString('en-MV', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    const orderData = {
      id: orderId,
      items: items.map((i) => ({
        name: i.product.name,
        qty: i.quantity,
        price: i.product.price,
      })),
      subtotal: totalPrice,
      deliveryFee: DELIVERY_FEE,
      total,
      paymentMethod: form.paymentMethod,
      deliveryType: form.deliveryType,
      address: form.address,
      timeSlot: form.timeSlot,
      placedAt,
      statusIndex: 0,
      estimatedTime: '25–35 min',
    }
    try {
      sessionStorage.setItem(`order_${orderId}`, JSON.stringify(orderData))
    } catch {}
    clearCart()
    router.push(`/orders/${orderId}`)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4 pb-28 md:pb-0">
        <ShoppingBag className="w-12 h-12 text-gray-300" />
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">Nothing to checkout</h2>
          <p className="text-gray-500 text-sm">Add items to your cart first.</p>
        </div>
        <Link
          href="/"
          className="px-6 py-3 bg-brand-green text-white rounded-xl font-semibold hover:bg-green-900 transition"
        >
          Browse Menu
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 py-6 pb-28 md:pb-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-lora text-2xl font-bold text-gray-900">Checkout</h1>
          {!isAuthenticated && (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 text-sm text-brand-green font-semibold hover:underline"
            >
              <LogIn className="w-4 h-4" />
              Sign in to continue
            </button>
          )}
        </div>

        {!isAuthenticated && (
          <div className="mb-5 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <LogIn className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Sign in required to place an order</p>
              <p className="text-xs text-amber-600 mt-0.5">
                You can fill in your details, but you&apos;ll need to sign in before confirming.{' '}
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="underline font-medium"
                >
                  Sign in now
                </button>
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  i < step
                    ? 'bg-brand-green border-brand-green text-white'
                    : i === step
                    ? 'border-brand-green text-brand-green bg-white'
                    : 'border-gray-300 text-gray-400 bg-white'
                }`}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${i === step ? 'text-brand-green' : 'text-gray-400'}`}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 ${i < step ? 'bg-brand-green' : 'bg-gray-200'}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          {step === 0 && (
            <div className="space-y-4">
              <div className="flex gap-3 mb-2">
                {(['delivery', 'pickup'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => update('deliveryType', type)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition ${
                      form.deliveryType === type
                        ? 'border-brand-green bg-brand-green/5 text-brand-green'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {type === 'delivery' ? '🛵 Delivery' : '🏃 Pickup'}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="Ahmed Mohamed"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="+960 7XX XXXX"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                />
              </div>
              {form.deliveryType === 'delivery' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Delivery Address
                  </label>
                  <textarea
                    value={form.address}
                    onChange={(e) => update('address', e.target.value)}
                    placeholder="Street, Flat / Building, Maafannu, Malé"
                    rows={2}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none resize-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                  />
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <p className="font-semibold text-gray-800">When should we deliver?</p>
              {OPERATING_HOURS.isOpen ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 font-medium">
                  Delivering now · Closes {OPERATING_HOURS.closesAt}
                </div>
              ) : (
                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  Restaurant is closed. Select an evening dinner slot.
                </p>
              )}

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Dinner time slots</p>
                <div className="grid grid-cols-3 gap-2">
                  {DINNER_TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => update('timeSlot', slot)}
                      className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition ${
                        form.timeSlot === slot
                          ? 'border-brand-green bg-brand-green text-white'
                          : 'border-gray-200 text-gray-700 hover:border-brand-green'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="font-semibold text-gray-800">Payment Method</p>
              {PAYMENT_METHODS.map((pm) => (
                <label
                  key={pm.id}
                  className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${
                    form.paymentMethod === pm.id
                      ? 'border-brand-green bg-brand-green/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={pm.id}
                    checked={form.paymentMethod === pm.id}
                    onChange={() => update('paymentMethod', pm.id)}
                    className="mt-0.5 accent-brand-green"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{pm.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{pm.desc}</p>
                  </div>
                </label>
              ))}

              <div className="border-t border-gray-100 pt-4 mt-4 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>MVR {totalPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>MVR {DELIVERY_FEE}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-base pt-1">
                  <span>Total</span>
                  <span className="text-brand-green">MVR {total}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-5 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition text-sm"
            >
              Back
            </button>
          )}
          <button
            onClick={
              step < 2
                ? () => setStep((s) => s + 1)
                : handleConfirm
            }
            disabled={!canProceed()}
            className="flex-1 py-3 bg-brand-terracotta text-white rounded-xl font-semibold hover:bg-orange-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {step < 2 ? (
              <>
                Continue <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              <>
                {isAuthenticated ? (
                  <>Place Order · MVR {total} <Check className="w-4 h-4" /></>
                ) : (
                  <>Sign In to Place Order <LogIn className="w-4 h-4" /></>
                )}
              </>
            )}
          </button>
        </div>
      </div>

      <OtpModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Sign In to Order"
        subtitle="Sign in with your phone number to place your order."
      />
    </>
  )
}
