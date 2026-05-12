import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, TrendingUp, MousePointerClick, Send } from "lucide-react"
import { prisma } from "@/lib/prisma"

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

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campaigns Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
            <p className="text-xs text-muted-foreground">
              Total campaigns tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Open Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(avgOpenRate * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Click Rate</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(avgClickRate * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Delivery Rate</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(avgDeliveryRate * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Successfully delivered
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>
            Recent email campaign metrics and engagement
          </CardDescription>
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
    </div>
  )
}
