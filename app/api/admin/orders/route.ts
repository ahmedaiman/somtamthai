import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { OrderStatus } from '@prisma/client'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const status = searchParams.get('status') as OrderStatus | null
  const date = searchParams.get('date') // YYYY-MM-DD
  const limit = Math.min(Number(searchParams.get('limit') ?? 50), 200)

  const where: Record<string, unknown> = {}
  if (status) where.status = status
  if (date) {
    const start = new Date(date)
    const end = new Date(date)
    end.setDate(end.getDate() + 1)
    where.createdAt = { gte: start, lt: end }
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: { select: { productName: true, quantity: true, spiceLevel: true, addOns: true } },
      user: { select: { name: true, phone: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return NextResponse.json({ orders })
}
