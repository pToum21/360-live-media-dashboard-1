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
  "/dashboard/settings": {
    title: "Settings",
    description: "Manage your account and preferences",
  },
  "/dashboard/settings/api": {
    title: "API Settings",
    description: "Configure your data integrations",
  },
}

export function DashboardHeader() {
  const pathname = usePathname()
  const info = pageInfo[pathname || "/dashboard"] || pageInfo["/dashboard"]

  return (
    <header className="h-20 border-b border-white/20 flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-2xl bg-white/60 shadow-lg" style={{ backdropFilter: 'blur(40px) saturate(180%)' }}>
      <div className="flex items-center gap-4">
        <div className="relative">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-green-700 to-gray-900 bg-clip-text text-transparent tracking-tight">
            {info.title}
          </h1>
        </div>
        <div className="h-8 w-px bg-gray-300/50"></div>
        <p className="text-sm text-gray-600 font-medium tracking-tight">{info.description}</p>
      </div>

      <div className="flex items-center gap-3">
        <UserNav />
      </div>
    </header>
  )
}
