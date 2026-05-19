import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Key, RefreshCw, CheckCircle, XCircle } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ApiConnectionCard } from "@/components/settings/api-connection-card"

export default async function ApiSettingsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/auth/signin")
  }

  // Fetch API connection status (we'll add a table for this)
  const apiConnections = [
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Automatically sync website metrics',
      connected: false,
      lastSync: null,
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Automatically sync email campaign data',
      connected: false,
      lastSync: null,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Automatically sync LinkedIn metrics',
      connected: false,
      lastSync: null,
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Automatically sync Instagram metrics',
      connected: false,
      lastSync: null,
    },
  ]

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          API Integrations
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Connect external platforms to automatically sync your marketing data
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Integrations</CardTitle>
            <div className="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <Settings className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
              {apiConnections.length}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Available platforms
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Connected</CardTitle>
            <div className="w-10 h-10 gradient-green rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
              {apiConnections.filter(a => a.connected).length}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Active connections
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Auto-Sync</CardTitle>
            <div className="w-10 h-10 gradient-orange rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
              <RefreshCw className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 dark:from-orange-400 dark:to-orange-600 bg-clip-text text-transparent">
              Daily
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Sync frequency
            </p>
          </CardContent>
        </Card>
      </div>

      {/* API Connections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {apiConnections.map((connection) => (
          <ApiConnectionCard key={connection.id} connection={connection} />
        ))}
      </div>

      {/* Instructions */}
      <Card className="chart-card border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-blue-600" />
            Setup Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">1. Google Analytics</h4>
            <p className="text-gray-600 dark:text-gray-400">Enable the Google Analytics Data API and create a service account with view permissions.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">2. Mailchimp</h4>
            <p className="text-gray-600 dark:text-gray-400">Generate an API key from your Mailchimp account settings.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">3. LinkedIn</h4>
            <p className="text-gray-600 dark:text-gray-400">Create a LinkedIn app and obtain OAuth credentials.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">4. Instagram</h4>
            <p className="text-gray-600 dark:text-gray-400">Connect via Facebook Business and Instagram Business API.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
