import AdminSidebar from '@/components/AdminSidebar'
import MobileHeader from '@/components/MobileHeader'

export const metadata = {
  title: 'Admin — Som Tam Thai',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        <MobileHeader />
        {children}
      </div>
    </div>
  )
}
