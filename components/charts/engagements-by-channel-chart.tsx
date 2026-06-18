'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { UniversalTooltip } from './universal-tooltip'

interface SocialMetric {
  weekStarting: Date
  liEngagementRate: number | null
  fbEngagements: number | null
  igEngagementRate: number | null
  xEngagements: number | null
}

interface Props {
  data: SocialMetric[]
}

export function EngagementsByChannelChart({ data }: Props) {
  const chartData = data.map(m => ({
    week: new Date(m.weekStarting).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    'LI Engagements': m.liEngagementRate ? Math.round(m.liEngagementRate * 1000) : 0, // Convert rate to count estimate
    'FB Engagements': m.fbEngagements || 0,
    'IG Engagements': m.igEngagementRate ? Math.round(m.igEngagementRate * 1000) : 0, // Convert rate to count estimate
    'X Engagements': m.xEngagements || 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
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
        <Bar dataKey="LI Engagements" fill="#0077B5" radius={[4, 4, 0, 0]} />
        <Bar dataKey="FB Engagements" fill="#1877F2" radius={[4, 4, 0, 0]} />
        <Bar dataKey="IG Engagements" fill="#E4405F" radius={[4, 4, 0, 0]} />
        <Bar dataKey="X Engagements" fill="#000000" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
