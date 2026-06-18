import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, TrendingUp, MousePointerClick, Calendar, BarChart3, Users } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { SalesMarketingManagement } from "@/components/dashboard/sales-marketing-management"
import { SalesMarketingChart } from "@/components/charts/sales-marketing-chart"
import { getSelectedClientId } from "@/lib/get-selected-client"

export default async function SalesMarketingPage() {
  // Get the selected client ID
  const clientId = await getSelectedClientId()
  
  // Fetch sales marketing campaigns for the selected client
  const campaigns = await prisma.salesMarketing.findMany({
    where: { clientId },
    orderBy: { weekOf: 'desc' },
  })

  // Use recent campaigns for calculations (top 50 or all if less)
  const recentCampaigns = campaigns.slice(0, 50)
  
  // Calculate averages based on recent campaigns (only campaigns with data)
  const campaignsWithOpenRate = recentCampaigns.filter(c => c.openRate !== null)
  const campaignsWithClickRate = recentCampaigns.filter(c => c.clickRate !== null)
  const campaignsWithMicrositeVisits = recentCampaigns.filter(c => c.micrositeVisits !== null && c.micrositeVisits > 0)
  
  const avgOpenRate = campaignsWithOpenRate.length > 0 
    ? campaignsWithOpenRate.reduce((sum, c) => sum + (c.openRate || 0), 0) / campaignsWithOpenRate.length 
    : 0
  const avgClickRate = campaignsWithClickRate.length > 0
    ? campaignsWithClickRate.reduce((sum, c) => sum + (c.clickRate || 0), 0) / campaignsWithClickRate.length
    : 0
  const totalMicrositeVisits = recentCampaigns.reduce((sum, c) => sum + (c.micrositeVisits || 0), 0)
  const avgMicrositeVisits = campaignsWithMicrositeVisits.length > 0
    ? campaignsWithMicrositeVisits.reduce((sum, c) => sum + (c.micrositeVisits || 0), 0) / campaignsWithMicrositeVisits.length
    : 0

  // Count total sent campaigns (campaigns with a 'sent' date)
  const totalSent = recentCampaigns.filter(c => c.sent).length
  
  // Get top 5 campaigns by open rate
  const topCampaigns = recentCampaigns
    .filter(c => c.openRate !== null)
    .sort((a, b) => (b.openRate || 0) - (a.openRate || 0))
    .slice(0, 5)
    .map(c => ({
      subject: c.subjectMessage || c.audience || 'Untitled Campaign',
      openRate: c.openRate || 0,
      clickRate: c.clickRate || 0,
    }))

  // Format data for chart (use recent campaigns)
  const chartData = recentCampaigns.map(c => ({
    weekOf: c.weekOf,
    openRate: c.openRate || 0,
    clickRate: c.clickRate || 0,
    micrositeVisits: c.micrositeVisits || 0,
    audience: c.audience || 'Unknown',
    subjectMessage: c.subjectMessage || '',
  }))

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Sales Marketing</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Promotional campaigns and performance tracking
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Avg. Open Rate</CardTitle>
            <div className="w-10 h-10 gradient-green rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {(avgOpenRate * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Across {campaignsWithOpenRate.length} campaigns
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Avg. Click Rate</CardTitle>
            <div className="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <MousePointerClick className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {(avgClickRate * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Across {campaignsWithClickRate.length} campaigns
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Microsite Visits</CardTitle>
            <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {totalMicrositeVisits.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Avg: {Math.round(avgMicrositeVisits)} per campaign
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Campaigns Sent</CardTitle>
            <div className="w-10 h-10 gradient-orange rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
              <Mail className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {totalSent}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Out of {recentCampaigns.length} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Performance Over Time Chart */}
        <Card className="glass-card border-0 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Performance Over Time
            </CardTitle>
            <CardDescription>Open rate and click rate trends by week</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesMarketingChart data={chartData} type="performance" />
          </CardContent>
        </Card>

        {/* Top Campaigns */}
        <Card className="glass-card border-0 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
              Top Performing Campaigns
            </CardTitle>
            <CardDescription>Highest open rates in recent campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCampaigns.length > 0 ? (
                topCampaigns.map((campaign, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {campaign.subject}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span>Open: {(campaign.openRate * 100).toFixed(1)}%</span>
                        <span>•</span>
                        <span>Click: {(campaign.clickRate * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No campaigns with data yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Microsite Visits Chart */}
      <Card className="glass-card border-0 overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Users className="h-5 w-5 text-emerald-600" />
            Microsite Visits Over Time
          </CardTitle>
          <CardDescription>Weekly microsite traffic from campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <SalesMarketingChart data={chartData} type="visits" />
        </CardContent>
      </Card>

      {/* Management Table */}
      <Card className="glass-card border-0 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Campaign Management</CardTitle>
          <CardDescription>View, create, edit, and delete sales marketing campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <SalesMarketingManagement campaigns={campaigns} />
        </CardContent>
      </Card>
    </div>
  )
}
