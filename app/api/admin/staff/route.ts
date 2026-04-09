import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  name: z.string().min(1).max(100),
  role: z.string().min(1).max(100),
  shift: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
})

export async function GET() {
  const staff = await prisma.staff.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json({ staff })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const member = await prisma.staff.create({ data: parsed.data })
  return NextResponse.json({ member }, { status: 201 })
}
