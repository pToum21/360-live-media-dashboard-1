import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, Clock } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { WebsiteTrendChart } from "@/components/charts/website-trend-chart"
import { TrafficSourceChart } from "@/components/charts/traffic-source-chart"

export default async function WebsiteAnalyticsPage() {
  // Fetch website metrics (most recent 12 weeks WITH DATA)
  const metrics = await prisma.websiteMetric.findMany({
    where: {
      totalUsers: { gt: 0 }
    },
    orderBy: { weekStarting: 'desc' },
    take: 12,
  })

  // Calculate totals and averages
  const totalUsers = metrics.reduce((sum, m) => sum + (m.totalUsers || 0), 0)
  const avgEngagementTime = metrics.length > 0 ? Math.round(
    metrics.reduce((sum, m) => sum + (m.avgEngagementTimeSec || 0), 0) / metrics.length
  ) : 0
  const latestWeek = metrics[0] || null

  // Format data for charts
  const chartData = metrics.reverse().map(m => ({
    week: m.weekStarting.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    users: m.totalUsers || 0,
    newUsers: m.newUsers || 0,
  }))

  const trafficData = latestWeek ? [
    { name: 'Organic Search', value: latestWeek.organicSearch || 0 },
    { name: 'Direct', value: latestWeek.direct || 0 },
    { name: 'Referral', value: latestWeek.referral || 0 },
    { name: 'Organic Social', value: latestWeek.organicSocial || 0 },
    { name: 'Email', value: latestWeek.email || 0 },
  ].filter(item => item.value > 0) : []

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users (Latest)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestWeek?.totalUsers?.toLocaleString() || 'No data'}</div>
            <p className="text-xs text-muted-foreground">
              {latestWeek?.percentChangeUsers ? (
                <span className={latestWeek.percentChangeUsers > 0 ? 'text-green-600' : 'text-red-600'}>
                  {latestWeek.percentChangeUsers > 0 ? '+' : ''}{(latestWeek.percentChangeUsers * 100).toFixed(1)}% from previous
                </span>
              ) : (
                'No change data'
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestWeek?.newUsers?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              {latestWeek?.percentChangeNewUsers ? (
                <span className={latestWeek.percentChangeNewUsers > 0 ? 'text-green-600' : 'text-red-600'}>
                  {latestWeek.percentChangeNewUsers > 0 ? '+' : ''}{(latestWeek.percentChangeNewUsers * 100).toFixed(1)}% from previous
                </span>
              ) : (
                'No change data'
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Engagement Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgEngagementTime}s</div>
            <p className="text-xs text-muted-foreground">
              Average across last 12 weeks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestWeek?.healthScore?.toFixed(1) || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">
              Latest week score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Trend</CardTitle>
          <CardDescription>
            Website visitors over the last 12 weeks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WebsiteTrendChart data={chartData} />
        </CardContent>
      </Card>

      {/* Traffic Sources Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Sources (Latest Week)</CardTitle>
          <CardDescription>
            Interactive breakdown of where your visitors are coming from
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TrafficSourceChart data={trafficData} />
        </CardContent>
      </Card>

      {/* Recent Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Metrics</CardTitle>
          <CardDescription>
            Last 12 weeks of website performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Week Starting</th>
                  <th className="text-right py-3 px-4">Total Users</th>
                  <th className="text-right py-3 px-4">New Users</th>
                  <th className="text-right py-3 px-4">Engagement (s)</th>
                  <th className="text-right py-3 px-4">Health Score</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric) => (
                  <tr key={metric.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{new Date(metric.weekStarting).toLocaleDateString()}</td>
                    <td className="text-right py-3 px-4">{metric.totalUsers?.toLocaleString()}</td>
                    <td className="text-right py-3 px-4">{metric.newUsers?.toLocaleString()}</td>
                    <td className="text-right py-3 px-4">{metric.avgEngagementTimeSec || '-'}</td>
                    <td className="text-right py-3 px-4">{metric.healthScore?.toFixed(1) || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TrafficSourceBar({ label, value, color }: { label: string; value: number; color: string }) {
  const maxValue = 1000 // Adjust based on your data
  const percentage = Math.min((value / maxValue) * 100, 100)

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{value.toLocaleString()}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
