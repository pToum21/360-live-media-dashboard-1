"use client"

import { usePathname } from "next/navigation"
import { UserNav } from "@/components/auth/user-nav"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

const pageInfo: Record<string, { title: string; description: string }> = {
  "/dashboard": {
    title: "Dashboard",
    description: "Overview of your marketing performance",
  },
  "/dashboard/website": {
    title: "Website Analytics",
    description: "Track website traffic and engagement metrics",
  },
  "/dashboard/email": {
    title: "Email Campaigns",
    description: "Monitor email campaign performance",
  },
  "/dashboard/social": {
    title: "Social Media",
    description: "Track LinkedIn and Instagram metrics",
  },
  "/dashboard/tagging": {
    title: "Content Tagging",
    description: "Organize and categorize social media content",
  },
  "/dashboard/clients": {
    title: "Client Projects",
    description: "Manage client analytics implementation",
  },
  "/dashboard/testing": {
    title: "A/B Testing",
    description: "Document and track optimization experiments",
  },
}

export function DashboardHeader() {
  const pathname = usePathname()
  const info = pageInfo[pathname || "/dashboard"] || pageInfo["/dashboard"]

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 backdrop-blur-sm bg-white/95 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#2E8741] to-[#84BE41] rounded-lg blur opacity-25"></div>
          <div className="relative">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#0C1C14] via-[#2E8741] to-[#0C1C14] bg-clip-text text-transparent">
              {info.title}
            </h1>
          </div>
        </div>
        <div className="h-8 w-px bg-gray-200"></div>
        <p className="text-sm text-gray-500 font-medium">{info.description}</p>
      </div>

      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative hover:bg-green-50 transition-colors group"
        >
          <Bell className="w-5 h-5 text-gray-600 group-hover:text-[#2E8741] transition-colors" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#2E8741] rounded-full pulse-glow"></span>
        </Button>
        <UserNav />
      </div>
    </header>
  )
}
