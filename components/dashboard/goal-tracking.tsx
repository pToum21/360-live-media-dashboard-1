'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Target,
  Mail,
  Users,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  UserCheck,
  DollarSign
} from "lucide-react"

interface GoalTrackingProps {
  websiteVisitors?: number
  emailOpenRate?: number
  socialEngagement?: number
  newLeads?: number
  // Client-specific goals
  eventRegistrations?: number
  eventRegistrationsTarget?: number
  revenueActual?: number
  revenueTarget?: number
}

// Helper to check if we have any real data
function hasRealData(props: GoalTrackingProps) {
  return (props.websiteVisitors && props.websiteVisitors > 0) || 
         (props.emailOpenRate && props.emailOpenRate > 0) || 
         (props.socialEngagement && props.socialEngagement > 0) ||
         (props.newLeads && props.newLeads > 0) ||
         (props.eventRegistrations && props.eventRegistrations > 0) ||
         (props.revenueActual && props.revenueActual > 0)
}

export function GoalTracking({ 
  websiteVisitors, 
  emailOpenRate, 
  socialEngagement, 
  newLeads,
  eventRegistrations,
  eventRegistrationsTarget,
  revenueActual,
  revenueTarget
}: GoalTrackingProps) {
  // Don't render if no real data
  if (!hasRealData({ websiteVisitors, emailOpenRate, socialEngagement, newLeads, eventRegistrations, revenueActual })) {
    return null
  }

  const goals = [
    // Client-specific goals (priority display)
    eventRegistrations && eventRegistrations > 0 ? {
      id: 'registrations',
      title: 'Event Registrations',
      icon: Users,
      current: eventRegistrations,
      target: eventRegistrationsTarget || 1000,
      unit: '',
      color: 'green',
      deadline: 'Event Date'
    } : null,
    revenueActual && revenueActual > 0 ? {
      id: 'revenue',
      title: 'Revenue Target',
      icon: TrendingUp,
      current: revenueActual,
      target: revenueTarget || revenueActual * 1.2,
      unit: '$',
      color: 'blue',
      deadline: 'End of Year'
    } : null,
    // Generic goals
    websiteVisitors && websiteVisitors > 0 ? {
      id: 'website',
      title: 'Monthly Website Visitors',
      icon: BarChart3,
      current: websiteVisitors,
      target: Math.max(10000, Math.ceil(websiteVisitors * 1.1)), // Target is 10% growth or 10k minimum
      unit: '',
      color: 'blue',
      deadline: 'End of Month'
    } : null,
    emailOpenRate && emailOpenRate > 0 ? {
      id: 'email',
      title: 'Email Open Rate',
      icon: Mail,
      current: emailOpenRate * 100,
      target: 20,
      unit: '%',
      color: 'purple',
      deadline: 'Next Campaign'
    } : null,
    socialEngagement && socialEngagement > 0 ? {
      id: 'social',
      title: 'Social Engagement Rate',
      icon: Users,
      current: socialEngagement * 100,
      target: 15,
      unit: '%',
      color: 'pink',
      deadline: 'This Week'
    } : null,
    newLeads && newLeads > 0 ? {
      id: 'leads',
      title: 'New Leads Generated',
      icon: TrendingUp,
      current: newLeads,
      target: Math.max(50, Math.ceil(newLeads * 1.1)), // Target is 10% growth or 50 minimum
      unit: '',
      color: 'green',
      deadline: 'This Quarter'
    } : null
  ].filter((goal): goal is NonNullable<typeof goal> => goal !== null) // Only show goals with real data

  return (
    <Card className="glass-card border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-50/10 dark:from-green-900/20 to-transparent border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-md">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Goal Tracking</CardTitle>
            <CardDescription className="dark:text-gray-400">Monitor progress toward your marketing targets</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-5">
          {goals.map((goal) => {
            const Icon = goal.icon
            const progress = Math.min((goal.current / goal.target) * 100, 100)
            const isComplete = progress >= 100
            const isOnTrack = progress >= 75
            
            return (
              <div
                key={goal.id}
                className="group p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover-glass-shine transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${goal.color === 'blue' ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400' : ''}
                      ${goal.color === 'purple' ? 'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400' : ''}
                      ${goal.color === 'pink' ? 'bg-pink-100 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400' : ''}
                      ${goal.color === 'green' ? 'bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400' : ''}
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                        {goal.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Clock className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {goal.deadline}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {goal.unit === '$' ? '$' : ''}{goal.current.toLocaleString()}{goal.unit !== '$' ? goal.unit : ''}
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        /{goal.unit === '$' ? '$' : ''}{goal.target.toLocaleString()}{goal.unit !== '$' ? goal.unit : ''}
                      </span>
                    </div>
                    {isComplete ? (
                      <Badge className="bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400 border-green-300 dark:border-green-800 mt-1">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Complete
                      </Badge>
                    ) : isOnTrack ? (
                      <Badge className="bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-800 mt-1">
                        On Track
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 dark:bg-yellow-950/50 text-yellow-600 dark:text-yellow-400 border-yellow-300 dark:border-yellow-800 mt-1">
                        Needs Focus
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {progress.toFixed(1)}% Complete
                    </span>
                    {isComplete ? (
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                        Exceeded by {goal.unit === '$' ? '$' : ''}{(goal.current - goal.target).toLocaleString()}{goal.unit !== '$' ? goal.unit : ''}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {goal.unit === '$' ? '$' : ''}{(goal.target - goal.current).toLocaleString()}{goal.unit !== '$' ? goal.unit : ''} to go
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
