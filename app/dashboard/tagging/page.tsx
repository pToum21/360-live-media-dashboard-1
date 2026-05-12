import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tag, TrendingUp } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default async function ContentTaggingPage() {
  // Fetch tags and social posts
  const [audienceTags, contentTags, socialPosts] = await Promise.all([
    prisma.tag.findMany({
      where: { category: 'AUDIENCE' },
      orderBy: { name: 'asc' }
    }),
    prisma.tag.findMany({
      where: { category: 'CONTENT' },
      orderBy: { name: 'asc' }
    }),
    prisma.socialPost.findMany({
      where: {
        OR: [
          { impressions: { gt: 0 } },
          { engagements: { gt: 0 } }
        ]
      },
      orderBy: { weekStarting: 'desc' },
      take: 10,
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    })
  ])

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audience Tags</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{audienceTags.length}</div>
            <p className="text-xs text-muted-foreground">
              Target audience categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Tags</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentTags.length}</div>
            <p className="text-xs text-muted-foreground">
              Content type categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts Tracked</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{socialPosts.length}</div>
            <p className="text-xs text-muted-foreground">
              Social posts with metrics
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Available Tags */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Audience Tags</CardTitle>
            <CardDescription>
              Target audience segments for content categorization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {audienceTags.map((tag) => (
                <Badge key={tag.id} variant="secondary" className="text-sm">
                  {tag.name.replace('Audience_', '')}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Tags</CardTitle>
            <CardDescription>
              Content type categories for post classification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {contentTags.map((tag) => (
                <Badge key={tag.id} variant="secondary" className="text-sm">
                  {tag.name.replace('Content_', '')}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Social Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Social Posts</CardTitle>
          <CardDescription>
            Posts tracked from your social media channels
          </CardDescription>
        </CardHeader>
        <CardContent>
          {socialPosts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No social posts with metrics found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Week</th>
                    <th className="text-left py-3 px-4">Platform</th>
                    <th className="text-right py-3 px-4">Impressions</th>
                    <th className="text-right py-3 px-4">Engagements</th>
                    <th className="text-right py-3 px-4">Engagement Rate</th>
                    <th className="text-right py-3 px-4">Link Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {socialPosts.map((post) => (
                    <tr key={post.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {new Date(post.weekStarting).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{post.platform}</Badge>
                      </td>
                      <td className="text-right py-3 px-4">{post.impressions.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">{post.engagements.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">
                        <span className={post.engagementRate >= 0.1 ? 'text-green-600' : ''}>
                          {(post.engagementRate * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="text-right py-3 px-4">{post.linkClicks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tag Usage Info */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong className="text-gray-900">Audience Tags</strong> help you identify which audience segment a piece of content is targeting:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>Event Planners - Content aimed at event planning professionals</li>
              <li>Members - Content for existing members/subscribers</li>
              <li>Clients - Content showcasing client work or targeting potential clients</li>
            </ul>
            <p className="mt-4">
              <strong className="text-gray-900">Content Tags</strong> help you categorize the type of content:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>Thought Leadership - Industry insights and expert perspectives</li>
              <li>Team Highlight - Team member spotlights and culture content</li>
              <li>Blog Post - Links to blog articles</li>
              <li>Client Work - Case studies and client success stories</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
