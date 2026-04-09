import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { UserTag } from '@prisma/client'

const schema = z.object({
  notes: z.string().max(500).optional(),
  tag: z.nativeEnum(UserTag).optional(),
  name: z.string().max(100).optional(),
})

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const customer = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        include: { items: { select: { productName: true, quantity: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      reservations: { orderBy: { date: 'desc' }, take: 10 },
    },
  })

  if (!customer) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ customer })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const customer = await prisma.user.update({ where: { id }, data: parsed.data })
  return NextResponse.json({ customer })
}
