import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default async function ClientProjectsPage() {
  // Fetch client projects
  const clients = await prisma.client.findMany({
    orderBy: { name: 'asc' },
  })

  const utmEnabledCount = clients.filter(c => c.utmTracking).length

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">
              Active client projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">UTM Tracking</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{utmEnabledCount}</div>
            <p className="text-xs text-muted-foreground">
              Clients with UTM tracking enabled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((utmEnabledCount / clients.length) * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">
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
    </div>
  )
}
