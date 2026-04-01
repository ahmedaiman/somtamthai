import type { Metadata } from 'next'
import { DM_Sans, Lora } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Som Tam Thai',
  description: 'Authentic Thai cuisine, scratch-cooked – Maafannu, Malé, Maldives.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${lora.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}
