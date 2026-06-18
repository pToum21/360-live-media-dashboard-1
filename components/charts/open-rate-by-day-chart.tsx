'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface OpenRateByDayChartProps {
  data: Array<{
    deploymentDayOfWeek: string | null
    openRate: number
  }>
}

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function OpenRateByDayChart({ data }: OpenRateByDayChartProps) {
  // Group by day of week and calculate averages
  const dayStats = data.reduce((acc, campaign) => {
    const day = campaign.deploymentDayOfWeek
    if (!day) return acc
    
    if (!acc[day]) {
      acc[day] = { totalOpenRate: 0, count: 0 }
    }
    acc[day].totalOpenRate += campaign.openRate
    acc[day].count += 1
    
    return acc
  }, {} as Record<string, { totalOpenRate: number; count: number }>)

  // Calculate averages and format for chart
  const chartData = DAY_ORDER.map(day => {
    const stats = dayStats[day]
    return {
      day: day.substring(0, 3), // Mon, Tue, Wed, etc.
      fullDay: day,
      avgOpenRate: stats ? stats.totalOpenRate / stats.count : 0,
      count: stats ? stats.count : 0
    }
  }).filter(d => d.count > 0) // Only show days with data

  if (chartData.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>No day-of-week data available</p>
        <p className="text-xs mt-2">Data will appear once campaigns with day information are added</p>
      </div>
    )
  }

  // Find best performing day
  const bestDay = chartData.reduce((best, current) => 
    current.avgOpenRate > best.avgOpenRate ? current : best
  )

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="day" 
            label={{ value: 'Day of Week', position: 'insideBottom', offset: -10 }}
          />
          <YAxis 
            domain={[0, 1]}
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            label={{ value: 'Avg Open Rate', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-purple-100/50 dark:border-purple-900/50">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {data.fullDay}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Avg Open Rate: <span className="font-bold text-purple-600">{(data.avgOpenRate * 100).toFixed(1)}%</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Based on {data.count} campaign{data.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar 
            dataKey="avgOpenRate" 
            fill="#8b5cf6"
            radius={[8, 8, 0, 0]}
            opacity={0.8}
          />
        </BarChart>
      </ResponsiveContainer>
      
      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-purple-600 dark:text-purple-400">{bestDay.fullDay}</span> has the highest average open rate at{' '}
          <span className="font-bold text-purple-600 dark:text-purple-400">{(bestDay.avgOpenRate * 100).toFixed(1)}%</span>
        </p>
      </div>
    </div>
  )
}
