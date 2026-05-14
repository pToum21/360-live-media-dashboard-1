"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface SocialGrowthChartProps {
  data: {
    week: string
    linkedIn: number
    instagram: number
  }[]
}

export function SocialGrowthChart({ data }: SocialGrowthChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 py-1">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">{entry.name}:</span>
              </div>
              <span className="font-semibold text-gray-900">
                {entry.value.toLocaleString()} impressions
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
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis 
          dataKey="week" 
          stroke="#9ca3af"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis 
          stroke="#9ca3af"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          dx={-10}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          iconType="line"
          iconSize={14}
          wrapperStyle={{ paddingTop: '20px', fontSize: '13px' }}
          formatter={(value) => <span style={{ color: '#374151', fontWeight: 600 }}>{value}</span>}
        />
        <Line 
          type="monotone" 
          dataKey="linkedIn" 
          stroke="#0077b5" 
          strokeWidth={3}
          dot={{ fill: '#0077b5', r: 5, strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 7, strokeWidth: 2, stroke: '#fff' }}
          name="LinkedIn Impressions"
          animationDuration={1500}
        />
        <Line 
          type="monotone" 
          dataKey="instagram" 
          stroke="#E1306C" 
          strokeWidth={3}
          dot={{ fill: '#E1306C', r: 5, strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 7, strokeWidth: 2, stroke: '#fff' }}
          name="Instagram Impressions"
          animationDuration={1500}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
