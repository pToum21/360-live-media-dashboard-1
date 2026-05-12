import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"

export default function ClientProjectsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#2E8741]" />
            <CardTitle>Client Projects</CardTitle>
          </div>
          <CardDescription>
            Track analytics implementation status for client events and campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Data Yet
            </h3>
            <p className="text-sm text-gray-600 max-w-md mb-6">
              This page will help you track UTM tracking, conversion tracking, and analytics implementation status for all client projects.
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
