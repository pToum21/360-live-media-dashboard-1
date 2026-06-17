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
  DollarSign,
  Ticket,
  UserCheck,
} from "lucide-react"
import Link from "next/link"
import { FilterableWebsiteChart } from "@/components/charts/filterable-website-chart"
import { FilterableEmailChart } from "@/components/charts/filterable-email-chart"
import { FilterableSocialChart } from "@/components/charts/filterable-social-chart"
import { PerformanceInsights } from "@/components/dashboard/performance-insights"
import { GoalTracking } from "@/components/dashboard/goal-tracking"
import { TopPerformers } from "@/components/dashboard/top-performers"
import { GrowthTrends } from "@/components/dashboard/growth-trends"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
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

  // Fetch latest metrics FILTERED BY CLIENT
  const [latestWebsite, latestEmail, latestSocial, totalClients, totalTests] = await Promise.all([
    prisma.websiteMetric.findFirst({
      where: { 
        clientId: client.id,
        totalUsers: { gt: 0 } 
      },
      orderBy: { weekStarting: 'desc' }
    }),
    prisma.emailCampaign.findFirst({ 
      where: { clientId: client.id },
      orderBy: { deploymentDate: 'desc' } 
    }),
    prisma.socialMetric.findFirst({
      where: {
        clientId: client.id,
        OR: [
          { liEngagementRate: { not: null } },
          { igEngagementRate: { not: null } }
        ]
      },
      orderBy: { weekStarting: 'desc' }
    }),
    prisma.client.count(),
    prisma.optimization.count({ where: { clientId: client.id } }),
  ])

  // Calculate average social engagement (LinkedIn + Instagram)
  const avgSocialEngagement = latestSocial
    ? ((latestSocial.liEngagementRate || 0) + (latestSocial.igEngagementRate || 0)) / 2
    : 0

  // Prepare chart data FILTERED BY CLIENT
  const websiteChartData = await prisma.websiteMetric.findMany({
    where: { 
      clientId: client.id,
      totalUsers: { gt: 0 } 
    },
    orderBy: { weekStarting: 'asc' },
    take: 12,
  })

  const emailChartData = await prisma.emailCampaign.findMany({
    where: { clientId: client.id },
    orderBy: { deploymentDate: 'desc' },
    take: 12,
  })

  const socialChartData = await prisma.socialMetric.findMany({
    where: {
      clientId: client.id,
      OR: [
        { liImpressions: { not: null } },
        { igImpressions: { not: null } }
      ]
    },
    orderBy: { weekStarting: 'asc' },
    take: 12,
  })

  // Prepare email data for filterable chart
  const emailChartDataFormatted = emailChartData.map(c => ({
    name: c.name,
    openRate: c.openRate,
    clickRate: c.clickRate,
    deliveryRate: c.deliveryRate || 0,
    unsubscribeRate: c.unsubscribeRate || 0,
    audience: c.audience,
    campaignType: c.campaignType,
    deploymentDate: c.deploymentDate,
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

      {/* Interactive Filterable Charts */}
      <div className="grid gap-4">
        <Card className="chart-card border-0 overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50/10 dark:from-blue-900/20 to-transparent border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Website Analytics</CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
              Filter by metrics, view trends over time, or analyze traffic sources
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <FilterableWebsiteChart data={websiteChartData} />
          </CardContent>
        </Card>

        <Card className="chart-card border-0 overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50/10 dark:from-green-900/20 to-transparent border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              <Mail className="w-5 h-5 text-[#2E8741]" />
              Email Campaign Performance
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
              Filter campaigns by audience, type, and metrics for detailed analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <FilterableEmailChart data={emailChartDataFormatted} />
          </CardContent>
        </Card>

        <Card className="chart-card border-0 overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50/10 dark:from-purple-900/20 to-transparent border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              <Users className="w-5 h-5 text-purple-600" />
              Social Media Performance
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
              Filter by platform, metrics, and time range to explore social media growth
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <FilterableSocialChart data={socialChartData} />
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

      {/* CLIENT-SPECIFIC SECTIONS */}
      {client.slug === 'atc-2026' && (
        <>
          {/* ATC-SPECIFIC: Event Registrations & Revenue */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-green-600" />
                  Event Registrations
                </CardTitle>
                <CardDescription>Track daily registration progress</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/registrations">
                  <button className="w-full text-left p-4 rounded-xl border border-green-500/30 hover:border-green-500/50 hover:bg-green-500/10 transition-all">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">View Registration Dashboard</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">See daily trends, goals & pass types</p>
                  </button>
                </Link>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Revenue Tracking
                </CardTitle>
                <CardDescription>Projections vs actuals</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/revenue">
                  <button className="w-full text-left p-4 rounded-xl border border-green-500/30 hover:border-green-500/50 hover:bg-green-500/10 transition-all">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">View Revenue Dashboard</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Track financial performance</p>
                  </button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* ATC-SPECIFIC: Pass Types & Paid Media */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-green-600" />
                  Pass Types
                </CardTitle>
                <CardDescription>Registration breakdown by ticket</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/pass-types">
                  <button className="w-full text-left p-4 rounded-xl border border-green-500/30 hover:border-green-500/50 hover:bg-green-500/10 transition-all">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">View Pass Types</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Analyze ticket distribution</p>
                  </button>
                </Link>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Paid Media
                </CardTitle>
                <CardDescription>LinkedIn, Meta, Google ads</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/paid-media">
                  <button className="w-full text-left p-4 rounded-xl border border-green-500/30 hover:border-green-500/50 hover:bg-green-500/10 transition-all">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">View Paid Media</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Multi-platform ad performance</p>
                  </button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
