"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function SignInButton() {
  return (
    <Button
      onClick={() => signIn()}
      variant="ghost"
      className="text-[#2E8741] hover:text-[#2E8741] hover:bg-[#2E8741]/10"
    >
      Sign In
    </Button>
  )
}
