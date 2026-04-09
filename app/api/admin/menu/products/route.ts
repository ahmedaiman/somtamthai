import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  categoryId: z.number().int().positive(),
  name: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  price: z.number().positive(),
  emoji: z.string().max(10).optional(),
  isSoldOut: z.boolean().optional(),
  spiceLevels: z.array(z.string()).optional(),
  addOns: z.array(z.object({ name: z.string(), price: z.number() })).optional(),
})

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: { select: { name: true, slug: true } } },
    orderBy: [{ category: { displayOrder: 'asc' } }, { id: 'asc' }],
  })
  return NextResponse.json({ products })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const product = await prisma.product.create({
    data: {
      ...parsed.data,
      spiceLevels: parsed.data.spiceLevels ?? [],
      addOns: parsed.data.addOns ?? [],
    },
  })
  return NextResponse.json({ product }, { status: 201 })
}
