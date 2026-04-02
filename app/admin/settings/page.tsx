'use client'

import { useState } from 'react'
import { RESTAURANT_INFO } from '@/lib/mockData'
import { Check, AlertTriangle } from 'lucide-react'

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-brand-green' : 'bg-gray-300'}`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  )
}

export default function AdminSettingsPage() {
  const [info, setInfo] = useState({
    name: RESTAURANT_INFO.name,
    phone: RESTAURANT_INFO.phone,
    address: RESTAURANT_INFO.address,
    currency: RESTAURANT_INFO.currency,
  })

  const [ordering, setOrdering] = useState({
    acceptingOrders: true,
    deliveryEnabled: true,
    pickupEnabled: true,
    preorderEnabled: false,
  })

  const [notifications, setNotifications] = useState({
    newOrder: true,
    newReservation: true,
    orderReady: true,
    dailySummary: false,
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const Toast = saved ? (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in">
      <Check className="w-4 h-4 text-green-400" />
      Settings saved successfully
    </div>
  ) : null

  const toggleOrdering = (key: keyof typeof ordering) =>
    setOrdering((o) => ({ ...o, [key]: !o[key] }))

  const toggleNotif = (key: keyof typeof notifications) =>
    setNotifications((n) => ({ ...n, [key]: !n[key] }))

  return (
    <>
    <main className="flex-1 p-4 md:p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm">Manage restaurant configuration</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            saved ? 'bg-green-600 text-white' : 'bg-brand-green text-white hover:bg-green-900'
          }`}
        >
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">Restaurant Info</h2>
          <div className="space-y-4">
            {[
              { label: 'Restaurant Name', key: 'name' as const, type: 'text' },
              { label: 'Phone Number', key: 'phone' as const, type: 'tel' },
              { label: 'Address', key: 'address' as const, type: 'text' },
              { label: 'Currency Code', key: 'currency' as const, type: 'text' },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                <input
                  type={f.type}
                  value={info[f.key]}
                  onChange={(e) => setInfo((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">Ordering Options</h2>
          <div className="space-y-4">
            {[
              { label: 'Accepting Orders', desc: 'Toggle to pause all incoming orders', key: 'acceptingOrders' as const },
              { label: 'Delivery', desc: 'Enable delivery service', key: 'deliveryEnabled' as const },
              { label: 'Pickup', desc: 'Allow customers to pick up orders', key: 'pickupEnabled' as const },
              { label: 'Preorders', desc: 'Accept orders in advance', key: 'preorderEnabled' as const },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <Toggle checked={ordering[item.key]} onChange={() => toggleOrdering(item.key)} />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">Notifications</h2>
          <div className="space-y-4">
            {[
              { label: 'New Order Alert', desc: 'Notify on new incoming orders', key: 'newOrder' as const },
              { label: 'New Reservation', desc: 'Notify when a reservation is made', key: 'newReservation' as const },
              { label: 'Order Ready', desc: 'Alert when an order is ready', key: 'orderReady' as const },
              { label: 'Daily Summary', desc: 'End-of-day performance report', key: 'dailySummary' as const },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <Toggle checked={notifications[item.key]} onChange={() => toggleNotif(item.key)} />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-red-200 shadow-sm p-6">
          <h2 className="font-bold text-red-600 mb-1 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Danger Zone
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            These actions are irreversible. Please be certain before proceeding.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 transition">
              Clear All Orders
            </button>
            <button className="px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 transition">
              Reset Menu to Default
            </button>
            <button className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition">
              Delete All Data
            </button>
          </div>
        </section>
      </div>
    </main>
    {Toast}
    </>
  )
}
