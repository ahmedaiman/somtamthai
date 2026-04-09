import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const settings = await prisma.setting.findMany()
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]))
  return NextResponse.json({ settings: map })
}
