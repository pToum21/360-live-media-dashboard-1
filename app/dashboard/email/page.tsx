import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, TrendingUp, MousePointerClick, Send, Clock, Star, Calendar } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { FilterableEmailChart } from "@/components/charts/filterable-email-chart"
import { EmailManagement } from "@/components/dashboard/email-management"
import { OpenRateByTimeChart } from "@/components/charts/open-rate-by-time-chart"
import { OpenRateByDayChart } from "@/components/charts/open-rate-by-day-chart"
import { EmailTypeFilter } from "@/components/dashboard/email-type-filter"
import { CampaignPerformanceTable } from "@/components/tables/campaign-performance-table"
import { getSelectedClientId } from "@/lib/get-selected-client"

export default async function EmailCampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  // Get the selected client ID
  const clientId = await getSelectedClientId()
  
  // Get filter type from URL params (await searchParams in Next.js 15)
  const params = await searchParams
  const filterType = params.type || 'all'
  
  // Build the where clause based on filter
  const whereClause: any = { clientId }
  if (filterType !== 'all') {
    whereClause.campaignType = filterType
  }
  
  // Fetch email campaigns for the selected client with filtering at DB level
  const campaigns = await prisma.emailCampaign.findMany({
    where: whereClause,
    orderBy: { deploymentDate: 'desc' },
    // No limit - fetch all matching campaigns so edits don't cause campaigns to "disappear"
  })

  // Use recent campaigns for calculations (top 50 or all if less)
  const recentCampaigns = campaigns.slice(0, 50)
  
  // Calculate averages based on recent campaigns
  const avgOpenRate = recentCampaigns.length > 0 
    ? recentCampaigns.reduce((sum, c) => sum + c.openRate, 0) / recentCampaigns.length 
    : 0
  const avgClickRate = recentCampaigns.length > 0
    ? recentCampaigns.reduce((sum, c) => sum + c.clickRate, 0) / recentCampaigns.length
    : 0
  const avgDeliveryRate = recentCampaigns.length > 0
    ? recentCampaigns.reduce((sum, c) => sum + c.deliveryRate, 0) / recentCampaigns.length
    : 0
  const avgUnsubscribeRate = recentCampaigns.length > 0
    ? recentCampaigns.reduce((sum, c) => sum + c.unsubscribeRate, 0) / recentCampaigns.length
    : 0
  const avgClickToOpenRate = avgOpenRate > 0 ? avgClickRate / avgOpenRate : 0
  
  // Get top 5 subject lines by open rate from recent campaigns
  const topSubjectLines = recentCampaigns
    .sort((a, b) => b.openRate - a.openRate)
    .slice(0, 5)
    .map(c => ({
      subject: c.subjectLine || c.name, // Use campaign name if no subject line
      openRate: c.openRate
    }))

  // Format data for filterable chart (use recent campaigns)
  const chartData = recentCampaigns.map(c => ({
    name: c.name,
    openRate: c.openRate,
    clickRate: c.clickRate,
    deliveryRate: c.deliveryRate,
    unsubscribeRate: c.unsubscribeRate,
    audience: c.audience,
    campaignType: c.campaignType,
    deploymentDate: c.deploymentDate,
  }))

  return (
    <div className="space-y-8 animate-in">
      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Email Campaigns</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filterType === 'all' 
              ? 'Overall performance metrics across all campaigns'
              : `Performance metrics for ${filterType}`
            }
          </p>
        </div>
        <EmailTypeFilter currentType={filterType} />
      </div>

      {/* Key Metrics - Overall Averages */}
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
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
              {(avgOpenRate * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Across all campaigns</p>
          </CardContent>
        </Card>

        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Avg. Click-Through Rate</CardTitle>
            <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
              <MousePointerClick className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
              {(avgClickRate * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Overall average</p>
          </CardContent>
        </Card>

        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Avg. Click-to-Open Rate</CardTitle>
            <div className="w-10 h-10 gradient-orange rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
              <MousePointerClick className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 dark:from-orange-400 dark:to-orange-600 bg-clip-text text-transparent">
              {(avgClickToOpenRate * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Overall average</p>
          </CardContent>
        </Card>

        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Avg. Unsubscribe Rate</CardTitle>
            <div className="w-10 h-10 gradient-red rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
              <Send className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 dark:from-red-400 dark:to-red-600 bg-clip-text text-transparent">
              {(avgUnsubscribeRate * 100).toFixed(2)}%
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Overall unsubscribe</p>
          </CardContent>
        </Card>
      </div>

      {/* Send Time Optimization */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="chart-card border-0 overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50/10 dark:from-purple-900/20 to-transparent border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center shadow-md">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Open Rate by Time of Day</CardTitle>
                <CardDescription className="dark:text-gray-400">Performance by hour</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <OpenRateByTimeChart 
              data={campaigns.map(c => ({
                hour: c.deploymentHour,
                openRate: c.openRate,
                timeOfDay: c.deploymentTimeOfDay
              }))}
            />
          </CardContent>
        </Card>

        <Card className="chart-card border-0 overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50/10 dark:from-purple-900/20 to-transparent border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center shadow-md">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Open Rate by Day of Week</CardTitle>
                <CardDescription className="dark:text-gray-400">Best days to send</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <OpenRateByDayChart 
              data={campaigns.map(c => ({
                deploymentDayOfWeek: c.deploymentDayOfWeek,
                openRate: c.openRate
              }))}
            />
          </CardContent>
        </Card>

        <Card className="chart-card border-0 overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50/10 dark:from-green-900/20 to-transparent border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-green rounded-xl flex items-center justify-center shadow-md">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">TOP 5 SUBJECT LINES</CardTitle>
                <CardDescription className="dark:text-gray-400">Based on highest open rate</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {topSubjectLines.length > 0 ? (
              <div className="space-y-4">
                {topSubjectLines.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-transparent dark:from-green-900/20 border border-green-100 dark:border-green-900/30 hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-1">
                        {item.subject}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Open Rate: <span className="font-bold text-green-600">{(item.openRate * 100).toFixed(1)}%</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No subject lines available</p>
                <p className="text-xs mt-2">Subject lines will appear here once campaigns are added</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filterable Performance Chart */}
      <Card className="chart-card border-0 overflow-hidden shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50/10 dark:from-blue-900/20 to-transparent border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center shadow-md">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Campaign Performance Analysis</CardTitle>
              <CardDescription className="dark:text-gray-400">Filter by audience, campaign type, and metrics to explore performance data</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <FilterableEmailChart data={chartData} />
        </CardContent>
      </Card>

      {/* Campaign Performance Table */}
      <Card className="stat-card border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50/10 dark:from-green-900/20 to-transparent border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-green rounded-xl flex items-center justify-center shadow-md">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Campaign Performance</CardTitle>
              <CardDescription className="dark:text-gray-400">Email campaign metrics and engagement data</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CampaignPerformanceTable campaigns={campaigns} />
        </CardContent>
      </Card>

      {/* Best Performing Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Campaigns</CardTitle>
          <CardDescription>
            Campaigns with highest engagement rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns
              .sort((a, b) => b.openRate - a.openRate)
              .slice(0, 5)
              .map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{campaign.name}</div>
                    <div className="text-sm text-muted-foreground dark:text-gray-400">
                      {new Date(campaign.deploymentDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600 dark:text-green-400">
                      {(campaign.openRate * 100).toFixed(1)}% open
                    </div>
                    <div className="text-sm text-muted-foreground dark:text-gray-400">
                      {(campaign.clickRate * 100).toFixed(1)}% click
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Management Section */}
      <Card className="chart-card">
        <CardHeader>
          <CardTitle>Manage Email Campaigns</CardTitle>
          <CardDescription>Add, edit, or remove email campaign data</CardDescription>
        </CardHeader>
        <CardContent>
          <EmailManagement campaigns={campaigns} />
        </CardContent>
      </Card>
    </div>
  )
}
