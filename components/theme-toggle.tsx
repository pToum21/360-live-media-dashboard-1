"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 backdrop-blur-xl bg-white/30 hover:bg-white/50 border border-white/40 transition-all duration-300"
      >
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="h-9 w-9 backdrop-blur-xl bg-white/30 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10 border border-white/40 dark:border-white/20 transition-all duration-300"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-gray-700 dark:text-gray-300 transition-all" />
      ) : (
        <Moon className="h-4 w-4 text-gray-700 dark:text-gray-300 transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
