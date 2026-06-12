"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "Access denied. You do not have permission to sign in.",
  Verification: "The sign-in link is no longer valid. It may have expired.",
  Default: "An error occurred during sign-in.",
}

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default

  return (
    <Card className="w-full max-w-md border-2 border-destructive/50">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <CardTitle className="text-2xl">Authentication Error</CardTitle>
        <CardDescription>{errorMessage}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button asChild className="bg-[#2E8741] hover:bg-[#2E8741]/90 text-white">
          <Link href="/auth/signin">Try Again</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4">
      <Suspense fallback={<Card className="w-full max-w-md"><CardContent className="p-6 text-center">Loading...</CardContent></Card>}>
        <ErrorContent />
      </Suspense>
    </div>
  )
}
