"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts'

interface EmailPerformanceChartProps {
  data: {
    name: string
    openRate: number
    clickRate: number
  }[]
}

export function EmailPerformanceChart({ data }: EmailPerformanceChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-3">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 py-1">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">{entry.name}:</span>
              </div>
              <span className="font-semibold text-gray-900">
                {(entry.value * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 70 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis 
          dataKey="name" 
          stroke="#9ca3af"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          angle={-45}
          textAnchor="end"
          height={100}
        />
        <YAxis 
          stroke="#9ca3af"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
          dx={-10}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="top" 
          height={50}
          iconType="rect"
          iconSize={14}
          wrapperStyle={{ paddingBottom: '15px', fontSize: '13px' }}
          formatter={(value) => <span style={{ color: '#374151', fontWeight: 600 }}>{value}</span>}
        />
        <Bar 
          dataKey="openRate" 
          fill="#10b981" 
          name="Open Rate"
          radius={[8, 8, 0, 0]}
          animationDuration={1200}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.openRate >= 0.15 ? '#10b981' : '#f59e0b'}
            />
          ))}
        </Bar>
        <Bar 
          dataKey="clickRate" 
          fill="#3b82f6" 
          name="Click Rate"
          radius={[8, 8, 0, 0]}
          animationDuration={1200}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
