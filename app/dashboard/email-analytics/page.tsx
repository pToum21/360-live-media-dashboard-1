import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { EmailHeatmapChart } from "@/components/charts/email-heatmap-chart"
import { SendTimeHeatmap } from "@/components/charts/send-time-heatmap"
import { BenchmarkComparisonChart } from "@/components/charts/benchmark-comparison-chart"
import { EmailManagement } from "@/components/dashboard/email-management"
import { requireAuth } from "@/lib/auth-check"
import { getSelectedClientId } from "@/lib/get-selected-client"
import { Mail, MousePointerClick, Clock, Target } from "lucide-react"
import { Suspense } from 'react'

export default async function EmailAnalyticsPage() {
  await requireAuth()

  // Get selected client ID (works in both authenticated and share contexts)
  const clientId = await getSelectedClientId()

  const client = await prisma.client.findUnique({
    where: { id: clientId },
  })

  if (!client) {
    return <div>Client not found</div>
  }

  // Fetch emails with all enhancement data
  const emails = await prisma.emailCampaign.findMany({
    where: {
      clientId: client.id,
    },
    orderBy: { deploymentDate: 'desc' },
  })

  // Filter emails with heatmap data
  const emailsWithHeatmap = emails.filter(e => e.totalClicks && e.totalClicks > 0)

  // Filter emails with timing data
  const emailsWithTiming = emails.filter(e => e.deploymentDayOfWeek || e.deploymentTimeOfDay)

  // Filter emails with benchmark data
  const emailsWithBenchmark = emails.filter(e => 
    e.openRateBenchmark && e.clickRateBenchmark && e.deliveryRateBenchmark && e.unsubscribeRateBenchmark
  )

  // Calculate average benchmarks
  const avgOpenRate = emails.reduce((sum, e) => sum + e.openRate, 0) / emails.length
  const avgOpenRateBenchmark = emailsWithBenchmark.reduce((sum, e) => sum + (e.openRateBenchmark || 0), 0) / emailsWithBenchmark.length
  const avgClickRate = emails.reduce((sum, e) => sum + e.clickRate, 0) / emails.length
  const avgClickRateBenchmark = emailsWithBenchmark.reduce((sum, e) => sum + (e.clickRateBenchmark || 0), 0) / emailsWithBenchmark.length
  const avgDeliveryRate = emails.reduce((sum, e) => sum + e.deliveryRate, 0) / emails.length
  const avgDeliveryRateBenchmark = emailsWithBenchmark.reduce((sum, e) => sum + (e.deliveryRateBenchmark || 0), 0) / emailsWithBenchmark.length
  const avgUnsubscribeRate = emails.reduce((sum, e) => sum + e.unsubscribeRate, 0) / emails.length
  const avgUnsubscribeRateBenchmark = emailsWithBenchmark.reduce((sum, e) => sum + (e.unsubscribeRateBenchmark || 0), 0) / emailsWithBenchmark.length

  return (
    <div className="space-y-8 animate-in">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
          <Mail className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Email Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Deep insights into click patterns, send timing, and performance benchmarks
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Emails</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <Mail className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
              {emails.length}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Campaign messages sent
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">With Heatmap Data</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
              <MousePointerClick className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 dark:from-green-400 dark:to-green-500 bg-clip-text text-transparent">
              {emailsWithHeatmap.length}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Click tracking available
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">With Timing Data</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent">
              {emailsWithTiming.length}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Send time analysis
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">With Benchmarks</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
              <Target className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-400 dark:to-amber-500 bg-clip-text text-transparent">
              {emailsWithBenchmark.length}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Industry comparisons
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Email Click Heatmap */}
      {emailsWithHeatmap.length > 0 && (
        <Card className="chart-card border-0 overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50/10 dark:from-green-900/20 to-transparent border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <MousePointerClick className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Email Click Heatmap</CardTitle>
                <CardDescription className="dark:text-gray-400">Where recipients click in your emails</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <EmailHeatmapChart data={emailsWithHeatmap.map(e => ({
              name: e.name,
              totalClicks: e.totalClicks || 0,
              topButtonClicks: e.topButtonClicks || 0,
              topButtonClickPct: e.topButtonClickPct || 0,
              topLogoClicks: e.topLogoClicks || 0,
              topLogoClickPct: e.topLogoClickPct || 0,
              headerImageClicks: e.headerImageClicks || 0,
              headerImageClickPct: e.headerImageClickPct || 0,
              bodyContentClicks: e.bodyContentClicks || 0,
              bodyContentClickPct: e.bodyContentClickPct || 0,
              footerClicks: e.footerClicks || 0,
              footerClickPct: e.footerClickPct || 0,
            }))} />
          </CardContent>
        </Card>
      )}

      {/* Send Time Optimization */}
      {emailsWithTiming.length > 0 && (
        <Card className="chart-card border-0 overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50/10 dark:from-purple-900/20 to-transparent border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Send Time Optimization</CardTitle>
                <CardDescription className="dark:text-gray-400">Best days and times to send emails</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <SendTimeHeatmap data={emailsWithTiming.map(e => ({
              name: e.name,
              deploymentDayOfWeek: e.deploymentDayOfWeek,
              deploymentTimeOfDay: e.deploymentTimeOfDay,
              openRate: e.openRate,
              clickRate: e.clickRate,
              deliveryRate: e.deliveryRate,
            }))} />
          </CardContent>
        </Card>
      )}

      {/* Benchmark Comparison */}
      {emailsWithBenchmark.length > 0 && (
        <Card className="chart-card border-0 overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50/10 dark:from-blue-900/20 to-transparent border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Performance vs. Industry Benchmarks</CardTitle>
                <CardDescription className="dark:text-gray-400">How you compare to industry standards</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <BenchmarkComparisonChart 
              openRate={avgOpenRate}
              openRateBenchmark={avgOpenRateBenchmark}
              clickRate={avgClickRate}
              clickRateBenchmark={avgClickRateBenchmark}
              deliveryRate={avgDeliveryRate}
              deliveryRateBenchmark={avgDeliveryRateBenchmark}
              unsubscribeRate={avgUnsubscribeRate}
              unsubscribeRateBenchmark={avgUnsubscribeRateBenchmark}
            />
          </CardContent>
        </Card>
      )}

      {/* No Data Message */}
      {emails.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No email analytics data available yet. Import email campaigns to see insights.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Email Data Management */}
      <Card className="chart-card">
        <CardHeader>
          <CardTitle>Manage Email Campaign Data</CardTitle>
          <CardDescription>Add, edit, or remove email campaign data for {client.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <EmailManagement 
              campaigns={emails.map(e => ({
                ...e,
                deploymentDate: e.deploymentDate
              }))} 
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
