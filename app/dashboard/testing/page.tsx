import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FlaskConical, TrendingUp, Target } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { TestManagement } from "@/components/dashboard/test-management"
import { FilterableTestingChart } from "@/components/charts/filterable-testing-chart"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function ABTestingPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/auth/signin')
  }

  // Get selected client from cookies
  const cookieStore = await cookies()
  const selectedClientSlug = cookieStore.get('selectedClient')?.value || '360-live-media'

  const client = await prisma.client.findUnique({
    where: { slug: selectedClientSlug },
  })

  if (!client) {
    return <div>Client not found</div>
  }

  // Fetch A/B tests FILTERED BY CLIENT
  const tests = await prisma.optimization.findMany({
    where: { clientId: client.id },
    orderBy: { month: 'desc' },
  })

  // Group by channel
  const testsByChannel = tests.reduce((acc, test) => {
    const channel = test.channel || 'Unknown'
    acc[channel] = (acc[channel] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-8 animate-in">
      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700">Total Tests</CardTitle>
            <div className="w-10 h-10 gradient-teal rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform">
              <FlaskConical className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
              {tests.length}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Optimization experiments run
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700">Channels Tested</CardTitle>
            <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
              <Target className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              {Object.keys(testsByChannel).length}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Different marketing channels
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700">Learning Rate</CardTitle>
            <div className="w-10 h-10 gradient-green rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              {(tests.length / 12).toFixed(1)}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Tests per month average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filterable A/B Testing Chart */}
      <Card className="chart-card border-0 overflow-hidden shadow-lg">
        <CardHeader className="bg-gradient-to-r from-teal-50/10 dark:from-teal-900/20 to-transparent border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-teal rounded-xl flex items-center justify-center shadow-md">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900 dark:text-gray-100">A/B Testing Analysis</CardTitle>
              <CardDescription className="dark:text-gray-400">Visualize tests over time, by channel, and track cumulative progress</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <FilterableTestingChart data={tests} />
        </CardContent>
      </Card>

      {/* Tests by Channel */}
      <Card>
        <CardHeader>
          <CardTitle>Tests by Channel</CardTitle>
          <CardDescription>
            Distribution of A/B tests across marketing channels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(testsByChannel).map(([channel, count]) => (
              <div key={channel} className="flex items-center justify-between">
                <span className="font-medium">{channel}</span>
                <Badge>{count} tests</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Experiments</CardTitle>
          <CardDescription>
            Complete history of A/B tests and optimization experiments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tests.map((test) => (
              <div 
                key={test.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{test.month}</h3>
                      {test.channel && (
                        <Badge variant="secondary">{test.channel}</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-3">
                  {test.controlTest && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-xs font-medium text-blue-900 mb-1">Control (A):</p>
                      <p className="text-sm text-blue-800">{test.controlTest}</p>
                    </div>
                  )}
                  {test.testVariant && (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                      <p className="text-xs font-medium text-purple-900 mb-1">Test (B):</p>
                      <p className="text-sm text-purple-800">{test.testVariant}</p>
                    </div>
                  )}
                </div>

                {test.results && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded mb-3">
                    <p className="text-xs font-medium text-green-900 mb-1">Results:</p>
                    <p className="text-sm text-green-800">{test.results}</p>
                  </div>
                )}

                {test.conclusions && (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                    <p className="text-xs font-medium text-gray-900 mb-1">
                      Conclusions & Recommendations:
                    </p>
                    <p className="text-sm text-gray-700">{test.conclusions}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Management Section */}
      <Card className="chart-card">
        <CardHeader>
          <CardTitle>Manage A/B Tests</CardTitle>
          <CardDescription>Add, edit, or remove optimization tests</CardDescription>
        </CardHeader>
        <CardContent>
          <TestManagement tests={tests} />
        </CardContent>
      </Card>
    </div>
  )
}
