import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { ReservationStatus } from '@prisma/client'

const schema = z.object({ status: z.nativeEnum(ReservationStatus) })

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })

  const reservation = await prisma.reservation.update({
    where: { id },
    data: { status: parsed.data.status },
  })
  return NextResponse.json({ reservation })
}
