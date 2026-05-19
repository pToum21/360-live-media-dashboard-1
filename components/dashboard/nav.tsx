"use client"

import Link from "next/link"
import Image from "next/image"
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
    title: "360° Command",
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
    <aside className="fixed left-0 top-0 h-full w-72 flex flex-col border-r border-white/20 dark:border-white/10 shadow-2xl z-30 backdrop-blur-3xl bg-white/15 dark:bg-black/30" style={{ backdropFilter: 'blur(100px) saturate(180%)' }}>
      {/* Logo */}
      <div className="h-20 flex items-center justify-center px-6 border-b border-white/30 dark:border-white/10">
        <Link href="/dashboard" className="group">
          <div className="w-32 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
            <Image 
              src="/Logos/Info=Basic, Color=Green.png" 
              alt="360 Live Media Logo" 
              width={128}
              height={128}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-5 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                isActive
                  ? "bg-white/40 dark:bg-white/10 text-gray-800 dark:text-gray-200 shadow-lg border border-white/50 dark:border-white/20"
                  : "text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-gray-200"
              )}
              style={{ backdropFilter: isActive ? 'blur(20px) saturate(150%)' : 'none' }}
            >
              <Icon className={cn("w-5 h-5 relative z-10 transition-all", isActive ? "text-green-600 dark:text-green-500" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300")} />
              <span className="relative z-10 font-medium tracking-tight">{item.title}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400"></div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-5 border-t border-white/30 dark:border-white/10">
        <div className="flex items-center gap-3">
          <Image 
            src="/Logos/Info=Basic, Color=Green.png" 
            alt="360 Live Media" 
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p className="font-medium text-gray-600 dark:text-gray-300 mb-0.5">360 Live Media</p>
            <p className="font-normal text-gray-400 dark:text-gray-500">© 2026</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
