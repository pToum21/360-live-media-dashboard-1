import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, Clock } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { WebsiteTrendChart } from "@/components/charts/website-trend-chart"
import { TrafficSourceChart } from "@/components/charts/traffic-source-chart"
import { WebsiteManagement } from "@/components/dashboard/website-management"

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
    <div className="space-y-8 animate-in">
      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700">Total Users</CardTitle>
            <div className="w-10 h-10 gradient-green rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              {latestWeek?.totalUsers?.toLocaleString() || 'No data'}
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              {latestWeek?.percentChangeUsers ? (
                <span className={latestWeek.percentChangeUsers > 0 ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
                  {latestWeek.percentChangeUsers > 0 ? '+' : ''}{(latestWeek.percentChangeUsers * 100).toFixed(1)}% from previous
                </span>
              ) : (
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Latest week</span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700">New Users</CardTitle>
            <div className="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {latestWeek?.newUsers?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {latestWeek?.percentChangeNewUsers ? (
                <span className={latestWeek.percentChangeNewUsers > 0 ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
                  {latestWeek.percentChangeNewUsers > 0 ? '+' : ''}{(latestWeek.percentChangeNewUsers * 100).toFixed(1)}% from previous
                </span>
              ) : (
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Latest week</span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700">Avg. Engagement</CardTitle>
            <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              {avgEngagementTime}s
            </div>
            <p className="text-xs text-gray-500 mt-2">Average across last 12 weeks</p>
          </CardContent>
        </Card>

        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700">Health Score</CardTitle>
            <div className="w-10 h-10 gradient-orange rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
              {latestWeek?.healthScore?.toFixed(1) || 'N/A'}
            </div>
            <p className="text-xs text-gray-500 mt-2">Latest week score</p>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Trend Chart */}
      <Card className="chart-card border-0 overflow-hidden shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-transparent border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-green rounded-xl flex items-center justify-center shadow-md">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Traffic Trend</CardTitle>
              <CardDescription>Website visitors over the last 12 weeks</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <WebsiteTrendChart data={chartData} />
        </CardContent>
      </Card>

      {/* Traffic Sources Chart */}
      <Card className="chart-card border-0 overflow-hidden shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center shadow-md">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Traffic Sources (Latest Week)</CardTitle>
              <CardDescription>Interactive breakdown of where your visitors are coming from</CardDescription>
            </div>
          </div>
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

      {/* Data Management Section */}
      <Card className="chart-card">
        <CardHeader>
          <CardTitle>Manage Website Data</CardTitle>
          <CardDescription>Add, edit, or remove website analytics data</CardDescription>
        </CardHeader>
        <CardContent>
          <WebsiteManagement metrics={metrics} />
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
