'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X, LayoutDashboard, Globe, Mail, Share2, Tag, Briefcase, FlaskConical } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
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
        className="fixed top-4 left-4 z-50 backdrop-blur-xl bg-white/70 shadow-xl border border-white/20 hover:bg-white/90"
        style={{ backdropFilter: 'blur(20px) saturate(180%)' }}
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile menu overlay */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setOpen(false)}
          />
          <nav className="fixed top-0 left-0 h-full w-72 z-40 shadow-2xl overflow-y-auto backdrop-blur-2xl bg-white/60 border-r border-white/20" style={{ backdropFilter: 'blur(40px) saturate(180%)' }}>
            <div className="p-6">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-8 mt-12">
                <div className="w-10 h-10 bg-gradient-to-br from-[#2E8741] to-[#84BE41] rounded-xl flex items-center justify-center shadow-xl">
                  <span className="text-white font-bold text-sm">360</span>
                </div>
                <div>
                  <h2 className="text-gray-900 font-bold text-lg tracking-tight">Live Media</h2>
                  <p className="text-green-600 text-xs font-medium">Marketing Dashboard</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="space-y-1.5">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300',
                        isActive
                          ? 'bg-gradient-to-r from-[#2E8741] to-[#3a9c54] text-white shadow-xl'
                          : 'text-gray-700 hover:bg-white/50 hover:text-gray-900 hover:shadow-lg'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-semibold tracking-tight">{item.name}</span>
                      {isActive && (
                        <span className="ml-auto w-2 h-2 bg-green-200 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
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
