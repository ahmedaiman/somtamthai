import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  key: z.string().min(1).max(100),
  value: z.unknown(),
})

export async function GET() {
  const settings = await prisma.setting.findMany()
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]))
  return NextResponse.json({ settings: map })
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const setting = await prisma.setting.upsert({
    where: { key: parsed.data.key },
    update: { value: parsed.data.value as object },
    create: { key: parsed.data.key, value: parsed.data.value as object },
  })
  return NextResponse.json({ setting })
}
