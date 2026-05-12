import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MailCheck } from "lucide-react"

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-[#84BE41]/10 rounded-2xl flex items-center justify-center mb-4">
            <MailCheck className="w-8 h-8 text-[#2E8741]" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription>
            A sign-in link has been sent to your email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            Click the link in the email to sign in to your account. The link will expire in 24 hours.
          </p>
          <p className="text-xs text-gray-500">
            If you don't see the email, check your spam folder.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
