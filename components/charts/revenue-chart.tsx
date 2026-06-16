'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface RevenueChartProps {
  data: {
    category: string | null
    projectedRevenue: number | null
    actualRevenue: number | null
  }[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  if (!data || data.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No revenue data available</div>
  }

  // Group by category and sum revenues
  const categoryData = data.reduce((acc, item) => {
    const category = item.category || 'Uncategorized'
    const existing = acc.find(c => c.category === category)
    
    if (existing) {
      existing.projected += item.projectedRevenue || 0
      existing.actual += item.actualRevenue || 0
    } else {
      acc.push({
        category,
        projected: item.projectedRevenue || 0,
        actual: item.actualRevenue || 0,
      })
    }
    return acc
  }, [] as { category: string, projected: number, actual: number }[])

  // Sort by projected revenue
  categoryData.sort((a, b) => b.projected - a.projected)

  const chartData = categoryData.map(item => ({
    name: item.category,
    Projected: Math.round(item.projected),
    Actual: Math.round(item.actual),
  }))

  return (
    <div className="h-[450px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(value) => `$${(value / 1000)}K`}
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
          <Bar dataKey="Projected" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          <Bar dataKey="Actual" fill="#10b981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
