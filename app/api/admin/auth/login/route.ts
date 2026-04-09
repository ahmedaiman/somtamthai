import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { signAdminToken, COOKIE_OPTIONS } from '@/lib/auth'
import { ADMIN_JWT_COOKIE_NAME } from '@/lib/constants'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
  }

  const { email, password } = parsed.data

  const admin = await prisma.adminUser.findUnique({ where: { email } })
  if (!admin) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const valid = await bcrypt.compare(password, admin.passwordHash)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = signAdminToken({ adminId: admin.id, email: admin.email })

  const res = NextResponse.json({ admin: { id: admin.id, email: admin.email, name: admin.name } })
  res.cookies.set(ADMIN_JWT_COOKIE_NAME, token, COOKIE_OPTIONS)
  return res
}
