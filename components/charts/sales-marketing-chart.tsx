'use client'

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { UniversalTooltip } from './universal-tooltip'

interface SalesMarketingChartProps {
  data: Array<{
    weekOf: Date
    openRate: number
    clickRate: number
    micrositeVisits: number
    audience?: string
    subjectMessage?: string
  }>
  type: 'performance' | 'visits'
}

export function SalesMarketingChart({ data, type }: SalesMarketingChartProps) {
  // Sort data by weekOf date
  const sortedData = [...data].sort((a, b) => 
    new Date(a.weekOf).getTime() - new Date(b.weekOf).getTime()
  )

  // Format data for the chart
  const chartData = sortedData.map(item => ({
    week: new Date(item.weekOf).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    fullDate: new Date(item.weekOf).toLocaleDateString(),
    'Open Rate': item.openRate * 100,
    'Click Rate': item.clickRate * 100,
    'Microsite Visits': item.micrositeVisits,
    audience: item.audience || 'Unknown',
    subject: item.subjectMessage || 'N/A',
  }))

  if (type === 'performance') {
    return (
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <defs>
            <linearGradient id="openRateGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="clickRateGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
          <XAxis 
            dataKey="week" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<UniversalTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="Open Rate"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
            fill="url(#openRateGradient)"
          />
          <Line
            type="monotone"
            dataKey="Click Rate"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
            fill="url(#clickRateGradient)"
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  // Visits chart (bar chart)
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <defs>
          <linearGradient id="visitsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={1}/>
            <stop offset="95%" stopColor="#6366f1" stopOpacity={1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
        <XAxis 
          dataKey="week" 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <Tooltip content={<UniversalTooltip />} />
        <Legend />
        <Bar
          dataKey="Microsite Visits"
          fill="url(#visitsGradient)"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
