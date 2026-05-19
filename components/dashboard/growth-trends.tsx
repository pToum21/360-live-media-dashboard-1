'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp,
  TrendingDown,
  BarChart3,
  Mail,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react"

interface GrowthTrendsProps {
  websiteMetrics?: Array<{
    weekStarting: Date
    totalUsers: number
  }>
  emailCampaigns?: Array<{
    deploymentDate: Date
    openRate: number
  }>
  socialMetrics?: Array<{
    weekStarting: Date
    liImpressions: number | null
    igImpressions: number | null
  }>
}

export function GrowthTrends({ websiteMetrics = [], emailCampaigns = [], socialMetrics = [] }: GrowthTrendsProps) {
  // Calculate WoW (Week over Week) changes
  const calculateWoW = (data: number[]) => {
    if (data.length < 2) return { change: 0, percentage: 0 }
    const current = data[data.length - 1]
    const previous = data[data.length - 2]
    const change = current - previous
    const percentage = previous !== 0 ? (change / previous) * 100 : 0
    return { change, percentage }
  }

  // Calculate MoM (Month over Month) - using last 4 weeks vs previous 4 weeks
  const calculateMoM = (data: number[]) => {
    if (data.length < 8) return { change: 0, percentage: 0 }
    const currentMonth = data.slice(-4).reduce((sum, val) => sum + val, 0) / 4
    const previousMonth = data.slice(-8, -4).reduce((sum, val) => sum + val, 0) / 4
    const change = currentMonth - previousMonth
    const percentage = previousMonth !== 0 ? (change / previousMonth) * 100 : 0
    return { change, percentage }
  }

  // Website trends
  const websiteUsers = websiteMetrics.map(m => m.totalUsers)
  const websiteWoW = calculateWoW(websiteUsers)
  const websiteMoM = calculateMoM(websiteUsers)

  // Email trends
  const emailOpenRates = emailCampaigns.map(c => c.openRate * 100)
  const emailWoW = calculateWoW(emailOpenRates)
  const emailMoM = calculateMoM(emailOpenRates)

  // Social trends
  const socialImpressions = socialMetrics.map(s => (s.liImpressions || 0) + (s.igImpressions || 0))
  const socialWoW = calculateWoW(socialImpressions)
  const socialMoM = calculateMoM(socialImpressions)

  const trends = [
    {
      id: 'website',
      title: 'Website Traffic',
      icon: BarChart3,
      color: 'blue',
      wow: websiteWoW,
      mom: websiteMoM,
      current: websiteUsers[websiteUsers.length - 1] || 0,
      unit: 'visitors'
    },
    {
      id: 'email',
      title: 'Email Performance',
      icon: Mail,
      color: 'purple',
      wow: emailWoW,
      mom: emailMoM,
      current: emailOpenRates[emailOpenRates.length - 1] || 0,
      unit: '% open rate'
    },
    {
      id: 'social',
      title: 'Social Reach',
      icon: Users,
      color: 'pink',
      wow: socialWoW,
      mom: socialMoM,
      current: socialImpressions[socialImpressions.length - 1] || 0,
      unit: 'impressions'
    }
  ]

  const getTrendIcon = (percentage: number) => {
    if (percentage > 0) return <ArrowUpRight className="w-4 h-4" />
    if (percentage < 0) return <ArrowDownRight className="w-4 h-4" />
    return <Minus className="w-4 h-4" />
  }

  const getTrendColor = (percentage: number) => {
    if (percentage > 0) return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-950/50'
    if (percentage < 0) return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/50'
    return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
  }

  return (
    <Card className="glass-card border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50/10 dark:from-blue-900/20 to-transparent border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-md">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Growth Trends</CardTitle>
            <CardDescription className="dark:text-gray-400">Week-over-week and month-over-month changes</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {trends.map((trend) => {
            const Icon = trend.icon
            return (
              <div
                key={trend.id}
                className="group p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover-glass-shine transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${trend.color === 'blue' ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400' : ''}
                      ${trend.color === 'purple' ? 'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400' : ''}
                      ${trend.color === 'pink' ? 'bg-pink-100 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400' : ''}
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                        {trend.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Current: {trend.current.toFixed(0)} {trend.unit}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Week over Week */}
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Week over Week</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${getTrendColor(trend.wow.percentage)}`}>
                      {getTrendIcon(trend.wow.percentage)}
                      <span className="font-bold text-sm">
                        {trend.wow.percentage > 0 ? '+' : ''}{trend.wow.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Month over Month */}
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Month over Month</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${getTrendColor(trend.mom.percentage)}`}>
                      {getTrendIcon(trend.mom.percentage)}
                      <span className="font-bold text-sm">
                        {trend.mom.percentage > 0 ? '+' : ''}{trend.mom.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary Insight */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-900">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Growth Summary
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {trends.filter(t => t.mom.percentage > 0).length} of {trends.length} metrics are showing positive month-over-month growth. 
                Keep up the momentum!
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
