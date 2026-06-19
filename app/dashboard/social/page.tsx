import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, Eye, Heart } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { FilterableSocialChart } from "@/components/charts/filterable-social-chart"
import { FollowersByChannelChart } from "@/components/charts/followers-by-channel-chart"
import { OrganicSocialImpressionsChart } from "@/components/charts/organic-social-impressions-chart"
import { EngagementsByChannelChart } from "@/components/charts/engagements-by-channel-chart"
import { PostFrequencyByChannelChart } from "@/components/charts/post-frequency-by-channel-chart"
import { SocialManagement } from "@/components/dashboard/social-management"
import { requireAuth } from "@/lib/auth-check"
import { getSelectedClientId } from "@/lib/get-selected-client"

export default async function SocialMediaPage() {
  await requireAuth()

  // Get selected client ID (works in both authenticated and share contexts)
  const clientId = await getSelectedClientId()

  const client = await prisma.client.findUnique({
    where: { id: clientId },
  })

  if (!client) {
    return <div>Client not found</div>
  }

  // Fetch social metrics FILTERED BY CLIENT - include ALL platforms
  const metrics = await prisma.socialMetric.findMany({
    where: {
      clientId: client.id,
      OR: [
        { liImpressions: { not: null } },
        { igImpressions: { not: null } },
        { fbImpressions: { not: null } },
        { xImpressions: { not: null } }
      ]
    },
    orderBy: { weekStarting: 'desc' },
    take: 12,
  })

  // For display cards, get the latest week with actual follower data (not null and not 0)
  const latestWeekWithFollowers = await prisma.socialMetric.findFirst({
    where: {
      clientId: client.id,
      liFollowers: { gt: 0 }
    },
    orderBy: { weekStarting: 'desc' }
  })

  const latestWeek = latestWeekWithFollowers || metrics[0] || null

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
    <div className="space-y-8 animate-in">
      {/* LinkedIn Metrics */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/40">
            <span className="text-white font-bold">in</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">LinkedIn</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="stat-card border-0 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Followers</CardTitle>
              <div className="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                {latestWeek?.liFollowers?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {latestWeek?.liFollowerGrowthRate ? (
                  <span className={latestWeek.liFollowerGrowthRate > 0 ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
                    {latestWeek.liFollowerGrowthRate > 0 ? '+' : ''}{(latestWeek.liFollowerGrowthRate).toFixed(1)}% growth rate
                  </span>
                ) : (
                  'Current followers'
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card border-0 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Impressions</CardTitle>
              <div className="w-10 h-10 gradient-green rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                <Eye className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
                {latestWeek?.liImpressions?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {totalLiImpressions.toLocaleString()} total (12 weeks)
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card border-0 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Engagement Rate</CardTitle>
              <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                <Heart className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
                {latestWeek?.liEngagementRate ? (latestWeek.liEngagementRate * 100).toFixed(1) : 0}%
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {(avgLiEngagement * 100).toFixed(1)}% avg over 12 weeks
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card border-0 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Posts Per Week</CardTitle>
              <div className="w-10 h-10 gradient-orange rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 dark:from-orange-400 dark:to-orange-600 bg-clip-text text-transparent">
                {latestWeek?.liPostsPerWeek || 0}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Latest week posting frequency
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Instagram Metrics */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/40">
            <span className="text-white font-bold">IG</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Instagram</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="stat-card border-0 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Followers</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                {latestWeek?.igFollowers?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Current followers
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card border-0 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-400/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Impressions</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform">
                <Eye className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 dark:from-pink-400 dark:to-orange-400 bg-clip-text text-transparent">
                {latestWeek?.igImpressions?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">
                {totalIgImpressions.toLocaleString()} total (12 weeks)
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card border-0 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Engagement Rate</CardTitle>
              <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                <Heart className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
                {latestWeek?.igEngagementRate ? (latestWeek.igEngagementRate * 100).toFixed(1) : 0}%
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {(avgIgEngagement * 100).toFixed(1)}% avg over 12 weeks
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card border-0 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Posts Per Week</CardTitle>
              <div className="w-10 h-10 gradient-orange rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 dark:from-orange-400 dark:to-orange-600 bg-clip-text text-transparent">
                {latestWeek?.igPostsPerWeek || 0}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Latest week posting frequency
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Social Media Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Followers By Channel Chart */}
        <Card className="chart-card border-0 overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50/10 dark:from-blue-900/20 to-transparent border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Social Media: Followers By Channel</CardTitle>
            <CardDescription className="dark:text-gray-400">Weekly follower counts across all platforms</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <FollowersByChannelChart data={metrics.slice(0, 12).reverse()} />
          </CardContent>
        </Card>

        {/* Organic Social Impressions Chart */}
        <Card className="chart-card border-0 overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50/10 dark:from-purple-900/20 to-transparent border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Organic Social Impressions</CardTitle>
            <CardDescription className="dark:text-gray-400">Weekly impressions across all platforms</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <OrganicSocialImpressionsChart data={metrics.slice(0, 12).reverse()} />
          </CardContent>
        </Card>
      </div>

      {/* Second Row of Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Engagements By Channel Chart */}
        <Card className="chart-card border-0 overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50/10 dark:from-green-900/20 to-transparent border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Social Media: Engagements By Channel</CardTitle>
            <CardDescription className="dark:text-gray-400">Weekly engagements across all platforms</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <EngagementsByChannelChart data={metrics.slice(0, 12).reverse()} />
          </CardContent>
        </Card>

        {/* Post Frequency By Channel Chart */}
        <Card className="chart-card border-0 overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50/10 dark:from-orange-900/20 to-transparent border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Social Media: Post Frequency By Channel</CardTitle>
            <CardDescription className="dark:text-gray-400">Weekly posting frequency across all platforms</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <PostFrequencyByChannelChart data={metrics.slice(0, 12).reverse()} />
          </CardContent>
        </Card>
      </div>

      {/* Facebook Metrics */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/40">
            <span className="text-white font-bold">f</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Facebook</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="stat-card border-0 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Followers</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                {latestWeek?.fbFollowers?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {latestWeek?.fbFollowerGrowthRate ? (
                  <span className={latestWeek.fbFollowerGrowthRate > 0 ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
                    {latestWeek.fbFollowerGrowthRate > 0 ? '+' : ''}{(latestWeek.fbFollowerGrowthRate * 100).toFixed(1)}% growth rate
                  </span>
                ) : (
                  'Current followers'
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card border-0 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Impressions</CardTitle>
              <div className="w-10 h-10 gradient-green rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                <Eye className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
                {latestWeek?.fbImpressions?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Latest week impressions
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card border-0 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Engagements</CardTitle>
              <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                <Heart className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
                {latestWeek?.fbEngagements?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Latest week engagements
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card border-0 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Posts Per Week</CardTitle>
              <div className="w-10 h-10 gradient-orange rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 dark:from-orange-400 dark:to-orange-600 bg-clip-text text-transparent">
                {latestWeek?.fbPostsPerWeek || 0}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Latest week posting frequency
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* X (Twitter) Metrics */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gray-900 dark:bg-gray-100 rounded-xl flex items-center justify-center shadow-lg shadow-gray-900/40">
            <span className="text-white dark:text-gray-900 font-bold">𝕏</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">X (Twitter)</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="stat-card border-0 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-400/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Followers</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-200 dark:to-gray-300 rounded-xl flex items-center justify-center shadow-lg shadow-gray-500/30 group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5 text-white dark:text-gray-900" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                {latestWeek?.xFollowers?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {latestWeek?.xFollowerGrowthRate ? (
                  <span className={latestWeek.xFollowerGrowthRate > 0 ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
                    {latestWeek.xFollowerGrowthRate > 0 ? '+' : ''}{(latestWeek.xFollowerGrowthRate * 100).toFixed(1)}% growth rate
                  </span>
                ) : (
                  'Current followers'
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card border-0 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Impressions</CardTitle>
              <div className="w-10 h-10 gradient-green rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                <Eye className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
                {latestWeek?.xImpressions?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Latest week impressions
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card border-0 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Engagements</CardTitle>
              <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                <Heart className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
                {latestWeek?.xEngagements?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Latest week engagements
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card border-0 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Posts Per Week</CardTitle>
              <div className="w-10 h-10 gradient-orange rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 dark:from-orange-400 dark:to-orange-600 bg-clip-text text-transparent">
                {latestWeek?.xPostsPerWeek || 0}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Latest week posting frequency
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filterable Social Growth Chart */}
      <Card className="chart-card border-0 overflow-hidden shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50/10 dark:from-purple-900/20 to-transparent border-b border-gray-200 dark:border-gray-700">
          <div>
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Social Media Performance Analysis</CardTitle>
            <CardDescription className="dark:text-gray-400">Filter by platform, metrics, and time range to explore social media growth</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <FilterableSocialChart data={metrics} />
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
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Week Starting</th>
                  <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">LI Impressions</th>
                  <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">LI Engagement</th>
                  <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">LI Posts</th>
                  <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">IG Impressions</th>
                  <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">IG Engagement</th>
                  <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">IG Posts</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric) => (
                  <tr key={metric.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{new Date(metric.weekStarting).toLocaleDateString()}</td>
                    <td className="text-right py-3 px-4 text-gray-900 dark:text-gray-100">{metric.liImpressions?.toLocaleString() || '-'}</td>
                    <td className="text-right py-3 px-4 text-gray-900 dark:text-gray-100">
                      {metric.liEngagementRate ? (metric.liEngagementRate * 100).toFixed(1) + '%' : '-'}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-900 dark:text-gray-100">{metric.liPostsPerWeek || '-'}</td>
                    <td className="text-right py-3 px-4 text-gray-900 dark:text-gray-100">{metric.igImpressions?.toLocaleString() || '-'}</td>
                    <td className="text-right py-3 px-4 text-gray-900 dark:text-gray-100">
                      {metric.igEngagementRate ? (metric.igEngagementRate * 100).toFixed(1) + '%' : '-'}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-900 dark:text-gray-100">{metric.igPostsPerWeek || '-'}</td>
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
          <CardTitle>Manage Social Media Data</CardTitle>
          <CardDescription>Add, edit, or remove social media metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <SocialManagement metrics={metrics} />
        </CardContent>
      </Card>
    </div>
  )
}
