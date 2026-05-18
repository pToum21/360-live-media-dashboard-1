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
        <div className="bg-white/95 backdrop-blur-md p-5 rounded-xl shadow-2xl border border-pink-100/50 animate-scale-in">
          <p className="font-bold text-gray-900 mb-3 text-sm tracking-wide uppercase">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6 py-1.5">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-3.5 h-3.5 rounded-full shadow-lg" 
                  style={{ 
                    backgroundColor: entry.color,
                    boxShadow: `0 0 10px ${entry.color}40`
                  }}
                />
                <span className="text-sm text-gray-600 font-medium">{entry.name}:</span>
              </div>
              <span className="font-bold text-gray-900 text-base">
                {entry.value.toLocaleString()}
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
          strokeWidth={3.5}
          dot={{ fill: '#0077b5', r: 5, strokeWidth: 3, stroke: '#fff' }}
          activeDot={{ r: 7, strokeWidth: 3, stroke: '#fff', style: { filter: 'drop-shadow(0 0 8px #0077b5)' } }}
          name="LinkedIn Impressions"
          animationDuration={1800}
          animationEasing="ease-in-out"
        />
        <Line 
          type="monotone" 
          dataKey="instagram" 
          stroke="#E1306C" 
          strokeWidth={3.5}
          dot={{ fill: '#E1306C', r: 5, strokeWidth: 3, stroke: '#fff' }}
          activeDot={{ r: 7, strokeWidth: 3, stroke: '#fff', style: { filter: 'drop-shadow(0 0 8px #E1306C)' } }}
          name="Instagram Impressions"
          animationDuration={1800}
          animationEasing="ease-in-out"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
