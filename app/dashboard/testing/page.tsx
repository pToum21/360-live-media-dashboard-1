import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FlaskConical, TrendingUp, Target } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default async function ABTestingPage() {
  // Fetch A/B tests
  const tests = await prisma.optimization.findMany({
    orderBy: { month: 'desc' },
  })

  // Group by channel
  const testsByChannel = tests.reduce((acc, test) => {
    const channel = test.channel || 'Unknown'
    acc[channel] = (acc[channel] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tests.length}</div>
            <p className="text-xs text-muted-foreground">
              Optimization experiments run
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Channels Tested</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(testsByChannel).length}</div>
            <p className="text-xs text-muted-foreground">
              Different marketing channels
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(tests.length / 12).toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Tests per month average
            </p>
          </CardContent>
        </Card>
      </div>

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
    </div>
  )
}
