"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend } from 'recharts'

interface WebsiteTrendChartProps {
  data: {
    week: string
    users: number
    newUsers: number
  }[]
}

export function WebsiteTrendChart({ data }: WebsiteTrendChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-5 rounded-xl shadow-2xl border border-green-100/50 dark:border-green-900/50 animate-scale-in">
          <p className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-sm tracking-wide uppercase">{label}</p>
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
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{entry.name}:</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-gray-100 text-base">
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
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.95}/>
            <stop offset="50%" stopColor="#10b981" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
          </linearGradient>
          <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.95}/>
            <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
          </linearGradient>
        </defs>
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
          verticalAlign="top" 
          height={50}
          iconType="rect"
          iconSize={14}
          wrapperStyle={{ paddingBottom: '10px', fontSize: '13px' }}
          formatter={(value) => <span className="text-gray-700 dark:text-gray-300 font-semibold">{value}</span>}
        />
        <Area 
          type="monotone" 
          dataKey="users" 
          stroke="#10b981" 
          strokeWidth={3.5}
          fillOpacity={1} 
          fill="url(#colorUsers)" 
          name="Total Users"
          animationDuration={1800}
          animationEasing="ease-in-out"
          dot={{ r: 5, fill: '#10b981', strokeWidth: 3, stroke: '#fff' }}
          activeDot={{ r: 7, fill: '#10b981', strokeWidth: 3, stroke: '#fff', style: { filter: 'drop-shadow(0 0 6px #10b981)' } }}
        />
        <Area 
          type="monotone" 
          dataKey="newUsers" 
          stroke="#3b82f6" 
          strokeWidth={3.5}
          fillOpacity={1} 
          fill="url(#colorNewUsers)" 
          name="New Users"
          animationDuration={1800}
          animationEasing="ease-in-out"
          dot={{ r: 5, fill: '#3b82f6', strokeWidth: 3, stroke: '#fff' }}
          activeDot={{ r: 7, fill: '#3b82f6', strokeWidth: 3, stroke: '#fff', style: { filter: 'drop-shadow(0 0 6px #3b82f6)' } }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
