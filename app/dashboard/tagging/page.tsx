import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tag } from "lucide-react"

export default function ContentTaggingPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#2E8741]" />
            <CardTitle>Content Tagging</CardTitle>
          </div>
          <CardDescription>
            Organize and categorize social media content by audience and content type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Tag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Data Yet
            </h3>
            <p className="text-sm text-gray-600 max-w-md mb-6">
              This page will allow you to tag social posts with audience and content categories, helping you analyze which types of content perform best.
            </p>
            <p className="text-xs text-gray-500">
              Coming soon: Content tagging interface
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
