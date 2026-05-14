import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, TrendingUp, MousePointerClick, Send } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { EmailPerformanceChart } from "@/components/charts/email-performance-chart"
import { EmailManagement } from "@/components/dashboard/email-management"

export default async function EmailCampaignsPage() {
  // Fetch email campaigns (most recent 12)
  const campaigns = await prisma.emailCampaign.findMany({
    orderBy: { deploymentDate: 'desc' },
    take: 12,
  })

  // Calculate averages
  const avgOpenRate = campaigns.reduce((sum, c) => sum + c.openRate, 0) / campaigns.length
  const avgClickRate = campaigns.reduce((sum, c) => sum + c.clickRate, 0) / campaigns.length
  const avgDeliveryRate = campaigns.reduce((sum, c) => sum + c.deliveryRate, 0) / campaigns.length

  // Format data for chart
  const chartData = campaigns.slice().reverse().map(c => ({
    name: c.name.replace('360 - ', '').replace(' Mission Brief', '').substring(0, 20),
    openRate: c.openRate,
    clickRate: c.clickRate,
  }))

  return (
    <div className="space-y-8 animate-in">
      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700">Campaigns Sent</CardTitle>
            <div className="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <Mail className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {campaigns.length}
            </div>
            <p className="text-xs text-gray-500 mt-2">Total campaigns tracked</p>
          </CardContent>
        </Card>

        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700">Avg. Open Rate</CardTitle>
            <div className="w-10 h-10 gradient-green rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              {(avgOpenRate * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 mt-2">Across all campaigns</p>
          </CardContent>
        </Card>

        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700">Avg. Click Rate</CardTitle>
            <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
              <MousePointerClick className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              {(avgClickRate * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 mt-2">Across all campaigns</p>
          </CardContent>
        </Card>

        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700">Avg. Delivery Rate</CardTitle>
            <div className="w-10 h-10 gradient-teal rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform">
              <Send className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
              {(avgDeliveryRate * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 mt-2">Successfully delivered</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="chart-card border-0 overflow-hidden shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center shadow-md">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Campaign Performance Comparison</CardTitle>
              <CardDescription>Interactive comparison of open and click rates across campaigns</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <EmailPerformanceChart data={chartData} />
        </CardContent>
      </Card>

      {/* Campaign Performance Table */}
      <Card className="stat-card border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-transparent border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-green rounded-xl flex items-center justify-center shadow-md">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Campaign Performance</CardTitle>
              <CardDescription>Recent email campaign metrics and engagement</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Campaign Name</th>
                  <th className="text-right py-3 px-4">Deployment Date</th>
                  <th className="text-right py-3 px-4">Open Rate</th>
                  <th className="text-right py-3 px-4">Click Rate</th>
                  <th className="text-right py-3 px-4">Delivery Rate</th>
                  <th className="text-right py-3 px-4">Unsub. Rate</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{campaign.name}</td>
                    <td className="text-right py-3 px-4">
                      {new Date(campaign.deploymentDate).toLocaleDateString()}
                    </td>
                    <td className="text-right py-3 px-4">
                      <span className={campaign.openRate >= 0.15 ? 'text-green-600' : ''}>
                        {(campaign.openRate * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="text-right py-3 px-4">
                      <span className={campaign.clickRate >= 0.025 ? 'text-green-600' : ''}>
                        {(campaign.clickRate * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="text-right py-3 px-4">
                      <span className={campaign.deliveryRate >= 0.99 ? 'text-green-600' : 'text-orange-600'}>
                        {(campaign.deliveryRate * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="text-right py-3 px-4">
                      <span className={campaign.unsubscribeRate <= 0.005 ? '' : 'text-red-600'}>
                        {(campaign.unsubscribeRate * 100).toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                    <div className="font-medium">{campaign.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(campaign.deploymentDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      {(campaign.openRate * 100).toFixed(1)}% open
                    </div>
                    <div className="text-sm text-muted-foreground">
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
