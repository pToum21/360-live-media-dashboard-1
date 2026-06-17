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
import { SixRsFramework } from "@/components/dashboard/six-rs-framework"
import { MultiYearRegistrationChart } from "@/components/charts/multi-year-registration-chart"
import { RegistrationActualsVsGoalChart } from "@/components/charts/registration-actuals-vs-goal-chart"
import { RevenueGaugeChart } from "@/components/charts/revenue-gauge-chart"
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
  const [
    latestWebsite, 
    latestEmail, 
    latestSocial, 
    totalClients, 
    totalTests,
    // Client-specific data availability checks
    hasEventRegistrations,
    latestEventRegistration,
    hasPassTypes,
    hasRevenueData,
    latestRevenue,
    hasAbstracts,
    latestAbstract,
    hasPaidMedia,
    hasGA4Registrations,
  ] = await Promise.all([
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
          { liImpressions: { not: null } },
          { igImpressions: { not: null } },
          { fbImpressions: { not: null } },
          { xImpressions: { not: null } }
        ]
      },
      orderBy: { weekStarting: 'desc' }
    }),
    prisma.client.count(),
    prisma.optimization.count({ where: { clientId: client.id } }),
    // Check what data types this client has
    prisma.eventRegistration.count({ where: { clientId: client.id } }).then(count => count > 0),
    prisma.eventRegistration.findFirst({ 
      where: { clientId: client.id },
      orderBy: { date: 'desc' }
    }),
    prisma.passType.count({ where: { clientId: client.id } }).then(count => count > 0),
    prisma.revenueProjection.count({ where: { clientId: client.id } }).then(count => count > 0),
    prisma.revenueProjection.findFirst({
      where: { clientId: client.id },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.abstractSubmission.count({ where: { clientId: client.id } }).then(count => count > 0),
    prisma.abstractSubmission.findFirst({
      where: { clientId: client.id },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.paidMedia.count({ where: { clientId: client.id } }).then(count => count > 0),
    prisma.gA4Registration.count({ where: { clientId: client.id } }).then(count => count > 0),
  ])

  // ATC-SPECIFIC: Fetch additional data for 6 Rs and charts
  let atcData = null
  if (client.slug === 'atc-2026') {
    const [allRegistrations, allRevenue, allPassTypes] = await Promise.all([
      prisma.eventRegistration.findMany({
        where: { clientId: client.id },
        orderBy: { date: 'asc' }
      }),
      prisma.revenueProjection.findMany({
        where: { clientId: client.id },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.passType.findMany({
        where: { clientId: client.id }
      })
    ])

    // Calculate paid/comp percentages per year from PassType data
    const passTypesByYear: Record<number, { paidPercent: number, compPercent: number }> = {}
    
    for (const year of [2023, 2024, 2026]) {
      const yearPassTypes = allPassTypes.filter(pt => pt.year === year)
      if (yearPassTypes.length > 0) {
        const totalPaid = yearPassTypes.filter(pt => pt.isPaid).reduce((sum, pt) => sum + pt.registrationCount, 0)
        const totalComp = yearPassTypes.filter(pt => !pt.isPaid).reduce((sum, pt) => sum + pt.registrationCount, 0)
        const total = totalPaid + totalComp
        
        passTypesByYear[year] = {
          paidPercent: total > 0 ? totalPaid / total : 0,
          compPercent: total > 0 ? totalComp / total : 0
        }
      }
    }
    
    // Use 2024 percentages for 2026 if not available
    if (!passTypesByYear[2026] && passTypesByYear[2024]) {
      passTypesByYear[2026] = passTypesByYear[2024]
    }

    // Group registrations by year
    const registrationsByYear: Record<number, any[]> = {}
    allRegistrations.forEach(reg => {
      const year = reg.date.getFullYear()
      if (!registrationsByYear[year]) registrationsByYear[year] = []
      registrationsByYear[year].push(reg)
    })

    // Calculate totals from real data
    const totalRegistrations = latestEventRegistration?.totalRegistrations || 0
    
    // Use actual percentages from PassType data for 2026
    const percentages2026 = passTypesByYear[2026] || { paidPercent: 0.83, compPercent: 0.17 }
    const compRegistrations = Math.round(totalRegistrations * percentages2026.compPercent)
    const paidRegistrations = Math.round(totalRegistrations * percentages2026.paidPercent)
    
    // Calculate actual revenue from database (sum all records with actualRevenue)
    const totalRevenue = allRevenue
      .filter(r => r.actualRevenue && r.actualRevenue > 0)
      .reduce((sum, r) => sum + (r.actualRevenue || 0), 0)
    
    // Get the most recent projected revenue record (first in descending order)
    const mostRecentProjected = allRevenue.find(r => r.projectedRevenue && r.projectedRevenue > 0)
    const targetRevenue = mostRecentProjected?.projectedRevenue || 0

    // Format multi-year chart data
    const maxWeeks = Math.max(
      registrationsByYear[2023]?.length || 0,
      registrationsByYear[2024]?.length || 0,
      registrationsByYear[2026]?.length || 0
    )

    const multiYearChartData = []
    for (let i = 0; i < maxWeeks; i++) {
      multiYearChartData.push({
        week: `Week ${i + 1}`,
        year2023: registrationsByYear[2023]?.[i]?.totalRegistrations,
        year2024: registrationsByYear[2024]?.[i]?.totalRegistrations,
        year2026: registrationsByYear[2026]?.[i]?.totalRegistrations
      })
    }

    atcData = {
      registrations: allRegistrations,
      totalRegistrations,
      compRegistrations,
      paidRegistrations,
      totalRevenue: totalRevenue || 0,
      targetRevenue: targetRevenue || 0,
      revenue: allRevenue,
      multiYearChartData,
      passTypePercentages: passTypesByYear // Pass percentages to components
    }
  }

  // Calculate average social engagement across all platforms
  // Only use stored engagement rates, don't try to calculate from other fields
  let avgSocialEngagement = 0
  if (latestSocial) {
    const rates = []
    
    // Only use pre-calculated engagement rates from the database
    if (latestSocial.liEngagementRate && latestSocial.liEngagementRate > 0) {
      rates.push(latestSocial.liEngagementRate)
    }
    if (latestSocial.igEngagementRate && latestSocial.igEngagementRate > 0) {
      rates.push(latestSocial.igEngagementRate)
    }
    // Note: FB and X don't have engagement rate fields in the schema
    // If they did, we'd check them here too
    
    // Average all available rates
    if (rates.length > 0) {
      avgSocialEngagement = rates.reduce((sum, rate) => sum + rate, 0) / rates.length
    }
  }

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
      {/* Client-Branded Header */}
      <div className="mb-6">
        <div className="glass-card p-6 rounded-2xl border-0 shadow-lg overflow-hidden relative">
          {/* Background gradient - client-specific */}
          <div className={`absolute inset-0 opacity-10 ${
            client.slug === 'atc-2026' 
              ? 'bg-gradient-to-br from-green-600 via-emerald-500 to-teal-600' 
              : 'bg-gradient-to-br from-blue-600 via-purple-500 to-pink-600'
          }`} />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              {client.logo && (
                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 flex items-center justify-center">
                  <img src={client.logo} alt={client.name} className="w-full h-full object-contain" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 tracking-tight">
                  {client.eventName || client.name} {client.year ? client.year : ''}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  360° Marketing Command Center
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome back, <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {session?.user.name || session?.user.email?.split('@')[0]}
                </span>
              </p>
              <div className="flex gap-2">
                {client.utmTracking && (
                  <Badge className="bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400 border-green-300 dark:border-green-800">
                    UTM Tracking
                  </Badge>
                )}
                {client.conversionTracking && (
                  <Badge className="bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-800">
                    Conversion Tracking
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ATC-SPECIFIC: Performance Summary Section - TOP OF PAGE */}
      {client.slug === 'atc-2026' && atcData && (
        <>
          {/* The 6 Rs Framework with Real Data */}
          <SixRsFramework 
            showImage={true}
            relevanceActual={latestWebsite?.totalUsers || 0}
            relevanceGoal={10000}
            retentionActual={atcData.compRegistrations}
            retentionGoal={1725}
            revenueActual={atcData.totalRevenue}
            revenueGoal={atcData.targetRevenue}
            reachActual={atcData.totalRegistrations}
            reachGoal={8000}
            reputationActual={undefined}
            reputationGoal={undefined}
            roiActual={undefined}
            roiGoal={undefined}
          />

          {/* Multi-Year Registration Chart & Revenue Gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MultiYearRegistrationChart 
                data={atcData.multiYearChartData}
                passTypePercentages={atcData.passTypePercentages}
              />
            </div>
            <div className="lg:col-span-1">
              <RevenueGaugeChart
                actual={atcData.totalRevenue}
                target={atcData.targetRevenue}
                title="Revenue Progress"
                subtitle="Year to Date"
              />
            </div>
          </div>

          {/* Actuals vs Goal & Key Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RegistrationActualsVsGoalChart
              compActual={atcData.compRegistrations}
              compGoal={1725}
              paidActual={atcData.paidRegistrations}
              paidGoal={675}
              year="2026"
            />
            
            {/* Key Performance Metrics Summary */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="glass-card border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Registrations</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {atcData.totalRegistrations.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-green-600 font-medium">On track</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Comp Registrations</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {atcData.compRegistrations.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 dark:text-gray-400">60% of total</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <Ticket className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Paid Registrations</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {atcData.paidRegistrations.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 dark:text-gray-400">40% of total</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Website Visitors</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {(latestWebsite?.totalUsers || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Latest week</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Action Links - Bottom of ATC Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="card-hover">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <UserCheck className="w-5 h-5 text-green-600" />
                  Registrations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/registrations">
                  <button className="w-full text-left p-3 rounded-xl border border-green-500/30 hover:border-green-500/50 hover:bg-green-500/10 transition-all">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">View Dashboard</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Daily trends & goals</p>
                  </button>
                </Link>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/revenue">
                  <button className="w-full text-left p-3 rounded-xl border border-green-500/30 hover:border-green-500/50 hover:bg-green-500/10 transition-all">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">View Dashboard</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Financial tracking</p>
                  </button>
                </Link>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Ticket className="w-5 h-5 text-green-600" />
                  Pass Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/pass-types">
                  <button className="w-full text-left p-3 rounded-xl border border-green-500/30 hover:border-green-500/50 hover:bg-green-500/10 transition-all">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">View Dashboard</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ticket breakdown</p>
                  </button>
                </Link>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Paid Media
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/paid-media">
                  <button className="w-full text-left p-3 rounded-xl border border-green-500/30 hover:border-green-500/50 hover:bg-green-500/10 transition-all">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">View Dashboard</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ad performance</p>
                  </button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </>
      )}

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
                    {avgSocialEngagement > 0 ? `${(avgSocialEngagement * 100).toFixed(1)}%` : 'N/A'}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {avgSocialEngagement > 0 ? 'Average rate' : 'No data'}
                  </p>
                </div>
                {avgSocialEngagement > 0 && (
                  <Badge className="bg-gray-500/10 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/20 dark:border-gray-500/30 border px-2 py-0.5 font-medium text-xs">
                    <Users className="w-3 h-3 mr-0.5" />
                    All Platforms
                  </Badge>
                )}
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
              eventRegistrations={latestEventRegistration?.totalRegistrations ?? undefined}
              eventRegistrationsTarget={client.eventName ? 8000 : undefined}
              revenueActual={latestRevenue?.actualRevenue ?? undefined}
              revenueTarget={latestRevenue?.projectedRevenue ?? undefined}
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
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
              {client.eventName 
                ? `Latest updates for ${client.eventName} ${client.year || ''}`
                : 'Latest updates across all channels'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Core Activities - Email, Website, Social */}
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
              
              {/* Client-Specific Activities */}
              {latestEventRegistration && (
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-green-50/60 dark:bg-green-900/10 backdrop-blur-sm border border-green-200/40 dark:border-green-700/20">
                  <UserCheck className="w-4 h-4 text-green-600 dark:text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {latestEventRegistration.totalRegistrations?.toLocaleString()} event registrations
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {new Date(latestEventRegistration.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              
              {latestAbstract && (
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-purple-50/60 dark:bg-purple-900/10 backdrop-blur-sm border border-purple-200/40 dark:border-purple-700/20">
                  <FlaskConical className="w-4 h-4 text-purple-600 dark:text-purple-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {latestAbstract.submissionCount?.toLocaleString()} abstract submissions
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Year: {latestAbstract.year}
                    </p>
                  </div>
                </div>
              )}
              
              {latestRevenue && (
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-900/10 backdrop-blur-sm border border-blue-200/40 dark:border-blue-700/20">
                  <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Revenue update: ${latestRevenue.actualRevenue?.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      vs ${latestRevenue.projectedRevenue?.toLocaleString() || 0} projected
                    </p>
                  </div>
                </div>
              )}
              
              {/* Generic Activities */}
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
              {/* Core Analytics - Always shown */}
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
              
              {/* Client-specific actions */}
              {hasEventRegistrations && (
                <Link href="/dashboard/registrations">
                  <button className="w-full text-left p-2.5 rounded-xl border border-green-500/40 dark:border-green-500/20 hover:border-green-500/60 dark:hover:border-green-500/30 hover:bg-green-500/10 dark:hover:bg-green-500/5 transition-all backdrop-blur-sm">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Event Registrations</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Track attendee sign-ups</p>
                  </button>
                </Link>
              )}
              
              {hasRevenueData && (
                <Link href="/dashboard/revenue">
                  <button className="w-full text-left p-2.5 rounded-xl border border-green-500/40 dark:border-green-500/20 hover:border-green-500/60 dark:hover:border-green-500/30 hover:bg-green-500/10 dark:hover:bg-green-500/5 transition-all backdrop-blur-sm">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Revenue Tracking</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Monitor financial performance</p>
                  </button>
                </Link>
              )}
              
              {hasPaidMedia && (
                <Link href="/dashboard/paid-media">
                  <button className="w-full text-left p-2.5 rounded-xl border border-blue-500/40 dark:border-blue-500/20 hover:border-blue-500/60 dark:hover:border-blue-500/30 hover:bg-blue-500/10 dark:hover:bg-blue-500/5 transition-all backdrop-blur-sm">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Paid Media</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Ad performance & spend</p>
                  </button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
