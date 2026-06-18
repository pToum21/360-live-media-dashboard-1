'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { UniversalTooltip } from './universal-tooltip'

interface SocialMetric {
  weekStarting: Date
  liPostsPerWeek: number | null
  fbPostsPerWeek: number | null
  igPostsPerWeek: number | null
  xPostsPerWeek: number | null
}

interface Props {
  data: SocialMetric[]
}

export function PostFrequencyByChannelChart({ data }: Props) {
  const chartData = data.map(m => ({
    week: new Date(m.weekStarting).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    'LI Posts Per Week': m.liPostsPerWeek || 0,
    'FB Posts Per Week': m.fbPostsPerWeek || 0,
    'IG Posts Per Week': m.igPostsPerWeek || 0,
    'X Posts Per Week': m.xPostsPerWeek || 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
        <XAxis 
          dataKey="week" 
          className="text-xs text-gray-600 dark:text-gray-400"
          tick={{ fill: 'currentColor' }}
        />
        <YAxis 
          className="text-xs text-gray-600 dark:text-gray-400"
          tick={{ fill: 'currentColor' }}
        />
        <Tooltip content={<UniversalTooltip />} />
        <Legend 
          wrapperStyle={{ 
            paddingTop: '20px',
            fontSize: '12px'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="LI Posts Per Week" 
          stroke="#0077B5" 
          strokeWidth={2}
          dot={{ fill: '#0077B5', r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="FB Posts Per Week" 
          stroke="#1877F2" 
          strokeWidth={2}
          dot={{ fill: '#1877F2', r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="IG Posts Per Week" 
          stroke="#FCAF45" 
          strokeWidth={2}
          dot={{ fill: '#FCAF45', r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="X Posts Per Week" 
          stroke="#14171A" 
          strokeWidth={2}
          dot={{ fill: '#14171A', r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
