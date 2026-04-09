import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const category = searchParams.get('category')

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(category ? { category: { slug: category } } : {}),
    },
    include: { category: { select: { name: true, slug: true } } },
    orderBy: [{ category: { displayOrder: 'asc' } }, { id: 'asc' }],
  })

  return NextResponse.json({ products })
}
