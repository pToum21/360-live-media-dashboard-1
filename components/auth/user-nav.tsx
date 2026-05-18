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
      <DropdownMenuContent className="w-64 backdrop-blur-xl bg-white/90 border border-white/20 shadow-2xl" align="end" forceMount style={{ backdropFilter: 'blur(20px) saturate(180%)' }}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1.5 p-2">
            <p className="text-sm font-semibold leading-none tracking-tight text-gray-900">{session.user.name || session.user.email?.split('@')[0]}</p>
            <p className="text-xs leading-none text-gray-600 font-medium">
              {session.user.email}
            </p>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
              <span className="text-xs text-gray-600">Role:</span>
              <span className="text-xs font-semibold px-2 py-1 rounded-md bg-green-100 text-green-700">{session.user.role}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-200" />
        <DropdownMenuItem 
          onClick={() => router.push('/dashboard/settings')}
          className="cursor-pointer hover:bg-green-50 transition-colors"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-200" />
        <DropdownMenuItem asChild>
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
