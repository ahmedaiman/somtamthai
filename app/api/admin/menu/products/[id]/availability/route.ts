import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { isSoldOut } = await req.json().catch(() => ({}))
  if (typeof isSoldOut !== 'boolean') {
    return NextResponse.json({ error: 'isSoldOut must be a boolean' }, { status: 400 })
  }
  const product = await prisma.product.update({
    where: { id: Number(id) },
    data: { isSoldOut },
  })
  return NextResponse.json({ product })
}
