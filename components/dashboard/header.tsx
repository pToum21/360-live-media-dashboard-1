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
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div>
        <h1 className="text-xl font-bold text-[#0C1C14]">{info.title}</h1>
        <p className="text-sm text-gray-600">{info.description}</p>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#2E8741] rounded-full"></span>
        </Button>
        <UserNav />
      </div>
    </header>
  )
}
