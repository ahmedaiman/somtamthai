import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  const [
    todayOrders,
    liveOrders,
    todayReservations,
    totalCustomers,
    topItems,
    weekRevenue,
  ] = await Promise.all([
    // All of today's orders
    prisma.order.findMany({
      where: { createdAt: { gte: todayStart, lte: todayEnd } },
      select: { total: true, status: true },
    }),

    // Live queue (non-terminal orders)
    prisma.order.findMany({
      where: { status: { in: ['RECEIVED', 'CONFIRMING', 'PREPARING', 'READY', 'DELIVERING'] } },
      include: {
        user: { select: { name: true } },
        items: { select: { productName: true, quantity: true } },
      },
      orderBy: { createdAt: 'asc' },
    }),

    // Today's reservations
    prisma.reservation.findMany({
      where: { date: { gte: todayStart, lte: todayEnd } },
      include: { table: { select: { name: true } } },
      orderBy: { timeSlot: 'asc' },
    }),

    // Total customers
    prisma.user.count(),

    // Top items this week
    prisma.orderItem.groupBy({
      by: ['productName'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),

    // Revenue last 7 days
    prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        status: { not: 'CANCELLED' },
      },
      _sum: { total: true },
    }),
  ])

  const todayRevenue = todayOrders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + Number(o.total), 0)

  const todayOrderCount = todayOrders.filter((o) => o.status !== 'CANCELLED').length
  const avgOrderValue = todayOrderCount > 0 ? todayRevenue / todayOrderCount : 0

  const tables = await prisma.table.findMany({ where: { isActive: true } })
  const occupiedCount = todayReservations.filter(
    (r) => r.status === 'CONFIRMED' && r.tableId !== null
  ).length

  const kpis = [
    { title: "Today's Revenue", value: `MVR ${todayRevenue.toLocaleString()}` },
    { title: 'Orders Today', value: String(todayOrderCount) },
    { title: 'Avg. Order Value', value: `MVR ${Math.round(avgOrderValue)}` },
    { title: 'Tables Occupied', value: `${occupiedCount}/${tables.length}` },
  ]

  return NextResponse.json({
    kpis,
    liveQueue: liveOrders,
    todayReservations,
    topItems,
    totalCustomers,
    weekRevenue,
  })
}
