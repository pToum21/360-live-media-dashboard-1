"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface TrafficSourceChartProps {
  data: {
    name: string
    value: number
  }[]
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#ef4444']

export function TrafficSourceChart({ data }: TrafficSourceChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0]
      return (
        <div className="bg-white/95 backdrop-blur-md p-5 rounded-xl shadow-2xl border border-purple-100/50 animate-scale-in">
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-5 h-5 rounded-full shadow-lg" 
              style={{ 
                backgroundColor: item.payload.fill,
                boxShadow: `0 0 12px ${item.payload.fill}60`
              }}
            />
            <p className="font-bold text-gray-900 text-base">{item.name}</p>
          </div>
          <div className="flex items-center justify-between gap-6 border-t border-gray-100 pt-3 mt-2">
            <span className="text-sm text-gray-600 font-medium">Visitors:</span>
            <span className="font-bold text-lg text-gray-900">
              {item.value.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-6 mt-2">
            <span className="text-sm text-gray-600 font-medium">Percentage:</span>
            <span className="font-bold text-gray-900">
              {((item.value / data.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      )
    }
    return null
  }

  // Show placeholder if no data
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-sm font-medium">No traffic data available</p>
          <p className="text-xs mt-1">Data will appear once traffic sources are tracked</p>
        </div>
      </div>
    )
  }

  // Custom label for cleaner look
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null // Hide labels for small slices
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-semibold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={120}
          innerRadius={70}
          fill="#8884d8"
          dataKey="value"
          animationDuration={1500}
          animationBegin={0}
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]}
              style={{ 
                cursor: 'pointer',
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15))',
                transition: 'all 0.3s ease',
              }}
              stroke="#fff"
              strokeWidth={4}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="bottom" 
          height={60}
          iconType="circle"
          iconSize={10}
          formatter={(value) => <span style={{ color: '#374151', fontWeight: 500, fontSize: '13px' }}>{value}</span>}
          wrapperStyle={{ paddingTop: '20px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
