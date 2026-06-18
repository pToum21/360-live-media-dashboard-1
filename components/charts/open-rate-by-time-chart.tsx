'use client'

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface OpenRateByTimeChartProps {
  data: Array<{
    hour: number | null
    openRate: number
    timeOfDay: string | null
  }>
}

export function OpenRateByTimeChart({ data }: OpenRateByTimeChartProps) {
  const chartData = data
    .filter(d => d.hour !== null)
    .map(d => ({
      hour: d.hour,
      openRate: d.openRate,
      timeOfDay: d.timeOfDay || 'Unknown'
    }))

  if (chartData.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>No time-of-day data available</p>
        <p className="text-xs mt-2">Data will appear once campaigns with deployment hour are added</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis 
          type="number" 
          dataKey="hour" 
          name="Hour" 
          domain={[0, 23]}
          ticks={[0, 4, 8, 12, 16, 20, 23]}
          label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }}
        />
        <YAxis 
          type="number" 
          dataKey="openRate" 
          name="Open Rate"
          domain={[0, 1]}
          tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
          label={{ value: 'Open Rate', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          cursor={{ strokeDasharray: '3 3' }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload
              return (
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-purple-100/50 dark:border-purple-900/50">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {data.hour}:00 - {data.timeOfDay}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Open Rate: <span className="font-bold text-purple-600">{(data.openRate * 100).toFixed(1)}%</span>
                  </p>
                </div>
              )
            }
            return null
          }}
        />
        <Scatter 
          name="Campaigns" 
          data={chartData}
          fill="#8b5cf6"
          opacity={0.7}
        />
      </ScatterChart>
    </ResponsiveContainer>
  )
}
