'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X, LayoutDashboard, Globe, Mail, Share2, Tag, Briefcase, FlaskConical } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: '360° Command', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Website Analytics', href: '/dashboard/website', icon: Globe },
  { name: 'Email Campaigns', href: '/dashboard/email', icon: Mail },
  { name: 'Social Media', href: '/dashboard/social', icon: Share2 },
  { name: 'Content Tagging', href: '/dashboard/tagging', icon: Tag },
  { name: 'Client Projects', href: '/dashboard/clients', icon: Briefcase },
  { name: 'A/B Testing', href: '/dashboard/testing', icon: FlaskConical },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="lg:hidden">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        className="fixed top-3 left-4 z-50 backdrop-blur-2xl bg-white/40 dark:bg-black/40 shadow-lg border border-white/50 dark:border-white/20 hover:bg-white/60 dark:hover:bg-black/50 rounded-2xl"
        style={{ backdropFilter: 'blur(40px) saturate(150%)' }}
      >
        {open ? <X className="h-5 w-5 text-gray-600 dark:text-gray-300" /> : <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />}
      </Button>

      {/* Mobile menu overlay */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-white/10 dark:bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setOpen(false)}
          />
          <nav className="fixed top-0 left-0 h-full w-72 z-40 shadow-2xl overflow-y-auto backdrop-blur-3xl bg-white/30 dark:bg-black/40 border-r border-white/40 dark:border-white/20" style={{ backdropFilter: 'blur(60px) saturate(150%)' }}>
            <div className="p-5">
              {/* Logo */}
              <div className="flex items-center justify-center mb-8 mt-12">
                <div className="w-32">
                  <img 
                    src="/Logos/Info=Basic, Color=Green.png" 
                    alt="360 Live Media Logo" 
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>

              {/* Navigation */}
              <div className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-300',
                        isActive
                          ? 'bg-white/40 dark:bg-white/10 text-gray-800 dark:text-gray-200 shadow-lg border border-white/50 dark:border-white/20'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-gray-200'
                      )}
                      style={{ backdropFilter: isActive ? 'blur(20px) saturate(150%)' : 'none' }}
                    >
                      <item.icon className={cn("h-5 w-5", isActive ? "text-green-600 dark:text-green-500" : "text-gray-500 dark:text-gray-400")} />
                      <span className="font-medium tracking-tight">{item.name}</span>
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full" />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          </nav>
        </>
      )}
    </div>
  )
}
