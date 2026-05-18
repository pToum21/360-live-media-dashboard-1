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
  Settings,
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
  {
    title: "API Settings",
    href: "/dashboard/settings/api",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-72 flex flex-col border-r border-white/20 shadow-2xl z-30 backdrop-blur-2xl bg-white/60" style={{ backdropFilter: 'blur(40px) saturate(180%)' }}>
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-white/20">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-[#2E8741] to-[#84BE41] rounded-xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300">
            <span className="text-white font-bold text-sm">360</span>
          </div>
          <div>
            <span className="font-bold text-gray-900 text-lg block tracking-tight">Live Media</span>
            <span className="text-xs text-green-600 font-medium">Marketing Dashboard</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-1.5">
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
                  ? "bg-gradient-to-r from-[#2E8741] to-[#3a9c54] text-white shadow-xl"
                  : "text-gray-700 hover:bg-white/50 hover:text-gray-900 hover:shadow-lg"
              )}
              style={isActive ? {} : { backdropFilter: 'blur(10px)' }}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#2E8741] to-[#84BE41] opacity-0 group-hover:opacity-20 transition-opacity"></div>
              )}
              <Icon className={cn("w-5 h-5 relative z-10 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-gray-600 group-hover:text-green-600")} />
              <span className="relative z-10 font-semibold tracking-tight">{item.title}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 rounded-full bg-green-200 animate-pulse shadow-lg shadow-green-400/50"></div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-white/20">
        <div className="text-xs text-gray-600 text-center">
          <p className="font-semibold text-green-600 mb-1">360 Live Media</p>
          <p className="font-medium">© 2026 • Marketing Dashboard</p>
        </div>
      </div>
    </aside>
  )
}
