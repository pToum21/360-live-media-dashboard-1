'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, DollarSign, Target, Star, BarChart3 } from "lucide-react"
import Image from "next/image"

interface SixRsFrameworkProps {
  showImage?: boolean
  // Each R has actual value and goal, we calculate % to goal
  relevanceActual?: number
  relevanceGoal?: number
  retentionActual?: number
  retentionGoal?: number
  revenueActual?: number
  revenueGoal?: number
  reachActual?: number
  reachGoal?: number
  reputationActual?: number
  reputationGoal?: number
  roiActual?: number
  roiGoal?: number
}

export function SixRsFramework({ 
  showImage = true,
  relevanceActual,
  relevanceGoal,
  retentionActual,
  retentionGoal,
  revenueActual,
  revenueGoal,
  reachActual,
  reachGoal,
  reputationActual,
  reputationGoal,
  roiActual,
  roiGoal
}: SixRsFrameworkProps) {
  // Helper to calculate percentage to goal
  const calculateProgress = (actual?: number, goal?: number): { percent: number | null, display: string } => {
    if (!actual || !goal || goal === 0) {
      return { percent: null, display: 'N/A' }
    }
    const percent = Math.min((actual / goal) * 100, 100)
    return { percent, display: `${percent.toFixed(0)}%` }
  }

  const sixRs = [
    {
      id: 'relevance',
      title: 'Relevance',
      subtitle: 'Right Addressable Market',
      actual: relevanceActual,
      goal: relevanceGoal,
      progress: calculateProgress(relevanceActual, relevanceGoal),
      icon: Target,
      color: 'from-green-600 to-emerald-600',
      bgColor: 'bg-green-100 dark:bg-green-950/50',
      textColor: 'text-green-600 dark:text-green-400',
      progressColor: 'bg-green-600'
    },
    {
      id: 'retention',
      title: 'Retention',
      subtitle: 'Return Attendees',
      actual: retentionActual,
      goal: retentionGoal,
      progress: calculateProgress(retentionActual, retentionGoal),
      icon: Users,
      color: 'from-blue-600 to-cyan-600',
      bgColor: 'bg-blue-100 dark:bg-blue-950/50',
      textColor: 'text-blue-600 dark:text-blue-400',
      progressColor: 'bg-blue-600'
    },
    {
      id: 'revenue',
      title: 'Revenue',
      subtitle: 'Total Revenue Generated',
      actual: revenueActual,
      goal: revenueGoal,
      progress: calculateProgress(revenueActual, revenueGoal),
      icon: DollarSign,
      color: 'from-emerald-600 to-teal-600',
      bgColor: 'bg-emerald-100 dark:bg-emerald-950/50',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      progressColor: 'bg-emerald-600'
    },
    {
      id: 'reach',
      title: 'Reach',
      subtitle: 'Total Attendees',
      actual: reachActual,
      goal: reachGoal,
      progress: calculateProgress(reachActual, reachGoal),
      icon: BarChart3,
      color: 'from-purple-600 to-pink-600',
      bgColor: 'bg-purple-100 dark:bg-purple-950/50',
      textColor: 'text-purple-600 dark:text-purple-400',
      progressColor: 'bg-purple-600'
    },
    {
      id: 'reputation',
      title: 'Reputation',
      subtitle: 'NPS+ (Net Promoter Score)',
      actual: reputationActual,
      goal: reputationGoal,
      progress: calculateProgress(reputationActual, reputationGoal),
      icon: Star,
      color: 'from-yellow-600 to-orange-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-950/50',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      progressColor: 'bg-yellow-600'
    },
    {
      id: 'roi',
      title: 'ROI',
      subtitle: 'Net Return On Investment',
      actual: roiActual,
      goal: roiGoal,
      progress: calculateProgress(roiActual, roiGoal),
      icon: TrendingUp,
      color: 'from-indigo-600 to-blue-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-950/50',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      progressColor: 'bg-indigo-600'
    }
  ]

  return (
    <Card className="glass-card border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-50/10 dark:from-green-900/20 to-transparent border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-xl text-gray-900 dark:text-gray-100 text-center">
          Event Performance Summary
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-1">
          The 6 Rs Framework - Powered by 360 Live Media
        </p>
      </CardHeader>
      <CardContent className="pt-8 pb-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          {/* Left side - 3 Rs */}
          <div className="flex flex-col gap-4 lg:w-1/4">
            {sixRs.slice(0, 3).map((r) => {
              const Icon = r.icon
              return (
                <div
                  key={r.id}
                  className="group relative p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover-glass-shine transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold text-base ${r.textColor}`}>
                        {r.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-2">
                        {r.subtitle}
                      </p>
                      
                      {/* Progress to Goal */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
                          <span className={`text-xl font-bold ${r.progress.percent !== null ? r.textColor : 'text-gray-400 dark:text-gray-500'}`}>
                            {r.progress.display}
                          </span>
                        </div>
                        {r.progress.percent !== null && (
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${r.progressColor} transition-all duration-500`}
                              style={{ width: `${r.progress.percent}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Center - Large 6 Rs Image */}
          {showImage && (
            <div className="flex items-center justify-center lg:w-1/2">
              <div className="relative">
                <Image 
                  src="/Logos/6rs.png" 
                  alt="The 6 Rs Framework" 
                  width={400} 
                  height={400}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          )}

          {/* Right side - 3 Rs */}
          <div className="flex flex-col gap-4 lg:w-1/4">
            {sixRs.slice(3, 6).map((r) => {
              const Icon = r.icon
              return (
                <div
                  key={r.id}
                  className="group relative p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover-glass-shine transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold text-base ${r.textColor}`}>
                        {r.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-2">
                        {r.subtitle}
                      </p>
                      
                      {/* Progress to Goal */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
                          <span className={`text-xl font-bold ${r.progress.percent !== null ? r.textColor : 'text-gray-400 dark:text-gray-500'}`}>
                            {r.progress.display}
                          </span>
                        </div>
                        {r.progress.percent !== null && (
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${r.progressColor} transition-all duration-500`}
                              style={{ width: `${r.progress.percent}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
