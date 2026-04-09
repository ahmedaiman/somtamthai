import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const schema = z.object({ tableId: z.number().int().positive().nullable() })

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid tableId' }, { status: 400 })

  const reservation = await prisma.reservation.update({
    where: { id },
    data: { tableId: parsed.data.tableId },
    include: { table: { select: { name: true, capacity: true } } },
  })
  return NextResponse.json({ reservation })
}
