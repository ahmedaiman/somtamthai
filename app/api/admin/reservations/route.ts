import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ReservationStatus } from '@prisma/client'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const date = searchParams.get('date')   // YYYY-MM-DD
  const status = searchParams.get('status') as ReservationStatus | null

  const where: Record<string, unknown> = {}
  if (status) where.status = status
  if (date) {
    const start = new Date(date)
    const end = new Date(date)
    end.setDate(end.getDate() + 1)
    where.date = { gte: start, lt: end }
  }

  const reservations = await prisma.reservation.findMany({
    where,
    include: { table: { select: { name: true, capacity: true } } },
    orderBy: [{ date: 'asc' }, { timeSlot: 'asc' }],
  })

  return NextResponse.json({ reservations })
}
