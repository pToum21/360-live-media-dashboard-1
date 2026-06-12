"use client"

import { usePathname } from "next/navigation"
import { UserNav } from "@/components/auth/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { ClientSwitcher } from "@/components/dashboard/client-switcher"
import { 
  LayoutDashboard, 
  BarChart3, 
  Mail, 
  Users, 
  Tag, 
  Building2, 
  FlaskConical, 
  Settings,
  Sparkles
} from "lucide-react"

const pageInfo: Record<string, { title: string; description: string; icon: any; gradient: string }> = {
  "/dashboard": {
    title: "360° Command",
    description: "Overview of your marketing performance",
    icon: LayoutDashboard,
    gradient: "from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400"
  },
  "/dashboard/website": {
    title: "Website Analytics",
    description: "Track website traffic and engagement metrics",
    icon: BarChart3,
    gradient: "from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400"
  },
  "/dashboard/email": {
    title: "Email Campaigns",
    description: "Monitor email campaign performance",
    icon: Mail,
    gradient: "from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400"
  },
  "/dashboard/social": {
    title: "Social Media",
    description: "Track LinkedIn and Instagram metrics",
    icon: Users,
    gradient: "from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400"
  },
  "/dashboard/tagging": {
    title: "Content Tagging",
    description: "Organize and categorize social media content",
    icon: Tag,
    gradient: "from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400"
  },
  "/dashboard/clients": {
    title: "Client Projects",
    description: "Manage client analytics implementation",
    icon: Building2,
    gradient: "from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
  },
  "/dashboard/testing": {
    title: "A/B Testing",
    description: "Document and track optimization experiments",
    icon: FlaskConical,
    gradient: "from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400"
  },
  "/dashboard/settings": {
    title: "Settings",
    description: "Manage your account and preferences",
    icon: Settings,
    gradient: "from-gray-600 to-slate-600 dark:from-gray-400 dark:to-slate-400"
  },
  "/dashboard/settings/api": {
    title: "API Settings",
    description: "Configure your data integrations",
    icon: Settings,
    gradient: "from-gray-600 to-slate-600 dark:from-gray-400 dark:to-slate-400"
  },
}

export function DashboardHeader() {
  const pathname = usePathname()
  const info = pageInfo[pathname || "/dashboard"] || pageInfo["/dashboard"]
  const Icon = info.icon

  return (
    <header className="relative h-20 border-b border-white/20 dark:border-white/10 flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-3xl bg-white/15 dark:bg-black/30 shadow-lg overflow-hidden" style={{ backdropFilter: 'blur(100px) saturate(180%)' }}>
      {/* Animated gradient accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-40"></div>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
        backgroundSize: '32px 32px'
      }}></div>

      <div className="flex items-center gap-5 relative z-10">
        {/* Icon with glass effect and orbit animation */}
        <div className="relative group">
          <div className="absolute inset-0 bg-green-500/20 dark:bg-green-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50 group-hover:opacity-100"></div>
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-white/60 to-white/30 dark:from-white/10 dark:to-white/5 border border-white/40 dark:border-white/20 flex items-center justify-center backdrop-blur-xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
            <Icon className="w-7 h-7 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
          </div>
          {/* Orbiting dot */}
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50 animate-bounce"></div>
        </div>

        {/* Title and description */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight hover:tracking-wide transition-all duration-300 cursor-default drop-shadow-sm">
              {info.title}
            </h1>
            {/* Enhanced Live indicator with pulse ring */}
            <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 dark:bg-green-500/20 border border-green-500/30 dark:border-green-500/40 shadow-lg shadow-green-500/10">
              <div className="relative">
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                <div className="relative w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
              </div>
              <span className="text-[11px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">Live</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-green-500 dark:text-green-400" />
            {info.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 relative z-10">
        <ClientSwitcher />
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  )
}
