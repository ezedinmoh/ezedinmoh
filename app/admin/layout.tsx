import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { SessionProvider } from "@/components/admin/SessionProvider"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 p-4 lg:p-8 overflow-auto pt-16 lg:pt-8 min-w-0">{children}</main>
      </div>
    </SessionProvider>
  )
}
