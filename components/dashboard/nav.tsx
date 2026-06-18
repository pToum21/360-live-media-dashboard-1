"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  BarChart3,
  Mail,
  Users,
  Tag,
  Building2,
  FlaskConical,
  Settings,
  Ticket,
  FileText,
  DollarSign,
  UserCheck,
  Target,
  ChevronDown,
  ChevronRight,
  LineChart,
  Calendar,
  Cog,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"

// Define nav items with client restrictions
const allNavItems = [
  {
    title: "360° Command",
    href: "/dashboard",
    icon: LayoutDashboard,
    clients: ["360-live-media", "atc-2026"],
  },
  {
    title: "Analytics",
    icon: LineChart,
    clients: ["360-live-media", "atc-2026"],
    children: [
      {
        title: "Website Analytics",
        href: "/dashboard/website",
        clients: ["360-live-media", "atc-2026"],
      },
      {
        title: "Social Media",
        href: "/dashboard/social",
        clients: ["360-live-media", "atc-2026"],
      },
      {
        title: "GA4 Attribution",
        href: "/dashboard/ga4-registrations",
        clients: ["atc-2026"],
      },
    ],
  },
  {
    title: "Email",
    icon: Mail,
    clients: ["360-live-media", "atc-2026"],
    children: [
      {
        title: "Campaigns",
        href: "/dashboard/email",
        clients: ["360-live-media", "atc-2026"],
      },
      {
        title: "Analytics",
        href: "/dashboard/email-analytics",
        clients: ["atc-2026"],
      },
    ],
  },
  {
    title: "Event Management",
    icon: Calendar,
    clients: ["atc-2026"],
    children: [
      {
        title: "Event Registrations",
        href: "/dashboard/registrations",
        clients: ["atc-2026"],
      },
      {
        title: "Pass Types",
        href: "/dashboard/pass-types",
        clients: ["atc-2026"],
      },
      {
        title: "Abstracts",
        href: "/dashboard/abstracts",
        clients: ["atc-2026"],
      },
    ],
  },
  {
    title: "Paid Media",
    href: "/dashboard/paid-media",
    icon: Target,
    clients: ["atc-2026"],
  },
  {
    title: "A/B Testing",
    href: "/dashboard/testing",
    icon: FlaskConical,
    clients: ["360-live-media", "atc-2026"],
  },
  {
    title: "Content Tagging",
    href: "/dashboard/tagging",
    icon: Tag,
    clients: ["360-live-media", "atc-2026"],
  },
  {
    title: "Revenue",
    href: "/dashboard/revenue",
    icon: DollarSign,
    clients: ["atc-2026"],
  },
  {
    title: "Settings",
    icon: Cog,
    clients: ["360-live-media", "atc-2026"],
    children: [
      {
        title: "Client Projects",
        href: "/dashboard/clients",
        clients: ["360-live-media", "atc-2026"],
      },
      {
        title: "API Settings",
        href: "/dashboard/settings/api",
        clients: ["360-live-media", "atc-2026"],
      },
    ],
  },
]

export function DashboardNav() {
  const pathname = usePathname()
  const [selectedClient, setSelectedClient] = useState<string>("360-live-media")
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({})
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

  // Toggle dropdown
  const toggleDropdown = (title: string) => {
    setOpenDropdowns(prev => ({ ...prev, [title]: !prev[title] }))
  }

  // Load collapsed state from localStorage
  useEffect(() => {
    const collapsed = localStorage.getItem('sidebarCollapsed') === 'true'
    setIsCollapsed(collapsed)
  }, [])

  // Save collapsed state to localStorage
  const toggleCollapse = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', String(newState))
    // Close all dropdowns when collapsing
    if (newState) {
      setOpenDropdowns({})
    }
    // Dispatch custom event for main content wrapper
    window.dispatchEvent(new Event('sidebarToggle'))
  }

  // Get selected client from cookies
  useEffect(() => {
    const getClientFromCookie = () => {
      const cookies = document.cookie.split(';')
      const clientCookie = cookies.find(c => c.trim().startsWith('selectedClient='))
      if (clientCookie) {
        const client = clientCookie.split('=')[1]
        setSelectedClient(client)
      }
    }
    
    getClientFromCookie()
    
    // Listen for client changes
    const handleClientChange = () => {
      getClientFromCookie()
    }
    
    window.addEventListener('storage', handleClientChange)
    window.addEventListener('client-changed', handleClientChange)
    
    return () => {
      window.removeEventListener('storage', handleClientChange)
      window.removeEventListener('client-changed', handleClientChange)
    }
  }, [])

  // Filter nav items based on selected client
  const navItems = allNavItems.filter(item => item.clients.includes(selectedClient))

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full flex flex-col border-r border-white/20 dark:border-white/10 shadow-2xl z-30 backdrop-blur-3xl bg-white/15 dark:bg-black/30 transition-all duration-300",
      isCollapsed ? "w-20" : "w-72"
    )} style={{ backdropFilter: 'blur(100px) saturate(180%)' }}>
      {/* Logo */}
      <div className="h-20 flex items-center justify-center px-6 border-b border-white/30 dark:border-white/10 relative">
        {!isCollapsed && (
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
        )}
        {isCollapsed && (
          <Link href="/dashboard" className="group">
            <div className="w-10 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
              <Image 
                src="/Logos/Info=Basic, Color=Green.png" 
                alt="360 Live Media Logo" 
                width={40}
                height={40}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </Link>
        )}
        
        {/* Collapse Toggle Button */}
        <button
          onClick={toggleCollapse}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <PanelLeftClose className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-5 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const hasChildren = item.children && item.children.length > 0
          const isDropdownOpen = openDropdowns[item.title]

          // Check if any child is active
          const isChildActive = hasChildren && item.children?.some((child: any) => 
            pathname === child.href || pathname?.startsWith(child.href + "/")
          )
          const isActive = !hasChildren && (pathname === item.href || pathname?.startsWith(item.href + "/"))

          if (hasChildren) {
            // Filter children by client
            const visibleChildren = item.children?.filter((child: any) => 
              child.clients.includes(selectedClient)
            )

            // When collapsed, don't show dropdowns - instead link to first child
            if (isCollapsed) {
              const firstChild = visibleChildren?.[0]
              if (!firstChild) return null
              
              const isAnyChildActive = visibleChildren?.some((child: any) => 
                pathname === child.href || pathname?.startsWith(child.href + "/")
              )
              
              return (
                <Link
                  key={item.title}
                  href={firstChild.href}
                  className={cn(
                    "flex items-center justify-center p-3 rounded-2xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                    isAnyChildActive
                      ? "bg-white/40 dark:bg-white/10 text-gray-800 dark:text-gray-200 shadow-lg border border-white/50 dark:border-white/20"
                      : "text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-gray-200"
                  )}
                  style={{ backdropFilter: isAnyChildActive ? 'blur(20px) saturate(150%)' : 'none' }}
                  title={item.title}
                >
                  <Icon className={cn("w-5 h-5 relative z-10 transition-all", isAnyChildActive ? "text-green-600 dark:text-green-500" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300")} />
                </Link>
              )
            }

            return (
              <div key={item.title}>
                <button
                  onClick={() => toggleDropdown(item.title)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                    isChildActive
                      ? "bg-white/40 dark:bg-white/10 text-gray-800 dark:text-gray-200 shadow-lg border border-white/50 dark:border-white/20"
                      : "text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-gray-200"
                  )}
                  style={{ backdropFilter: isChildActive ? 'blur(20px) saturate(150%)' : 'none' }}
                >
                  <Icon className={cn("w-5 h-5 relative z-10 transition-all", isChildActive ? "text-green-600 dark:text-green-500" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300")} />
                  <span className="relative z-10 font-medium tracking-tight">{item.title}</span>
                  {isDropdownOpen ? (
                    <ChevronDown className="ml-auto w-4 h-4" />
                  ) : (
                    <ChevronRight className="ml-auto w-4 h-4" />
                  )}
                </button>
                
                {isDropdownOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {visibleChildren?.map((child: any) => {
                      const childIsActive = pathname === child.href || pathname?.startsWith(child.href + "/")
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                            childIsActive
                              ? "bg-white/30 dark:bg-white/5 text-gray-800 dark:text-gray-200 border-l-2 border-green-500"
                              : "text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-gray-200"
                          )}
                        >
                          <span className="relative z-10 font-medium tracking-tight">{child.title}</span>
                          {childIsActive && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400"></div>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                "flex items-center rounded-2xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-2.5",
                isActive
                  ? "bg-white/40 dark:bg-white/10 text-gray-800 dark:text-gray-200 shadow-lg border border-white/50 dark:border-white/20"
                  : "text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-gray-200"
              )}
              style={{ backdropFilter: isActive ? 'blur(20px) saturate(150%)' : 'none' }}
              title={isCollapsed ? item.title : undefined}
            >
              <Icon className={cn("w-5 h-5 relative z-10 transition-all", isActive ? "text-green-600 dark:text-green-500" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300")} />
              {!isCollapsed && (
                <>
                  <span className="relative z-10 font-medium tracking-tight">{item.title}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400"></div>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-5 border-t border-white/30 dark:border-white/10">
        {isCollapsed ? (
          <div className="flex items-center justify-center">
            <Image 
              src="/Logos/Info=Basic, Color=Green.png" 
              alt="360 Live Media" 
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
              title="360 Live Media © 2026"
            />
          </div>
        ) : (
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
        )}
      </div>
    </aside>
  )
}
