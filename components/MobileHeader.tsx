'use client'

import { Menu } from 'lucide-react'

interface MobileHeaderProps {
  title?: string
}

export default function MobileHeader({ title = 'Admin' }: MobileHeaderProps) {
  return (
    <div className="md:hidden bg-brand-green text-white p-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-brand-gold rounded flex items-center justify-center text-brand-green font-bold text-sm">
          S
        </div>
        <span className="font-lora font-bold">{title}</span>
      </div>
      <button className="text-white p-1">
        <Menu className="w-6 h-6" />
      </button>
    </div>
  )
}
