"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
  return (
    <Button
      onClick={() => signOut()}
      variant="ghost"
      className="text-[#2E8741] hover:text-[#2E8741] hover:bg-[#2E8741]/10"
    >
      Sign Out
    </Button>
  )
}
