'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function MainContentWrapper({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

  useEffect(() => {
    // Load initial state
    const collapsed = localStorage.getItem('sidebarCollapsed') === 'true'
    setIsCollapsed(collapsed)

    // Listen for sidebar toggle events
    const handleStorageChange = () => {
      const collapsed = localStorage.getItem('sidebarCollapsed') === 'true'
      setIsCollapsed(collapsed)
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Custom event for same-window updates
    window.addEventListener('sidebarToggle', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('sidebarToggle', handleStorageChange)
    }
  }, [])

  return (
    <div className={cn(
      "flex-1 flex flex-col transition-all duration-300",
      isCollapsed ? "lg:ml-20" : "lg:ml-72"
    )}>
      {children}
    </div>
  )
}
