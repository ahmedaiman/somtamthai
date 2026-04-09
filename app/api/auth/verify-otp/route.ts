import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { signCustomerToken, COOKIE_OPTIONS } from '@/lib/auth'
import { JWT_COOKIE_NAME } from '@/lib/constants'

const schema = z.object({
  phone: z.string().min(7).max(20),
  code: z.string().length(6),
  name: z.string().max(100).optional(),
})

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  return digits.startsWith('960') ? `+${digits}` : `+960${digits}`
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const phone = normalizePhone(parsed.data.phone)
  const { code, name } = parsed.data

  // Find the most recent valid token
  const token = await prisma.otpToken.findFirst({
    where: {
      phone,
      code,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!token) {
    return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 })
  }

  // Mark token as used
  await prisma.otpToken.update({ where: { id: token.id }, data: { used: true } })

  // Upsert user
  const user = await prisma.user.upsert({
    where: { phone },
    update: name ? { name } : {},
    create: { phone, name: name ?? 'Guest' },
  })

  // Link token to user
  await prisma.otpToken.update({ where: { id: token.id }, data: { userId: user.id } })

  const jwt = signCustomerToken({ userId: user.id, phone: user.phone })

  const res = NextResponse.json({
    user: { id: user.id, phone: user.phone, name: user.name },
  })
  res.cookies.set(JWT_COOKIE_NAME, jwt, COOKIE_OPTIONS)
  return res
}
