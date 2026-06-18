'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { UniversalTooltip } from './universal-tooltip'

interface SocialMetric {
  weekStarting: Date
  liFollowers: number | null
  fbFollowers: number | null
  igFollowers: number | null
  xFollowers: number | null
}

interface Props {
  data: SocialMetric[]
}

export function FollowersByChannelChart({ data }: Props) {
  const chartData = data.map(m => ({
    week: new Date(m.weekStarting).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    'Facebook': m.fbFollowers || 0,
    'X': m.xFollowers || 0,
    'Instagram': m.igFollowers || 0,
    'LinkedIn': m.liFollowers || 0,
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
        <Bar dataKey="LinkedIn" stackId="a" fill="#0077B5" radius={[0, 0, 0, 0]} />
        <Bar dataKey="X" stackId="a" fill="#000000" radius={[0, 0, 0, 0]} />
        <Bar dataKey="Instagram" stackId="a" fill="#E4405F" radius={[0, 0, 0, 0]} />
        <Bar dataKey="Facebook" stackId="a" fill="#1877F2" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
