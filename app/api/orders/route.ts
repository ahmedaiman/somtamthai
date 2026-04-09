import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
import { DELIVERY_FEE } from '@/lib/constants'

const itemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  spiceLevel: z.string().optional(),
  addOns: z.array(z.string()).default([]),
})

const schema = z.object({
  orderType: z.enum(['DELIVERY', 'PICKUP']),
  deliveryAddress: z.string().max(500).optional(),
  scheduledTime: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
  items: z.array(itemSchema).min(1),
})

function generateOrderNumber(): string {
  return '#' + String(Math.floor(1000 + Math.random() * 9000))
}

export async function POST(req: NextRequest) {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { orderType, deliveryAddress, scheduledTime, notes, items } = parsed.data

  // Fetch products to validate prices
  const productIds = items.map((i) => i.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  })

  if (products.length !== productIds.length) {
    return NextResponse.json({ error: 'One or more products not found' }, { status: 400 })
  }

  const productMap = new Map(products.map((p) => [p.id, p]))

  let subtotal = 0
  const orderItems = items.map((item) => {
    const product = productMap.get(item.productId)!
    const unitPrice = Number(product.price)
    const addOnsData = product.addOns as { name: string; price: number }[]
    const addOnTotal = item.addOns.reduce((sum, name) => {
      const found = addOnsData.find((a) => a.name === name)
      return sum + (found?.price ?? 0)
    }, 0)
    const itemTotal = (unitPrice + addOnTotal) * item.quantity
    subtotal += itemTotal

    return {
      productId: item.productId,
      productName: product.name,
      productPrice: unitPrice,
      quantity: item.quantity,
      spiceLevel: item.spiceLevel,
      addOns: item.addOns,
      itemTotal,
    }
  })

  const fee = orderType === 'DELIVERY' ? DELIVERY_FEE : 0
  const total = subtotal + fee

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: session.userId,
      status: 'RECEIVED',
      orderType,
      deliveryAddress,
      scheduledTime: scheduledTime ? new Date(scheduledTime) : null,
      subtotal,
      deliveryFee: fee,
      total,
      notes,
      items: { create: orderItems },
    },
    include: { items: true },
  })

  return NextResponse.json({ order }, { status: 201 })
}

export async function GET(req: NextRequest) {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const limit = Math.min(Number(searchParams.get('limit') ?? 20), 50)

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    include: { items: { select: { productName: true, quantity: true, itemTotal: true } } },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return NextResponse.json({ orders })
}
