import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

const schema = z.object({
  customerName: z.string().min(1).max(100),
  customerPhone: z.string().min(7).max(20),
  partySize: z.number().int().min(1).max(20),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeSlot: z.string().min(1),
  notes: z.string().max(500).optional(),
})

export async function POST(req: NextRequest) {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { customerName, customerPhone, partySize, date, timeSlot, notes } = parsed.data

  const reservation = await prisma.reservation.create({
    data: {
      userId: session.userId,
      customerName,
      customerPhone,
      partySize,
      date: new Date(date),
      timeSlot,
      notes,
      status: 'PENDING',
    },
  })

  return NextResponse.json({ reservation }, { status: 201 })
}

export async function GET(req: NextRequest) {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const type = searchParams.get('type') // 'upcoming' | 'past'

  const now = new Date()
  const where: Record<string, unknown> = { userId: session.userId }

  if (type === 'upcoming') {
    where.date = { gte: now }
    where.status = { in: ['PENDING', 'CONFIRMED'] }
  } else if (type === 'past') {
    where.OR = [{ date: { lt: now } }, { status: { in: ['COMPLETED', 'CANCELLED'] } }]
  }

  const reservations = await prisma.reservation.findMany({
    where,
    include: { table: { select: { name: true, capacity: true } } },
    orderBy: { date: type === 'past' ? 'desc' : 'asc' },
  })

  return NextResponse.json({ reservations })
}
