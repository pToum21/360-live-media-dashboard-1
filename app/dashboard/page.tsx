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
      name: true,
      openRate: true,
      clickRate: true,
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
      weekStarting: true,
      liImpressions: true,
      igImpressions: true,
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
    <div className="space-y-8 animate-in">
      {/* Welcome Section with gradient */}
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-8 right-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="relative">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#0C1C14] via-[#2E8741] to-[#0C1C14] bg-clip-text text-transparent mb-2">
            Welcome back, {session?.user.name || session?.user.email}!
          </h2>
          <p className="text-gray-600 text-lg">
            Here's what's happening with your marketing this week
          </p>
        </div>
      </div>

      {/* Stats Grid - Modern asymmetric layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/website" className="group">
          <Card className="stat-card cursor-pointer overflow-hidden relative border-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-center justify-between">
                <CardDescription className="font-semibold text-gray-700">Website Visitors</CardDescription>
                <div className="w-14 h-14 gradient-green rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/40 icon-float group-hover:scale-110 transition-transform duration-500">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                    {latestWebsite?.totalUsers?.toLocaleString() || 0}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Latest week
                  </p>
                </div>
                {latestWebsite?.percentChangeUsers && (
                  <Badge
                    className={`${
                      latestWebsite.percentChangeUsers > 0
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    } border px-3 py-1 font-semibold`}
                  >
                    {latestWebsite.percentChangeUsers > 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(latestWebsite.percentChangeUsers * 100).toFixed(0)}%
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/email" className="group">
          <Card className="stat-card cursor-pointer overflow-hidden relative border-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-center justify-between">
                <CardDescription className="font-semibold text-gray-700">Email Open Rate</CardDescription>
                <div className="w-14 h-14 gradient-blue rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/40 icon-float group-hover:scale-110 transition-transform duration-500">
                  <Mail className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    {latestEmail ? `${(latestEmail.openRate * 100).toFixed(1)}%` : '--'}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Last campaign
                  </p>
                </div>
                {latestEmail && (
                  <Badge
                    className={`${
                      latestEmail.openRate >= 0.15
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    } border px-3 py-1 font-semibold`}
                  >
                    {latestEmail.openRate >= 0.15 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {latestEmail.openRate >= 0.15 ? "Good" : "Below avg"}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/social" className="group">
          <Card className="stat-card cursor-pointer overflow-hidden relative border-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-center justify-between">
                <CardDescription className="font-semibold text-gray-700">Social Engagement</CardDescription>
                <div className="w-14 h-14 gradient-purple rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/40 icon-float group-hover:scale-110 transition-transform duration-500">
                  <Users className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                    {(avgSocialEngagement * 100).toFixed(1)}%
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Average rate
                  </p>
                </div>
                <Badge className="bg-violet-50 text-violet-700 border-violet-200 border px-3 py-1 font-semibold">
                  <Users className="w-3 h-3 mr-1" />
                  LI + IG
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/clients">
          <Card className="hover:bg-gray-50 transition-all duration-300 cursor-pointer card-hover border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Client Projects</CardTitle>
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md shadow-orange-500/30">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClients}</div>
              <p className="text-sm text-gray-500 mt-1">Active projects tracking</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/testing">
          <Card className="hover:bg-gray-50 transition-all duration-300 cursor-pointer card-hover border-2 border-teal-100 bg-gradient-to-br from-white to-teal-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">A/B Tests Run</CardTitle>
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md shadow-teal-500/30">
                  <FlaskConical className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTests}</div>
              <p className="text-sm text-gray-500 mt-1">Optimization experiments</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Interactive Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2 chart-card border-2 border-green-100 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-transparent">
            <CardTitle>Website Traffic Trend</CardTitle>
            <CardDescription>
              Total and new users over the last 12 weeks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WebsiteTrendChart data={formattedWebsiteData} />
          </CardContent>
        </Card>

        <Card className="chart-card border-2 border-blue-100 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent">
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Email Campaign Performance
            </CardTitle>
            <CardDescription>
              Open and click rates for recent campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmailPerformanceChart data={formattedEmailData} />
          </CardContent>
        </Card>

        <Card className="chart-card border-2 border-purple-100 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Traffic Sources
            </CardTitle>
            <CardDescription>
              Where your visitors are coming from (latest week)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrafficSourceChart data={formattedTrafficData} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2 chart-card border-2 border-pink-100 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-transparent">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-pink-600" />
              Social Media Growth
            </CardTitle>
            <CardDescription>
              LinkedIn and Instagram impressions over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SocialGrowthChart data={formattedSocialData} />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#2E8741]" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates across all channels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {latestEmail && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <Mail className="w-4 h-4 text-[#2E8741] mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {latestEmail.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(latestEmail.deploymentDate).toLocaleDateString()} • 
                      {(latestEmail.openRate * 100).toFixed(1)}% open rate
                    </p>
                  </div>
                </div>
              )}
              {latestWebsite && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <BarChart3 className="w-4 h-4 text-[#2E8741] mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {latestWebsite.totalUsers?.toLocaleString()} website visitors
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Week of {new Date(latestWebsite.weekStarting).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              {latestSocial && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <Users className="w-4 h-4 text-[#2E8741] mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Social media update
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      LI: {latestSocial.liFollowers?.toLocaleString()} followers • 
                      IG: {latestSocial.igFollowers?.toLocaleString()} followers
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-[#2E8741]" />
              Quick Actions
            </CardTitle>
            <CardDescription>Navigate to key sections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/dashboard/website">
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-[#2E8741] hover:bg-[#2E8741]/5 transition-colors">
                  <p className="text-sm font-medium text-gray-900">Website Analytics</p>
                  <p className="text-xs text-gray-500 mt-1">View traffic and engagement</p>
                </button>
              </Link>
              <Link href="/dashboard/email">
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-[#2E8741] hover:bg-[#2E8741]/5 transition-colors">
                  <p className="text-sm font-medium text-gray-900">Email Campaigns</p>
                  <p className="text-xs text-gray-500 mt-1">Review campaign performance</p>
                </button>
              </Link>
              <Link href="/dashboard/social">
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-[#2E8741] hover:bg-[#2E8741]/5 transition-colors">
                  <p className="text-sm font-medium text-gray-900">Social Media</p>
                  <p className="text-xs text-gray-500 mt-1">Check LinkedIn & Instagram</p>
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
