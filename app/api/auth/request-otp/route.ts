import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendOtp } from '@/lib/sms'
import { OTP_EXPIRY_MINUTES, OTP_MAX_REQUESTS, OTP_RATE_WINDOW_MINUTES } from '@/lib/constants'

const schema = z.object({
  phone: z.string().min(7).max(20),
})

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  return digits.startsWith('960') ? `+${digits}` : `+960${digits}`
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
  }

  const phone = normalizePhone(parsed.data.phone)

  // Rate limit: max OTP_MAX_REQUESTS per OTP_RATE_WINDOW_MINUTES
  const windowStart = new Date(Date.now() - OTP_RATE_WINDOW_MINUTES * 60 * 1000)
  const recentCount = await prisma.otpToken.count({
    where: { phone, createdAt: { gte: windowStart } },
  })
  if (recentCount >= OTP_MAX_REQUESTS) {
    return NextResponse.json(
      { error: `Too many requests. Try again in ${OTP_RATE_WINDOW_MINUTES} minutes.` },
      { status: 429 }
    )
  }

  // Invalidate previous unused tokens for this phone
  await prisma.otpToken.updateMany({
    where: { phone, used: false },
    data: { used: true },
  })

  const code = generateOtp()
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)

  await prisma.otpToken.create({ data: { phone, code, expiresAt } })
  await sendOtp(phone, code)

  return NextResponse.json({ success: true })
}
