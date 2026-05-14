import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ClientManagement } from "@/components/dashboard/client-management"

export default async function ClientProjectsPage() {
  // Fetch client projects
  const clients = await prisma.client.findMany({
    orderBy: { name: 'asc' },
  })

  const utmEnabledCount = clients.filter(c => c.utmTracking).length

  return (
    <div className="space-y-8 animate-in">
      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700">Total Clients</CardTitle>
            <div className="w-10 h-10 gradient-orange rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
              <Building2 className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
              {clients.length}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Active client projects
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700">UTM Tracking</CardTitle>
            <div className="w-10 h-10 gradient-green rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              {utmEnabledCount}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Clients with UTM tracking enabled
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700">Coverage</CardTitle>
            <div className="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {((utmEnabledCount / clients.length) * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-gray-500 mt-2">
              UTM tracking coverage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Client Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Client Projects Overview</CardTitle>
          <CardDescription>
            Analytics tracking and conversion implementation status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clients.map((client) => (
              <div 
                key={client.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{client.name}</h3>
                    {client.eventName && (
                      <p className="text-sm text-muted-foreground">{client.eventName}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">Year: {client.year}</p>
                  </div>
                  <div className="flex gap-2">
                    {client.utmTracking ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        UTM Tracking
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                        <XCircle className="w-3 h-3 mr-1" />
                        No UTM
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Campaign Status:</span>
                    <p className="text-gray-600">{client.campaignStatus}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Dashboard Status:</span>
                    <p className="text-gray-600">{client.dashboardStatus}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Conversion Tracking:</span>
                    <p className="text-gray-600">{client.conversionTracking}</p>
                  </div>
                </div>

                {client.issueDescription && (
                  <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded">
                    <p className="text-xs font-medium text-orange-900 mb-1">Issue:</p>
                    <p className="text-sm text-orange-800">{client.issueDescription}</p>
                  </div>
                )}

                {client.nextSteps && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-xs font-medium text-blue-900 mb-1">Next Steps:</p>
                    <p className="text-sm text-blue-800">{client.nextSteps}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(
                clients.reduce((acc, client) => {
                  acc[client.campaignStatus] = (acc[client.campaignStatus] || 0) + 1
                  return acc
                }, {} as Record<string, number>)
              ).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm">{status}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Tracking Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(
                clients.reduce((acc, client) => {
                  acc[client.conversionTracking] = (acc[client.conversionTracking] || 0) + 1
                  return acc
                }, {} as Record<string, number>)
              ).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm">{status}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Management Section */}
      <Card className="chart-card">
        <CardHeader>
          <CardTitle>Manage Client Projects</CardTitle>
          <CardDescription>Add, edit, or remove client projects</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientManagement clients={clients} />
        </CardContent>
      </Card>
    </div>
  )
}
