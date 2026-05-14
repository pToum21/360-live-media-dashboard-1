import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, Eye, Heart } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { SocialGrowthChart } from "@/components/charts/social-growth-chart"

export default async function SocialMediaPage() {
  // Fetch social metrics (most recent 12 weeks WITH DATA)
  const metrics = await prisma.socialMetric.findMany({
    where: {
      OR: [
        { liImpressions: { not: null } },
        { igImpressions: { not: null } }
      ]
    },
    orderBy: { weekStarting: 'desc' },
    take: 12,
  })

  const latestWeek = metrics[0] || null

  // Calculate averages
  const avgLiEngagement = metrics.reduce((sum, m) => sum + (m.liEngagementRate || 0), 0) / metrics.length
  const avgIgEngagement = metrics.reduce((sum, m) => sum + (m.igEngagementRate || 0), 0) / metrics.length
  const totalLiImpressions = metrics.reduce((sum, m) => sum + (m.liImpressions || 0), 0)
  const totalIgImpressions = metrics.reduce((sum, m) => sum + (m.igImpressions || 0), 0)

  // Format data for chart
  const chartData = metrics.slice().reverse().map(m => ({
    week: m.weekStarting.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    linkedIn: m.liImpressions || 0,
    instagram: m.igImpressions || 0,
  }))

  return (
    <div className="space-y-6">
      {/* LinkedIn Metrics */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white text-sm font-bold">in</span>
          </div>
          LinkedIn
        </h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Followers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestWeek?.liFollowers?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">
                {latestWeek?.liFollowerGrowthRate ? (
                  <span className={latestWeek.liFollowerGrowthRate > 0 ? 'text-green-600' : 'text-red-600'}>
                    {latestWeek.liFollowerGrowthRate > 0 ? '+' : ''}{(latestWeek.liFollowerGrowthRate).toFixed(1)}% growth rate
                  </span>
                ) : (
                  'Current followers'
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Impressions</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestWeek?.liImpressions?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">
                {totalLiImpressions.toLocaleString()} total (12 weeks)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestWeek?.liEngagementRate ? (latestWeek.liEngagementRate * 100).toFixed(1) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                {(avgLiEngagement * 100).toFixed(1)}% avg over 12 weeks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posts Per Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestWeek?.liPostsPerWeek || 0}</div>
              <p className="text-xs text-muted-foreground">
                Latest week posting frequency
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Instagram Metrics */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded flex items-center justify-center">
            <span className="text-white text-sm font-bold">IG</span>
          </div>
          Instagram
        </h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Followers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestWeek?.igFollowers?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">
                Current followers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Impressions</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestWeek?.igImpressions?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">
                {totalIgImpressions.toLocaleString()} total (12 weeks)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestWeek?.igEngagementRate ? (latestWeek.igEngagementRate * 100).toFixed(1) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                {(avgIgEngagement * 100).toFixed(1)}% avg over 12 weeks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posts Per Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestWeek?.igPostsPerWeek || 0}</div>
              <p className="text-xs text-muted-foreground">
                Latest week posting frequency
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Social Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Growth Trend</CardTitle>
          <CardDescription>
            LinkedIn and Instagram impressions over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SocialGrowthChart data={chartData} />
        </CardContent>
      </Card>

      {/* Weekly Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Performance</CardTitle>
          <CardDescription>
            Last 12 weeks of social media metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Week Starting</th>
                  <th className="text-right py-3 px-4">LI Impressions</th>
                  <th className="text-right py-3 px-4">LI Engagement</th>
                  <th className="text-right py-3 px-4">LI Posts</th>
                  <th className="text-right py-3 px-4">IG Impressions</th>
                  <th className="text-right py-3 px-4">IG Engagement</th>
                  <th className="text-right py-3 px-4">IG Posts</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric) => (
                  <tr key={metric.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{new Date(metric.weekStarting).toLocaleDateString()}</td>
                    <td className="text-right py-3 px-4">{metric.liImpressions?.toLocaleString() || '-'}</td>
                    <td className="text-right py-3 px-4">
                      {metric.liEngagementRate ? (metric.liEngagementRate * 100).toFixed(1) + '%' : '-'}
                    </td>
                    <td className="text-right py-3 px-4">{metric.liPostsPerWeek || '-'}</td>
                    <td className="text-right py-3 px-4">{metric.igImpressions?.toLocaleString() || '-'}</td>
                    <td className="text-right py-3 px-4">
                      {metric.igEngagementRate ? (metric.igEngagementRate * 100).toFixed(1) + '%' : '-'}
                    </td>
                    <td className="text-right py-3 px-4">{metric.igPostsPerWeek || '-'}</td>
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
