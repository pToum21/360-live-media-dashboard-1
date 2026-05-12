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
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#2E8741] to-[#84BE41] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">360</span>
          </div>
          <span className="font-bold text-lg text-[#0C1C14]">Live Media</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#2E8741]/10 text-[#2E8741]"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          © 2026 360 Live Media
        </div>
      </div>
    </aside>
  )
}
