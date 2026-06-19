import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { DashboardNav } from "@/components/dashboard/nav"
import { DashboardHeader } from "@/components/dashboard/header"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { MainContentWrapper } from "@/components/dashboard/main-content-wrapper"
import { Toaster } from "@/components/ui/sonner"
import { ClientProvider } from "@/contexts/client-context"
import { ReadOnlyProvider } from "@/contexts/readonly-context"

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
    <ClientProvider>
      <ReadOnlyProvider isReadOnly={false}>
        <div className="flex min-h-screen relative overflow-hidden">
          {/* Ultra Soft gradient background - Apple Liquid Glass style */}
          <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-100/40 via-purple-100/30 to-pink-100/25 dark:from-gray-950 dark:via-gray-900 dark:to-black">
            {/* Large soft floating orbs */}
            <div className="absolute -top-20 left-1/4 w-[500px] h-[500px] bg-blue-300/20 dark:bg-gray-800/30 rounded-full filter blur-[120px] opacity-50 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-300/15 dark:bg-gray-700/25 rounded-full filter blur-[150px] opacity-40 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-[550px] h-[550px] bg-green-200/15 dark:bg-green-950/40 rounded-full filter blur-[140px] opacity-35 animate-blob animation-delay-4000"></div>
          </div>
          
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <DashboardNav />
          </div>
          
          {/* Mobile Navigation */}
          <MobileNav />
          
          {/* Main Content */}
          <MainContentWrapper>
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 mt-16 lg:mt-0">
              <div className="max-w-[1600px] mx-auto">
                {children}
              </div>
            </main>
          </MainContentWrapper>
          <Toaster position="top-right" richColors />
        </div>
      </ReadOnlyProvider>
    </ClientProvider>
  )
}
