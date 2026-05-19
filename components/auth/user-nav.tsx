"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { SignInButton } from "./sign-in-button"
import { SignOutButton } from "./sign-out-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings } from "lucide-react"

export function UserNav() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return (
      <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
    )
  }

  if (!session?.user) {
    return <SignInButton />
  }

  const userInitials = session.user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || session.user.email?.substring(0, 2).toUpperCase() || "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all hover:scale-105">
          <Avatar className="h-10 w-10 shadow-lg">
            <AvatarImage src={session.user.image || undefined} alt={session.user.name || session.user.email || "User"} />
            <AvatarFallback className="bg-gradient-to-br from-[#2E8741] to-[#84BE41] text-white font-semibold text-sm">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 backdrop-blur-2xl bg-white/40 dark:bg-gray-900/80 border border-white/50 dark:border-white/20 shadow-xl" align="end" forceMount style={{ backdropFilter: 'blur(40px) saturate(150%)' }}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1.5 p-2">
            <p className="text-sm font-semibold leading-none tracking-tight text-gray-700 dark:text-gray-200">{session.user.name || session.user.email?.split('@')[0]}</p>
            <p className="text-xs leading-none text-gray-500 dark:text-gray-400 font-normal">
              {session.user.email}
            </p>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/40 dark:border-gray-700">
              <span className="text-xs text-gray-500 dark:text-gray-400">Role:</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-lg bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400">{session.user.role}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/40 dark:bg-gray-700" />
        <DropdownMenuItem 
          onClick={() => router.push('/dashboard/settings')}
          className="cursor-pointer hover:bg-white/30 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span className="font-medium">Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/40 dark:bg-gray-700" />
        <DropdownMenuItem asChild>
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
