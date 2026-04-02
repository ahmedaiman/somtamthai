'use client'

import { useState, useRef, useEffect } from 'react'
import { Phone, ArrowLeft, RotateCcw, X } from 'lucide-react'
import { useAuth } from '@/lib/authContext'

const DUMMY_OTP = '123456'

interface OtpModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
  title?: string
  subtitle?: string
}

export default function OtpModal({
  open,
  onClose,
  onSuccess,
  title = 'Sign In',
  subtitle = 'Enter your phone number to continue.',
}: OtpModalProps) {
  const { login } = useAuth()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!open) {
      setStep('phone')
      setPhone('')
      setOtp(['', '', '', '', '', ''])
      setError('')
      setLoading(false)
    }
  }, [open])

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.replace(/\D/g, '').length < 7) {
      setError('Please enter a valid phone number.')
      return
    }
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('otp')
    }, 800)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const entered = otp.join('')
    if (entered !== DUMMY_OTP) {
      setError('Incorrect OTP. Try 123456.')
      return
    }
    setError('')
    setLoading(true)
    setTimeout(() => {
      login(phone)
      onSuccess?.()
      onClose()
    }, 600)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-7 h-7 text-brand-green" />
          </div>
          <h2 className="font-lora text-2xl font-bold text-gray-900">
            {step === 'phone' ? title : 'Verify OTP'}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {step === 'phone' ? subtitle : `We sent a code to +960 ${phone}`}
          </p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mobile Number
              </label>
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-brand-green focus-within:border-brand-green transition">
                <span className="px-3 py-3 bg-gray-50 text-gray-600 text-sm border-r border-gray-300 font-medium">
                  +960
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setError('') }}
                  placeholder="7XX XXXX"
                  className="flex-1 px-3 py-3 outline-none text-gray-900 text-sm bg-white"
                  autoFocus
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-green text-white rounded-xl font-semibold hover:bg-green-900 transition disabled:opacity-60"
            >
              {loading ? 'Sending…' : 'Send OTP'}
            </button>

            <p className="text-center text-xs text-gray-400 mt-2">
              By continuing you agree to our Terms of Service.
            </p>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Enter 6-digit code
              </label>
              <div className="flex justify-center gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:border-brand-green focus:outline-none transition bg-gray-50"
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              <p className="text-center text-xs text-gray-400 mt-2">
                Hint: use <strong>123456</strong>
              </p>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading || otp.join('').length < 6}
              className="w-full py-3 bg-brand-green text-white rounded-xl font-semibold hover:bg-green-900 transition disabled:opacity-60"
            >
              {loading ? 'Verifying…' : 'Verify & Sign In'}
            </button>

            <div className="flex items-center justify-center gap-4 text-sm">
              <button
                type="button"
                onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); setError('') }}
                className="flex items-center gap-1 text-gray-500 hover:text-brand-green transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Change number
              </button>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={() => setOtp(['', '', '', '', '', ''])}
                className="flex items-center gap-1 text-gray-500 hover:text-brand-green transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Resend
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
