import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  categoryId: z.number().int().positive().optional(),
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  price: z.number().positive().optional(),
  emoji: z.string().max(10).optional(),
  isSoldOut: z.boolean().optional(),
  isActive: z.boolean().optional(),
  spiceLevels: z.array(z.string()).optional(),
  addOns: z.array(z.object({ name: z.string(), price: z.number() })).optional(),
})

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const product = await prisma.product.update({
    where: { id: Number(id) },
    data: parsed.data,
  })
  return NextResponse.json({ product })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.product.update({ where: { id: Number(id) }, data: { isActive: false } })
  return NextResponse.json({ success: true })
}
