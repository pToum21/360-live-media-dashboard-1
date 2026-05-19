import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Mail,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock,
  Building2,
  FlaskConical,
} from "lucide-react"
import Link from "next/link"
import { WebsiteTrendChart } from "@/components/charts/website-trend-chart"
import { EmailPerformanceChart } from "@/components/charts/email-performance-chart"
import { TrafficSourceChart } from "@/components/charts/traffic-source-chart"
import { SocialGrowthChart } from "@/components/charts/social-growth-chart"
import { PerformanceInsights } from "@/components/dashboard/performance-insights"
import { GoalTracking } from "@/components/dashboard/goal-tracking"
import { TopPerformers } from "@/components/dashboard/top-performers"
import { GrowthTrends } from "@/components/dashboard/growth-trends"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  // Fetch latest metrics (with actual data)
  const [latestWebsite, latestEmail, latestSocial, totalClients, totalTests] = await Promise.all([
    prisma.websiteMetric.findFirst({
      where: { totalUsers: { gt: 0 } },
      orderBy: { weekStarting: 'desc' }
    }),
    prisma.emailCampaign.findFirst({ orderBy: { deploymentDate: 'desc' } }),
    prisma.socialMetric.findFirst({
      where: {
        OR: [
          { liEngagementRate: { not: null } },
          { igEngagementRate: { not: null } }
        ]
      },
      orderBy: { weekStarting: 'desc' }
    }),
    prisma.client.count(),
    prisma.optimization.count(),
  ])

  // Calculate average social engagement (LinkedIn + Instagram)
  const avgSocialEngagement = latestSocial
    ? ((latestSocial.liEngagementRate || 0) + (latestSocial.igEngagementRate || 0)) / 2
    : 0

  // Prepare chart data
  const websiteChartData = await prisma.websiteMetric.findMany({
    where: { totalUsers: { gt: 0 } },
    orderBy: { weekStarting: 'asc' },
    take: 12,
    select: {
      weekStarting: true,
      totalUsers: true,
      newUsers: true,
      organicSearch: true,
      direct: true,
      referral: true,
      organicSocial: true,
      email: true,
    }
  })

  const emailChartData = await prisma.emailCampaign.findMany({
    orderBy: { deploymentDate: 'desc' },
    take: 8,
    select: {
      id: true,
      name: true,
      openRate: true,
      clickRate: true,
      deploymentDate: true,
    }
  })

  const socialChartData = await prisma.socialMetric.findMany({
    where: {
      OR: [
        { liImpressions: { not: null } },
        { igImpressions: { not: null } }
      ]
    },
    orderBy: { weekStarting: 'asc' },
    take: 12,
    select: {
      id: true,
      weekStarting: true,
      liImpressions: true,
      igImpressions: true,
      liEngagementRate: true,
      igEngagementRate: true,
    }
  })

  // Format data for charts
  const formattedWebsiteData = websiteChartData.map(m => ({
    week: m.weekStarting.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    users: m.totalUsers || 0,
    newUsers: m.newUsers || 0,
  }))

  const formattedEmailData = emailChartData.reverse().map(c => ({
    name: c.name.replace('360 - ', '').replace(' Mission Brief', ''),
    openRate: c.openRate,
    clickRate: c.clickRate,
  }))

  const formattedTrafficData = latestWebsite ? [
    { name: 'Organic Search', value: latestWebsite.organicSearch || 0 },
    { name: 'Direct', value: latestWebsite.direct || 0 },
    { name: 'Referral', value: latestWebsite.referral || 0 },
    { name: 'Social', value: latestWebsite.organicSocial || 0 },
    { name: 'Email', value: latestWebsite.email || 0 },
  ].filter(item => item.value > 0) : []

  const formattedSocialData = socialChartData.map(s => ({
    week: s.weekStarting.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    linkedIn: s.liImpressions || 0,
    instagram: s.igImpressions || 0,
  }))

  return (
    <div className="space-y-6 animate-in">
      {/* Welcome Section - Minimal */}
      <div className="relative">
        <div className="relative">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-1 tracking-tight">
            Welcome back, {session?.user.name || session?.user.email?.split('@')[0]}!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-normal">
            Here&apos;s what&apos;s happening with your marketing this week
          </p>
        </div>
      </div>

      {/* Stats Grid - Liquid Glass */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard/website" className="group">
          <Card className="stat-card cursor-pointer overflow-hidden relative">
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center justify-between">
                <CardDescription className="font-medium text-gray-600 dark:text-gray-400 text-sm">Website Visitors</CardDescription>
                <div className="w-10 h-10 bg-green-500/10 dark:bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/20 dark:group-hover:bg-green-500/30 transition-all">
                  <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
                    {latestWebsite?.totalUsers?.toLocaleString() || 0}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Latest week
                  </p>
                </div>
                {latestWebsite?.percentChangeUsers && (
                  <Badge
                    className={`${
                      latestWebsite.percentChangeUsers > 0
                        ? "bg-green-500/10 text-green-600 border-green-500/20"
                        : "bg-red-500/10 text-red-600 border-red-500/20"
                    } border px-2 py-0.5 font-medium text-xs`}
                  >
                    {latestWebsite.percentChangeUsers > 0 ? (
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-0.5" />
                    )}
                    {Math.abs(latestWebsite.percentChangeUsers * 100).toFixed(0)}%
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/email" className="group">
          <Card className="stat-card cursor-pointer overflow-hidden relative">
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center justify-between">
                <CardDescription className="font-medium text-gray-600 dark:text-gray-400 text-sm">Email Open Rate</CardDescription>
                <div className="w-10 h-10 bg-green-500/10 dark:bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/20 dark:group-hover:bg-green-500/30 transition-all">
                  <Mail className="w-5 h-5 text-green-600 dark:text-green-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
                    {latestEmail ? `${(latestEmail.openRate * 100).toFixed(1)}%` : '--'}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Last campaign
                  </p>
                </div>
                {latestEmail && (
                  <Badge
                    className={`${
                      latestEmail.openRate >= 0.15
                        ? "bg-green-500/10 text-green-600 border-green-500/20"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    } border px-2 py-0.5 font-medium text-xs`}
                  >
                    {latestEmail.openRate >= 0.15 ? (
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-0.5" />
                    )}
                    {latestEmail.openRate >= 0.15 ? "Good" : "Low"}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/social" className="group">
          <Card className="stat-card cursor-pointer overflow-hidden relative">
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center justify-between">
                <CardDescription className="font-medium text-gray-600 dark:text-gray-400 text-sm">Social Engagement</CardDescription>
                <div className="w-10 h-10 bg-green-500/10 dark:bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/20 dark:group-hover:bg-green-500/30 transition-all">
                  <Users className="w-5 h-5 text-green-600 dark:text-green-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
                    {(avgSocialEngagement * 100).toFixed(1)}%
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Average rate
                  </p>
                </div>
                <Badge className="bg-gray-500/10 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/20 dark:border-gray-500/30 border px-2 py-0.5 font-medium text-xs">
                  <Users className="w-3 h-3 mr-0.5" />
                  LI + IG
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/dashboard/clients">
          <Card className="transition-all duration-300 cursor-pointer card-hover">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Client Projects</CardTitle>
                <div className="w-9 h-9 bg-green-500/10 dark:bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-green-600 dark:text-green-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-700 dark:text-gray-200">{totalClients}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Active projects tracking</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/testing">
          <Card className="transition-all duration-300 cursor-pointer card-hover">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">A/B Tests Run</CardTitle>
                <div className="w-9 h-9 bg-green-500/10 dark:bg-green-500/20 rounded-xl flex items-center justify-center">
                  <FlaskConical className="w-4 h-4 text-green-600 dark:text-green-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-700 dark:text-gray-200">{totalTests}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Optimization experiments</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Interactive Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-2 chart-card overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-700 dark:text-gray-200">Website Traffic Trend</CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
              Total and new users over the last 12 weeks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WebsiteTrendChart data={formattedWebsiteData} />
          </CardContent>
        </Card>

        <Card className="chart-card overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-200">
              <Mail className="w-4 h-4 text-green-600 dark:text-green-500" />
              Email Campaign Performance
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
              Open and click rates for recent campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmailPerformanceChart data={formattedEmailData} />
          </CardContent>
        </Card>

        <Card className="chart-card overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-200">
              <BarChart3 className="w-4 h-4 text-green-600 dark:text-green-500" />
              Traffic Sources
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
              Where your visitors are coming from (latest week)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrafficSourceChart data={formattedTrafficData} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2 chart-card overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-200">
              <Users className="w-4 h-4 text-green-600 dark:text-green-500" />
              Social Media Growth
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
              LinkedIn and Instagram impressions over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SocialGrowthChart data={formattedSocialData} />
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights & Goal Tracking - Only show if we have real data */}
      {(latestWebsite || latestEmail || latestSocial) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceInsights 
            websiteData={latestWebsite ? {
              totalUsers: latestWebsite.totalUsers || 0,
              newUsers: latestWebsite.newUsers || 0,
              avgEngagementTimeSec: latestWebsite.avgEngagementTimeSec || 0,
              healthScore: latestWebsite.healthScore || 0
            } : undefined}
            emailData={latestEmail ? {
              openRate: latestEmail.openRate,
              clickRate: latestEmail.clickRate,
              deliveryRate: latestEmail.deliveryRate
            } : undefined}
            socialData={latestSocial ? {
              liEngagementRate: latestSocial.liEngagementRate,
              igEngagementRate: latestSocial.igEngagementRate,
              liImpressions: latestSocial.liImpressions,
              igImpressions: latestSocial.igImpressions
            } : undefined}
          />
          {(latestWebsite?.totalUsers || latestEmail?.openRate || latestSocial?.liEngagementRate || latestSocial?.igEngagementRate) && (
            <GoalTracking 
              websiteVisitors={latestWebsite?.totalUsers}
              emailOpenRate={latestEmail?.openRate}
              socialEngagement={latestSocial?.liEngagementRate || latestSocial?.igEngagementRate || undefined}
              newLeads={latestWebsite?.newUsers ? Math.floor(latestWebsite.newUsers * 0.15) : undefined}
            />
          )}
        </div>
      )}

      {/* Top Performers & Growth Trends - Only show if we have real data */}
      {(emailChartData.length > 0 || socialChartData.length > 0 || websiteChartData.length > 1) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(emailChartData.length > 0 || socialChartData.length > 0) && (
            <TopPerformers 
              emailCampaigns={emailChartData}
              socialPosts={socialChartData.filter(s => (s.liImpressions || s.igImpressions) && (s.liEngagementRate || s.igEngagementRate)).map(s => ({
                id: s.id,
                platform: s.liImpressions && s.liImpressions > (s.igImpressions || 0) ? 'LinkedIn' : 'Instagram',
                impressions: Math.max(s.liImpressions || 0, s.igImpressions || 0),
                engagements: Math.floor((Math.max(s.liImpressions || 0, s.igImpressions || 0)) * Math.max(s.liEngagementRate || 0, s.igEngagementRate || 0)),
                engagementRate: Math.max(s.liEngagementRate || 0, s.igEngagementRate || 0),
                weekStarting: s.weekStarting
              }))}
            />
          )}
          {(websiteChartData.length > 1 || emailChartData.length > 1 || socialChartData.length > 1) && (
            <GrowthTrends 
              websiteMetrics={websiteChartData}
              emailCampaigns={emailChartData}
              socialMetrics={socialChartData}
            />
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-200">
              <Clock className="w-4 h-4 text-green-600 dark:text-green-500" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">Latest updates across all channels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {latestEmail && (
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-white/40 dark:border-white/10">
                  <Mail className="w-4 h-4 text-green-600 dark:text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {latestEmail.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {new Date(latestEmail.deploymentDate).toLocaleDateString()} • 
                      {(latestEmail.openRate * 100).toFixed(1)}% open rate
                    </p>
                  </div>
                </div>
              )}
              {latestWebsite && (
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-white/40 dark:border-white/10">
                  <BarChart3 className="w-4 h-4 text-green-600 dark:text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {latestWebsite.totalUsers?.toLocaleString()} website visitors
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Week of {new Date(latestWebsite.weekStarting).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              {latestSocial && (
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-white/40 dark:border-white/10">
                  <Users className="w-4 h-4 text-green-600 dark:text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Social media update
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      LI: {latestSocial.liFollowers?.toLocaleString()} followers • 
                      IG: {latestSocial.igFollowers?.toLocaleString()} followers
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-200">
              <ArrowUpRight className="w-4 h-4 text-green-600 dark:text-green-500" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">Navigate to key sections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/dashboard/website">
                <button className="w-full text-left p-2.5 rounded-xl border border-white/40 dark:border-white/20 hover:border-white/60 dark:hover:border-white/30 hover:bg-white/30 dark:hover:bg-white/5 transition-all backdrop-blur-sm">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Website Analytics</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">View traffic and engagement</p>
                </button>
              </Link>
              <Link href="/dashboard/email">
                <button className="w-full text-left p-2.5 rounded-xl border border-white/40 dark:border-white/20 hover:border-white/60 dark:hover:border-white/30 hover:bg-white/30 dark:hover:bg-white/5 transition-all backdrop-blur-sm">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Campaigns</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Review campaign performance</p>
                </button>
              </Link>
              <Link href="/dashboard/social">
                <button className="w-full text-left p-2.5 rounded-xl border border-white/40 dark:border-white/20 hover:border-white/60 dark:hover:border-white/30 hover:bg-white/30 dark:hover:bg-white/5 transition-all backdrop-blur-sm">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Social Media</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Check LinkedIn & Instagram</p>
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
