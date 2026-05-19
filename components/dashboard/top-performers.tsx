'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Trophy,
  Mail,
  Users,
  TrendingUp,
  Award,
  Star,
  Zap
} from "lucide-react"

interface TopPerformersProps {
  emailCampaigns?: Array<{
    id: string
    name: string
    openRate: number
    clickRate: number
    deploymentDate: Date
  }>
  socialPosts?: Array<{
    id: string
    platform: string
    impressions: number
    engagements: number
    engagementRate: number
    weekStarting: Date
  }>
}

export function TopPerformers({ emailCampaigns = [], socialPosts = [] }: TopPerformersProps) {
  // Get top 3 email campaigns by engagement (open rate + click rate)
  const topEmails = [...emailCampaigns]
    .sort((a, b) => (b.openRate + b.clickRate) - (a.openRate + a.clickRate))
    .slice(0, 3)

  // Get top 3 social posts by engagement rate
  const topSocial = [...socialPosts]
    .sort((a, b) => b.engagementRate - a.engagementRate)
    .slice(0, 3)

  return (
    <Card className="glass-card border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-yellow-50/10 dark:from-yellow-900/20 to-transparent border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-md">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Top Performers</CardTitle>
            <CardDescription className="dark:text-gray-400">Your best content and campaigns this period</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Top Email Campaigns */}
          {topEmails.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                  Top Email Campaigns
                </h4>
              </div>
              <div className="space-y-2">
                {topEmails.map((email, index) => (
                  <div
                    key={email.id}
                    className="group p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover-glass-shine transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                        ${index === 0 ? 'bg-yellow-100 dark:bg-yellow-950/50 text-yellow-600 dark:text-yellow-400' : ''}
                        ${index === 1 ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' : ''}
                        ${index === 2 ? 'bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400' : ''}
                      `}>
                        {index === 0 && <Trophy className="w-4 h-4" />}
                        {index === 1 && <Award className="w-4 h-4" />}
                        {index === 2 && <Star className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                          {email.name.replace('360 - ', '').replace(' Mission Brief', '')}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {new Date(email.deploymentDate).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Open:</span>
                            <span className="text-xs font-bold text-green-600 dark:text-green-400">
                              {(email.openRate * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Click:</span>
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                              {(email.clickRate * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-800">
                        #{index + 1}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Social Posts */}
          {topSocial.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                  Top Social Posts
                </h4>
              </div>
              <div className="space-y-2">
                {topSocial.map((post, index) => (
                  <div
                    key={post.id}
                    className="group p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover-glass-shine transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                        ${index === 0 ? 'bg-yellow-100 dark:bg-yellow-950/50 text-yellow-600 dark:text-yellow-400' : ''}
                        ${index === 1 ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' : ''}
                        ${index === 2 ? 'bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400' : ''}
                      `}>
                        {index === 0 && <Trophy className="w-4 h-4" />}
                        {index === 1 && <Award className="w-4 h-4" />}
                        {index === 2 && <Star className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600">
                            {post.platform}
                          </Badge>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Week of {new Date(post.weekStarting).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {post.impressions.toLocaleString()} impressions
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-yellow-500" />
                            <span className="text-xs font-bold text-green-600 dark:text-green-400">
                              {(post.engagementRate * 100).toFixed(1)}% engagement
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-pink-100 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 border-pink-300 dark:border-pink-800">
                        #{index + 1}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {topEmails.length === 0 && topSocial.length === 0 && (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No performance data available yet
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
