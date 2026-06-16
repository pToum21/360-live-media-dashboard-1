'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts'
import { format } from 'date-fns'

interface RegistrationChartProps {
  data: {
    date: Date
    totalRegistrations: number
    registrationGoal: number | null
    percentOfGoal: number | null
  }[]
}

export function RegistrationChart({ data }: RegistrationChartProps) {
  if (!data || data.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No registration data available</div>
  }

  // Sort by date
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const chartData = sortedData.map(item => ({
    date: format(new Date(item.date), 'MMM dd'),
    registrations: item.totalRegistrations,
    goal: item.registrationGoal || 0,
  }))

  return (
    <div className="space-y-8">
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: 'none',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="registrations"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorRegistrations)"
              strokeWidth={2}
            />
            {chartData.some(d => d.goal > 0) && (
              <Line
                type="monotone"
                dataKey="goal"
                stroke="#f59e0b"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
