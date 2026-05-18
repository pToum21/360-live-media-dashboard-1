import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { UserSettingsForm } from "@/components/settings/user-settings-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-green-700 to-gray-900 bg-clip-text text-transparent">
          Settings
        </h2>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Profile Settings */}
        <div className="lg:col-span-2">
          <Card className="card-hover border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold tracking-tight">Profile Information</CardTitle>
              <CardDescription className="text-gray-600">
                Update your personal information and how others see you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserSettingsForm user={session.user} />
            </CardContent>
          </Card>
        </div>

        {/* Account Info */}
        <div className="space-y-6">
          <Card className="card-hover border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold tracking-tight">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-sm text-gray-900 font-semibold mt-1">{session.user.email}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-gray-600">Role</p>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-green-100 text-green-700">
                    {session.user.role}
                  </span>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-gray-600">User ID</p>
                <p className="text-xs text-gray-500 font-mono mt-1">{session.user.id}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold tracking-tight">Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                  <p className="text-xs text-gray-600 mt-0.5">Receive email updates</p>
                </div>
                <div className="text-xs text-gray-500">Coming soon</div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Weekly Reports</p>
                  <p className="text-xs text-gray-600 mt-0.5">Get weekly summaries</p>
                </div>
                <div className="text-xs text-gray-500">Coming soon</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
