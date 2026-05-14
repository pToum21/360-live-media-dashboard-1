"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BarChart3,
  Mail,
  Users,
  Tag,
  Building2,
  FlaskConical,
} from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Website Analytics",
    href: "/dashboard/website",
    icon: BarChart3,
  },
  {
    title: "Email Campaigns",
    href: "/dashboard/email",
    icon: Mail,
  },
  {
    title: "Social Media",
    href: "/dashboard/social",
    icon: Users,
  },
  {
    title: "Content Tagging",
    href: "/dashboard/tagging",
    icon: Tag,
  },
  {
    title: "Client Projects",
    href: "/dashboard/clients",
    icon: Building2,
  },
  {
    title: "A/B Testing",
    href: "/dashboard/testing",
    icon: FlaskConical,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <aside className="w-72 bg-gradient-to-b from-[#0C1C14] via-[#103d27] to-[#0C1C14] flex flex-col border-r border-gray-800/50 shadow-2xl">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-[#2E8741] to-[#84BE41] rounded-xl flex items-center justify-center shadow-lg shadow-green-900/50 group-hover:scale-110 transition-transform duration-300">
            <span className="text-white font-bold">360</span>
          </div>
          <div>
            <span className="font-bold text-white text-lg block">Live Media</span>
            <span className="text-xs text-green-400 font-medium">Marketing Dashboard</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                isActive
                  ? "bg-gradient-to-r from-[#2E8741] to-[#2E8741]/80 text-white shadow-lg shadow-green-900/50"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#2E8741] to-[#84BE41] opacity-0 group-hover:opacity-20 transition-opacity"></div>
              )}
              <Icon className={cn("w-5 h-5 relative z-10", isActive ? "text-white" : "text-gray-400 group-hover:text-green-400")} />
              <span className="relative z-10">{item.title}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-white/10">
        <div className="text-xs text-gray-400 text-center">
          <p className="font-medium text-green-400 mb-1">360 Live Media</p>
          <p>© 2026 • Marketing Dashboard</p>
        </div>
      </div>
    </aside>
  )
}
