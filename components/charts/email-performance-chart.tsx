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
        <div className="bg-white/95 backdrop-blur-md p-5 rounded-xl shadow-2xl border border-blue-100/50 animate-scale-in">
          <p className="font-bold text-gray-900 mb-3 text-sm tracking-wide uppercase">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6 py-1.5">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-3.5 h-3.5 rounded shadow-lg" 
                  style={{ 
                    backgroundColor: entry.color,
                    boxShadow: `0 0 10px ${entry.color}40`
                  }}
                />
                <span className="text-sm text-gray-600 font-medium">{entry.name}:</span>
              </div>
              <span className="font-bold text-gray-900 text-base">
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
        <defs>
          <linearGradient id="barGradientGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
            <stop offset="100%" stopColor="#059669" stopOpacity={0.9}/>
          </linearGradient>
          <linearGradient id="barGradientBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
            <stop offset="100%" stopColor="#2563eb" stopOpacity={0.9}/>
          </linearGradient>
          <linearGradient id="barGradientOrange" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity={1}/>
            <stop offset="100%" stopColor="#d97706" stopOpacity={0.9}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} opacity={0.5} />
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
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(46, 135, 65, 0.05)' }} />
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
          fill="url(#barGradientGreen)" 
          name="Open Rate"
          radius={[10, 10, 0, 0]}
          animationDuration={1500}
          animationEasing="ease-in-out"
          maxBarSize={60}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.openRate >= 0.15 ? 'url(#barGradientGreen)' : 'url(#barGradientOrange)'}
            />
          ))}
        </Bar>
        <Bar 
          dataKey="clickRate" 
          fill="url(#barGradientBlue)" 
          name="Click Rate"
          radius={[10, 10, 0, 0]}
          animationDuration={1500}
          animationEasing="ease-in-out"
          maxBarSize={60}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
