'use client'

import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts'
import { Clock, Calendar, TrendingUp } from 'lucide-react'

interface EmailTimingData {
  name: string
  deploymentDayOfWeek: string | null
  deploymentTimeOfDay: string | null
  openRate: number
  clickRate: number
  deliveryRate: number
}

interface SendTimeHeatmapProps {
  data: EmailTimingData[]
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const TIMES_OF_DAY = ['Morning', 'Afternoon', 'Evening', 'Night']

export function SendTimeHeatmap({ data }: SendTimeHeatmapProps) {
  // Calculate average performance by day of week
  const byDay = useMemo(() => {
    if (!data || data.length === 0) return []
    const dayStats: Record<string, { openRate: number[], clickRate: number[], count: number }> = {}
    
    data.forEach(email => {
      if (!email.deploymentDayOfWeek) return
      if (!dayStats[email.deploymentDayOfWeek]) {
        dayStats[email.deploymentDayOfWeek] = { openRate: [], clickRate: [], count: 0 }
      }
      dayStats[email.deploymentDayOfWeek].openRate.push(email.openRate)
      dayStats[email.deploymentDayOfWeek].clickRate.push(email.clickRate)
      dayStats[email.deploymentDayOfWeek].count++
    })
    
    return DAYS_OF_WEEK.map(day => ({
      day,
      avgOpenRate: dayStats[day] 
        ? dayStats[day].openRate.reduce((a, b) => a + b, 0) / dayStats[day].openRate.length 
        : 0,
      avgClickRate: dayStats[day]
        ? dayStats[day].clickRate.reduce((a, b) => a + b, 0) / dayStats[day].clickRate.length
        : 0,
      count: dayStats[day]?.count || 0,
    })).filter(d => d.count > 0)
  }, [data])

  // Calculate average performance by time of day
  const byTime = useMemo(() => {
    if (!data || data.length === 0) return []
    const timeStats: Record<string, { openRate: number[], clickRate: number[], count: number }> = {}
    
    data.forEach(email => {
      if (!email.deploymentTimeOfDay) return
      if (!timeStats[email.deploymentTimeOfDay]) {
        timeStats[email.deploymentTimeOfDay] = { openRate: [], clickRate: [], count: 0 }
      }
      timeStats[email.deploymentTimeOfDay].openRate.push(email.openRate)
      timeStats[email.deploymentTimeOfDay].clickRate.push(email.clickRate)
      timeStats[email.deploymentTimeOfDay].count++
    })
    
    return TIMES_OF_DAY.map(time => ({
      time,
      avgOpenRate: timeStats[time]
        ? timeStats[time].openRate.reduce((a, b) => a + b, 0) / timeStats[time].openRate.length
        : 0,
      avgClickRate: timeStats[time]
        ? timeStats[time].clickRate.reduce((a, b) => a + b, 0) / timeStats[time].clickRate.length
        : 0,
      count: timeStats[time]?.count || 0,
    })).filter(d => d.count > 0)
  }, [data])

  // Find best performing day and time
  const bestDay = byDay.length > 0 ? byDay.reduce((best, current) => 
    current.avgOpenRate > best.avgOpenRate ? current : best
  ) : null

  const bestTime = byTime.length > 0 ? byTime.reduce((best, current) =>
    current.avgOpenRate > best.avgOpenRate ? current : best
  ) : null

  const getBarColor = (value: number, max: number) => {
    const ratio = value / max
    if (ratio > 0.8) return '#10b981' // Green
    if (ratio > 0.6) return '#3b82f6' // Blue
    if (ratio > 0.4) return '#f59e0b' // Amber
    return '#ef4444' // Red
  }

  const maxOpenRate = Math.max(...byDay.map(d => d.avgOpenRate), ...byTime.map(d => d.avgOpenRate))

  // Early return after all hooks
  if (!data || data.length === 0 || byDay.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No email timing data available</div>
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-5 rounded-xl shadow-2xl border border-blue-100/50 dark:border-blue-900/50">
          <p className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6 py-1.5">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-3.5 h-3.5 rounded shadow-lg" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{entry.name}:</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-gray-100">
                {(entry.value * 100).toFixed(1)}%
              </span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Based on {payload[0]?.payload?.count || 0} emails
            </span>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      {/* Best Time Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bestDay && (
          <div className="glass-card p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Best Day to Send</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{bestDay.day}</p>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Avg Open Rate</p>
                <p className="text-xl font-bold text-green-600">{(bestDay.avgOpenRate * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Avg Click Rate</p>
                <p className="text-xl font-bold text-blue-600">{(bestDay.avgClickRate * 100).toFixed(1)}%</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Based on {bestDay.count} emails</p>
          </div>
        )}
        
        {bestTime && (
          <div className="glass-card p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Best Time to Send</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{bestTime.time}</p>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Avg Open Rate</p>
                <p className="text-xl font-bold text-purple-600">{(bestTime.avgOpenRate * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Avg Click Rate</p>
                <p className="text-xl font-bold text-pink-600">{(bestTime.avgClickRate * 100).toFixed(1)}%</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Based on {bestTime.count} emails</p>
          </div>
        )}
      </div>

      {/* Performance by Day of Week */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Performance by Day of Week
        </h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byDay} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="day" />
              <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="avgOpenRate" name="Avg Open Rate" radius={[10, 10, 0, 0]}>
                {byDay.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.avgOpenRate, maxOpenRate)} />
                ))}
              </Bar>
              <Bar dataKey="avgClickRate" name="Avg Click Rate" radius={[10, 10, 0, 0]} fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance by Time of Day */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Performance by Time of Day
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byTime} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="time" />
              <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="avgOpenRate" name="Avg Open Rate" radius={[10, 10, 0, 0]}>
                {byTime.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.avgOpenRate, maxOpenRate)} />
                ))}
              </Bar>
              <Bar dataKey="avgClickRate" name="Avg Click Rate" radius={[10, 10, 0, 0]} fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendations */}
      <div className="glass-card p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">💡 Send Time Recommendations</h4>
        <div className="space-y-3 text-sm">
          {bestDay && (
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-green-500 mt-0.5" />
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Optimal day:</strong> Schedule high-priority campaigns on {bestDay.day}s for {(bestDay.avgOpenRate * 100).toFixed(1)}% average open rates
              </p>
            </div>
          )}
          {bestTime && (
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-purple-500 mt-0.5" />
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Optimal time:</strong> Send during {bestTime.time} hours for maximum engagement
              </p>
            </div>
          )}
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-blue-500 mt-0.5" />
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Consistency matters:</strong> Maintain regular send schedules to build audience expectations
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
