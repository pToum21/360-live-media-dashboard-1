import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Mail,
  Users,
  TrendingUp,
  ArrowUpRight,
  Clock,
} from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold text-[#0C1C14] mb-2">
          Welcome back, {session?.user.name || session?.user.email}!
        </h2>
        <p className="text-gray-600">
          Here's what's happening with your marketing this week
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 hover:border-[#2E8741] transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Website Visitors</CardDescription>
              <div className="w-10 h-10 bg-[#2E8741]/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[#2E8741]" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-3xl font-bold text-[#0C1C14]">--</div>
                <p className="text-sm text-gray-500 mt-1">This week</p>
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                <TrendingUp className="w-3 h-3 mr-1" />
                --%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-[#2E8741] transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Email Open Rate</CardDescription>
              <div className="w-10 h-10 bg-[#2E8741]/10 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#2E8741]" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-3xl font-bold text-[#0C1C14]">--%</div>
                <p className="text-sm text-gray-500 mt-1">Last campaign</p>
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                <TrendingUp className="w-3 h-3 mr-1" />
                --%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-[#2E8741] transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Social Engagement</CardDescription>
              <div className="w-10 h-10 bg-[#2E8741]/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#2E8741]" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-3xl font-bold text-[#0C1C14]">--%</div>
                <p className="text-sm text-gray-500 mt-1">Average rate</p>
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                <TrendingUp className="w-3 h-3 mr-1" />
                --%
              </Badge>
            </div>
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
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                <div className="w-2 h-2 rounded-full bg-[#2E8741] mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    No data yet
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Import your Excel data to see recent activity
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-[#2E8741]" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-[#2E8741] hover:bg-[#2E8741]/5 transition-colors">
                <p className="text-sm font-medium text-gray-900">Add Social Post</p>
                <p className="text-xs text-gray-500 mt-1">Tag and track new content</p>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-[#2E8741] hover:bg-[#2E8741]/5 transition-colors">
                <p className="text-sm font-medium text-gray-900">View Reports</p>
                <p className="text-xs text-gray-500 mt-1">Weekly performance summary</p>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-[#2E8741] hover:bg-[#2E8741]/5 transition-colors">
                <p className="text-sm font-medium text-gray-900">Import Data</p>
                <p className="text-xs text-gray-500 mt-1">Load historical Excel data</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
