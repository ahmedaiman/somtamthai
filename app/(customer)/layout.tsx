import NavBar from '@/components/NavBar'
import BottomNav from '@/components/BottomNav'
import Footer from '@/components/Footer'
import { CartProvider } from '@/lib/cartContext'

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col relative">
        <NavBar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <BottomNav />
      </div>
    </CartProvider>
  )
}
