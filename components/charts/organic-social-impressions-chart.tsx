'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { UniversalTooltip } from './universal-tooltip'

interface SocialMetric {
  weekStarting: Date
  liImpressions: number | null
  fbImpressions: number | null
  igImpressions: number | null
  xImpressions: number | null
}

interface Props {
  data: SocialMetric[]
}

export function OrganicSocialImpressionsChart({ data }: Props) {
  const chartData = data.map(m => ({
    week: new Date(m.weekStarting).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    'LinkedIn Impressions': m.liImpressions || 0,
    'Instagram Impressions': m.igImpressions || 0,
    'Facebook Impressions': m.fbImpressions || 0,
    'X Impressions': m.xImpressions || 0,
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
        <Bar dataKey="LinkedIn Impressions" stackId="a" fill="#0077B5" radius={[0, 0, 0, 0]} />
        <Bar dataKey="Instagram Impressions" stackId="a" fill="#E4405F" radius={[0, 0, 0, 0]} />
        <Bar dataKey="Facebook Impressions" stackId="a" fill="#1877F2" radius={[0, 0, 0, 0]} />
        <Bar dataKey="X Impressions" stackId="a" fill="#000000" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
