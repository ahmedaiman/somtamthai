import NavBar from '@/components/NavBar'
import BottomNav from '@/components/BottomNav'
import Footer from '@/components/Footer'
import { CartProvider } from '@/lib/cartContext'
import { AuthProvider } from '@/lib/authContext'

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
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
    </AuthProvider>
  )
}
