'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle, 
  Lightbulb,
  Target,
  Zap,
  ArrowUpRight
} from "lucide-react"

interface PerformanceInsightsProps {
  websiteData?: {
    totalUsers: number
    newUsers: number
    avgEngagementTimeSec: number
    healthScore: number
  }
  emailData?: {
    openRate: number
    clickRate: number
    deliveryRate: number
  }
  socialData?: {
    liEngagementRate: number | null
    igEngagementRate: number | null
    liImpressions: number | null
    igImpressions: number | null
  }
}

export function PerformanceInsights({ websiteData, emailData, socialData }: PerformanceInsightsProps) {
  const insights = generateInsights(websiteData, emailData, socialData)

  return (
    <Card className="glass-card border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-50/10 dark:from-purple-900/20 to-transparent border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-md">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">AI Performance Insights</CardTitle>
            <CardDescription className="dark:text-gray-400">Actionable recommendations based on your data</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="group p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover-glass-shine transition-all duration-300 cursor-default"
            >
              <div className="flex items-start gap-3">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                  ${insight.type === 'success' ? 'bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400' : ''}
                  ${insight.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-950/50 text-yellow-600 dark:text-yellow-400' : ''}
                  ${insight.type === 'info' ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400' : ''}
                  ${insight.type === 'opportunity' ? 'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400' : ''}
                `}>
                  {insight.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                      {insight.title}
                    </h4>
                    <Badge variant="outline" className={`
                      text-xs
                      ${insight.priority === 'high' ? 'border-red-300 dark:border-red-800 text-red-600 dark:text-red-400' : ''}
                      ${insight.priority === 'medium' ? 'border-yellow-300 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400' : ''}
                      ${insight.priority === 'low' ? 'border-blue-300 dark:border-blue-800 text-blue-600 dark:text-blue-400' : ''}
                    `}>
                      {insight.priority} priority
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {insight.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-500">
                    <Target className="w-3.5 h-3.5" />
                    <span>Action: {insight.action}</span>
                  </div>
                </div>
                {insight.metric && (
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {insight.metric}
                    </div>
                    {insight.trend && (
                      <div className={`flex items-center gap-1 text-xs font-semibold ${
                        insight.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {insight.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {insight.trendValue}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function generateInsights(websiteData?: any, emailData?: any, socialData?: any) {
  const insights = []

  // Website Insights
  if (websiteData && websiteData.healthScore && websiteData.healthScore > 0) {
    if (websiteData.healthScore > 0.6) {
      insights.push({
        type: 'warning',
        priority: 'high',
        title: 'High Bounce Rate Detected',
        description: `Your bounce rate is ${(websiteData.healthScore * 100).toFixed(1)}%, which is above the healthy threshold. This indicates visitors are leaving without engaging.`,
        action: 'Review landing page content and improve page load speed',
        icon: <AlertCircle className="w-5 h-5" />,
        metric: `${(websiteData.healthScore * 100).toFixed(1)}%`,
        trend: 'up' as const,
        trendValue: 'Above target'
      })
    } else {
      insights.push({
        type: 'success',
        priority: 'low',
        title: 'Excellent Bounce Rate',
        description: `Your bounce rate of ${(websiteData.healthScore * 100).toFixed(1)}% is performing well, showing strong visitor engagement.`,
        action: 'Maintain current content quality and user experience',
        icon: <CheckCircle className="w-5 h-5" />,
        metric: `${(websiteData.healthScore * 100).toFixed(1)}%`,
        trend: 'up' as const,
        trendValue: 'On target'
      })
    }

    if (websiteData.avgEngagementTimeSec && websiteData.avgEngagementTimeSec > 0 && websiteData.avgEngagementTimeSec < 60) {
      insights.push({
        type: 'opportunity',
        priority: 'medium',
        title: 'Session Duration Opportunity',
        description: `Average session is ${websiteData.avgEngagementTimeSec}s. Longer sessions typically indicate higher engagement and conversion potential.`,
        action: 'Add interactive content, videos, or internal linking to increase time on site',
        icon: <Zap className="w-5 h-5" />,
        metric: `${websiteData.avgEngagementTimeSec}s`
      })
    }
  }

  // Email Insights
  if (emailData && emailData.openRate && emailData.openRate > 0) {
    if (emailData.openRate >= 0.15) {
      insights.push({
        type: 'success',
        priority: 'low',
        title: 'Strong Email Open Rate',
        description: `Your ${(emailData.openRate * 100).toFixed(1)}% open rate exceeds the industry average. Your subject lines are working!`,
        action: 'Document what\'s working and replicate in future campaigns',
        icon: <CheckCircle className="w-5 h-5" />,
        metric: `${(emailData.openRate * 100).toFixed(1)}%`,
        trend: 'up' as const,
        trendValue: 'Above avg'
      })
    }

    if (emailData.clickRate < 0.025) {
      insights.push({
        type: 'warning',
        priority: 'high',
        title: 'Low Email Click-Through Rate',
        description: `Click rate of ${(emailData.clickRate * 100).toFixed(1)}% suggests email content may not be compelling enough or CTAs need optimization.`,
        action: 'A/B test CTA placement, copy, and button design',
        icon: <AlertCircle className="w-5 h-5" />,
        metric: `${(emailData.clickRate * 100).toFixed(1)}%`,
        trend: 'down' as const,
        trendValue: 'Below target'
      })
    }
  }

  // Social Media Insights
  if (socialData && (socialData.liEngagementRate || socialData.igEngagementRate)) {
    const liEngagement = socialData.liEngagementRate || 0
    const igEngagement = socialData.igEngagementRate || 0

    if (liEngagement > 0 && igEngagement > 0 && liEngagement > igEngagement) {
      insights.push({
        type: 'opportunity',
        priority: 'medium',
        title: 'LinkedIn Outperforming Instagram',
        description: `LinkedIn engagement (${(liEngagement * 100).toFixed(1)}%) is ${((liEngagement / igEngagement - 1) * 100).toFixed(0)}% higher than Instagram. Consider reallocating resources.`,
        action: 'Increase LinkedIn posting frequency or reduce Instagram efforts',
        icon: <TrendingUp className="w-5 h-5" />,
        metric: `+${((liEngagement / igEngagement - 1) * 100).toFixed(0)}%`
      })
    }

    if (socialData.liImpressions && socialData.liImpressions > 5000) {
      insights.push({
        type: 'success',
        priority: 'low',
        title: 'LinkedIn Reach Growing',
        description: `Reaching ${socialData.liImpressions.toLocaleString()} impressions on LinkedIn shows strong brand visibility in your professional network.`,
        action: 'Leverage this reach with strategic content and thought leadership',
        icon: <CheckCircle className="w-5 h-5" />,
        metric: socialData.liImpressions.toLocaleString()
      })
    }
  }

  // Only show general insight if we have at least some data
  if (insights.length > 0) {
    insights.push({
      type: 'info',
      priority: 'low',
      title: 'Quick Win: Test New Content Formats',
      description: 'Diversifying your content mix can increase engagement by 20-40%. Consider adding video, infographics, or interactive content.',
      action: 'Plan a content experiment for next campaign cycle',
      icon: <Lightbulb className="w-5 h-5" />
    })
  }

  return insights.slice(0, 5) // Return top 5 insights
}
