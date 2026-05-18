import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { DashboardNav } from "@/components/dashboard/nav"
import { DashboardHeader } from "@/components/dashboard/header"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { Toaster } from "@/components/ui/sonner"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50/40 to-purple-50/30"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <DashboardNav />
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-72">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 mt-16 lg:mt-0">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  )
}
