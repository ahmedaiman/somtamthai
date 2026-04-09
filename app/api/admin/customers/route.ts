import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserTag } from '@prisma/client'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const search = searchParams.get('search') ?? ''
  const tag = searchParams.get('tag') as UserTag | null
  const limit = Math.min(Number(searchParams.get('limit') ?? 50), 200)

  const customers = await prisma.user.findMany({
    where: {
      ...(tag ? { tag } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search } },
            ],
          }
        : {}),
    },
    include: {
      _count: { select: { orders: true } },
      orders: {
        where: { status: { not: 'CANCELLED' } },
        select: { total: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  // Compute totalSpend per customer
  const customerIds = customers.map((c) => c.id)
  const spendData = await prisma.order.groupBy({
    by: ['userId'],
    where: { userId: { in: customerIds }, status: { not: 'CANCELLED' } },
    _sum: { total: true },
  })
  const spendMap = new Map(spendData.map((s) => [s.userId, Number(s._sum.total ?? 0)]))

  const result = customers.map((c) => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    tag: c.tag,
    notes: c.notes,
    totalOrders: c._count.orders,
    totalSpend: spendMap.get(c.id) ?? 0,
    lastVisit: c.orders[0]?.createdAt ?? null,
    createdAt: c.createdAt,
  }))

  return NextResponse.json({ customers: result })
}
