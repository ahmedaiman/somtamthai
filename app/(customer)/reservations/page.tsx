'use client'

import { useState } from 'react'
import {
  DINNER_TIME_SLOTS,
  TABLE_OPTIONS,
  MOCK_UPCOMING_RESERVATIONS,
  MOCK_PAST_RESERVATIONS,
} from '@/lib/mockData'
import { CalendarDays, Clock, Users, Check, ChevronRight } from 'lucide-react'

const BOOKED_SLOTS = ['18:30', '19:00']

const statusColor: Record<string, string> = {
  Confirmed: 'bg-green-100 text-green-700',
  Pending: 'bg-amber-100 text-amber-700',
  Completed: 'bg-gray-100 text-gray-600',
}

export default function ReservationsPage() {
  const [selectedDate, setSelectedDate] = useState('2026-04-05')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedTable, setSelectedTable] = useState('')
  const [guests, setGuests] = useState(2)
  const [confirmed, setConfirmed] = useState(false)

  const selectedTableObj = TABLE_OPTIONS.find((t) => t.id === selectedTable)
  const canBook =
    selectedDate && selectedTime && selectedTable && guests > 0 && !BOOKED_SLOTS.includes(selectedTime)

  const handleConfirm = () => {
    setConfirmed(true)
    setTimeout(() => {
      setSelectedDate('2026-04-05')
      setSelectedTime('')
      setSelectedTable('')
      setGuests(2)
      setConfirmed(false)
    }, 3000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 md:pb-10 space-y-8">
      <h1 className="font-lora text-2xl font-bold text-gray-900">Reservations</h1>

      {confirmed && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 text-green-800">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm">Reservation Confirmed!</p>
            <p className="text-xs text-green-600">
              {selectedDate} at {selectedTime} for {guests} guests — {selectedTableObj?.label}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <h2 className="font-lora text-lg font-bold text-gray-900 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-brand-terracotta" />
          Book a Table
        </h2>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
            <input
              type="date"
              value={selectedDate}
              min="2026-04-01"
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Number of Guests</label>
            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                className="px-4 py-2.5 hover:bg-gray-100 transition text-gray-600 border-r border-gray-300"
              >
                −
              </button>
              <span className="flex-1 text-center font-semibold text-gray-900">{guests}</span>
              <button
                onClick={() => setGuests((g) => Math.min(8, g + 1))}
                className="px-4 py-2.5 hover:bg-gray-100 transition text-gray-600 border-l border-gray-300"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-400" />
            Available Time Slots
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {DINNER_TIME_SLOTS.map((slot) => {
              const booked = BOOKED_SLOTS.includes(slot)
              return (
                <button
                  key={slot}
                  onClick={() => !booked && setSelectedTime(slot)}
                  disabled={booked}
                  className={`py-2.5 rounded-xl text-sm font-medium border-2 transition ${
                    booked
                      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed line-through'
                      : selectedTime === slot
                      ? 'border-brand-green bg-brand-green text-white'
                      : 'border-gray-200 text-gray-700 hover:border-brand-green'
                  }`}
                >
                  {slot}
                </button>
              )
            })}
          </div>
          <p className="text-xs text-gray-400 mt-1.5">Strikethrough slots are already booked</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-gray-400" />
            Select Table
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {TABLE_OPTIONS.map((table) => (
              <button
                key={table.id}
                onClick={() => setSelectedTable(table.id)}
                className={`p-4 rounded-xl border-2 text-left transition ${
                  selectedTable === table.id
                    ? 'border-brand-green bg-brand-green/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-semibold text-gray-900 text-sm">{table.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">Up to {table.capacity} guests</p>
                {selectedTable === table.id && (
                  <div className="flex items-center gap-1 mt-2 text-brand-green text-xs font-medium">
                    <Check className="w-3.5 h-3.5" /> Selected
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={!canBook}
          className="w-full py-3 bg-brand-terracotta text-white rounded-xl font-semibold hover:bg-orange-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          Confirm Reservation
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div>
        <h2 className="font-lora text-xl font-bold text-gray-900 mb-4">Upcoming</h2>
        {MOCK_UPCOMING_RESERVATIONS.length === 0 ? (
          <p className="text-gray-500 text-sm">No upcoming reservations.</p>
        ) : (
          <div className="space-y-3">
            {MOCK_UPCOMING_RESERVATIONS.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-brand-green/10 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-brand-green leading-none">
                    {r.date.split(' ')[1].replace(',', '')}
                  </span>
                  <span className="text-xs text-brand-green/70">
                    {r.date.split(' ')[0].slice(0, 3)}
                  </span>
                </div>
                <div className="flex-grow">
                  <p className="font-semibold text-gray-900 text-sm">{r.table}</p>
                  <p className="text-xs text-gray-500">{r.time} · {r.party} guests</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[r.status] ?? ''}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-lora text-xl font-bold text-gray-900 mb-4">Past Reservations</h2>
        {MOCK_PAST_RESERVATIONS.length === 0 ? (
          <p className="text-gray-500 text-sm">No past reservations.</p>
        ) : (
          <div className="space-y-3">
            {MOCK_PAST_RESERVATIONS.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 opacity-75"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-gray-500 leading-none">
                    {r.date.split(' ')[1].replace(',', '')}
                  </span>
                  <span className="text-xs text-gray-400">
                    {r.date.split(' ')[0].slice(0, 3)}
                  </span>
                </div>
                <div className="flex-grow">
                  <p className="font-semibold text-gray-700 text-sm">{r.table}</p>
                  <p className="text-xs text-gray-400">{r.time} · {r.party} guests</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[r.status] ?? ''}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
