'use client'

import { useState } from 'react'
import { SCHEDULE_CONFIG, STAFF_ROSTER, DAYS_OF_WEEK } from '@/lib/mockData'
import { Clock, Users, Check } from 'lucide-react'

type ScheduleDay = (typeof SCHEDULE_CONFIG)[0]

export default function AdminSchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleDay[]>(SCHEDULE_CONFIG)
  const [saved, setSaved] = useState(false)

  const updateDay = (idx: number, field: keyof ScheduleDay, value: boolean | string) => {
    setSchedule((prev) => prev.map((d, i) => (i === idx ? { ...d, [field]: value } : d)))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <main className="flex-1 p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-500 text-sm">Manage operating hours and staff roster</p>
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

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand-terracotta" />
          <h2 className="font-bold text-gray-900">Operating Hours</h2>
        </div>

        <div className="divide-y divide-gray-100">
          {schedule.map((day, idx) => (
            <div key={day.day} className="p-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center font-bold text-brand-green text-sm flex-shrink-0">
                  {day.day}
                </div>
                <div className="text-sm font-semibold text-gray-800 flex-grow">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                </div>
              </div>

              <div className="ml-16 space-y-3">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateDay(idx, 'lunchEnabled', !day.lunchEnabled)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        day.lunchEnabled ? 'bg-brand-green' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                          day.lunchEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span className="text-sm font-medium text-gray-700 w-14">Lunch</span>
                  </div>
                  {day.lunchEnabled && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        type="time"
                        value={day.lunchStart}
                        onChange={(e) => updateDay(idx, 'lunchStart', e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-brand-green"
                      />
                      <span className="text-gray-400 text-sm">—</span>
                      <input
                        type="time"
                        value={day.lunchEnd}
                        onChange={(e) => updateDay(idx, 'lunchEnd', e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-brand-green"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateDay(idx, 'dinnerEnabled', !day.dinnerEnabled)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        day.dinnerEnabled ? 'bg-brand-terracotta' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                          day.dinnerEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span className="text-sm font-medium text-gray-700 w-14">Dinner</span>
                  </div>
                  {day.dinnerEnabled && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        type="time"
                        value={day.dinnerStart ?? '18:00'}
                        onChange={(e) => updateDay(idx, 'dinnerStart', e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-brand-green"
                      />
                      <span className="text-gray-400 text-sm">—</span>
                      <input
                        type="time"
                        value={day.dinnerEnd ?? '22:00'}
                        onChange={(e) => updateDay(idx, 'dinnerEnd', e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-brand-green"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-terracotta" />
          <h2 className="font-bold text-gray-900">Staff Roster</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Staff</th>
                {DAYS_OF_WEEK.map((d) => (
                  <th key={d} className="px-3 py-3 font-medium text-center">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {STAFF_ROSTER.map((staff) => (
                <tr key={staff.name} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{staff.name}</p>
                    <p className="text-xs text-gray-400">{staff.role}</p>
                  </td>
                  {DAYS_OF_WEEK.map((d) => {
                    const working = staff.shifts.includes(d)
                    return (
                      <td key={d} className="px-3 py-3 text-center">
                        {working ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-green/10 text-brand-green">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="inline-block w-6 h-6 rounded-full bg-gray-100" />
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
