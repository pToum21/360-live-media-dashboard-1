'use client'

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { format } from 'date-fns'

interface PaidMediaChartProps {
  data: {
    weekStarting: Date
    liSpend: number | null
    liConversions: number | null
    metaSpend: number | null
    metaConversions: number | null
    googleSearchSpend: number | null
    googleSearchConversions: number | null
    googleDisplaySpend: number | null
    googleDisplayConversions: number | null
  }[]
}

export function PaidMediaChart({ data }: PaidMediaChartProps) {
  if (!data || data.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No paid media data available</div>
  }

  // Sort by date and prepare chart data
  const sortedData = [...data].sort((a, b) => new Date(a.weekStarting).getTime() - new Date(b.weekStarting).getTime())

  const spendData = sortedData.map(item => ({
    week: format(new Date(item.weekStarting), 'MMM dd'),
    LinkedIn: item.liSpend || 0,
    Meta: item.metaSpend || 0,
    'Google Search': item.googleSearchSpend || 0,
    'Google Display': item.googleDisplaySpend || 0,
  }))

  const conversionData = sortedData.map(item => ({
    week: format(new Date(item.weekStarting), 'MMM dd'),
    LinkedIn: item.liConversions || 0,
    Meta: item.metaConversions || 0,
    'Google Search': item.googleSearchConversions || 0,
    'Google Display': item.googleDisplayConversions || 0,
  }))

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Weekly Spend by Platform</h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spendData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="week" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value) => value ? `$${Number(value).toLocaleString()}` : '$0'}
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="LinkedIn" stackId="a" fill="#0077B5" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Meta" stackId="a" fill="#1877F2" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Google Search" stackId="a" fill="#4285F4" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Google Display" stackId="a" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Weekly Conversions by Platform</h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="week" 
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
              <Line 
                type="monotone" 
                dataKey="LinkedIn" 
                stroke="#0077B5" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="Meta" 
                stroke="#1877F2" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="Google Search" 
                stroke="#4285F4" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="Google Display" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
