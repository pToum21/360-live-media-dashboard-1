'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { UniversalTooltip, currencyFormatter } from './universal-tooltip'

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
          <Tooltip content={<UniversalTooltip valueFormatter={currencyFormatter} />} />
          <Legend 
            wrapperStyle={{
              fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
              fontSize: '13px',
              fontWeight: 500,
            }}
          />
          <Bar dataKey="Actual" name="Actual Revenue" fill="#10b981" radius={[8, 8, 0, 0]} animationDuration={800} />
          <Bar dataKey="Projected" name="Projected Revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} animationDuration={800} opacity={0.7} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
