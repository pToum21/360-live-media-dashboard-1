import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function SocialMediaPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#2E8741]" />
            <CardTitle>Social Media</CardTitle>
          </div>
          <CardDescription>
            Track LinkedIn and Instagram performance including engagement rates and follower growth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Data Yet
            </h3>
            <p className="text-sm text-gray-600 max-w-md mb-6">
              This page will display social media metrics across LinkedIn and Instagram including impressions, engagement rates, and post performance once historical data is imported.
            </p>
            <p className="text-xs text-gray-500">
              Coming soon: Import historical data from Excel
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
