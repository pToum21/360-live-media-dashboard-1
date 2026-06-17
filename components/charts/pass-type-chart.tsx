'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { UniversalTooltip, numberFormatter } from './universal-tooltip'

interface PassTypeChartProps {
  data: {
    passTypeName: string
    registrationCount: number
    percentOfTotal: number | null
  }[]
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

export function PassTypeChart({ data }: PassTypeChartProps) {
  if (!data || data.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No pass type data available</div>
  }

  const chartData = data.map(item => ({
    name: item.passTypeName,
    value: item.registrationCount,
    percent: item.percentOfTotal ? (item.percentOfTotal * 100).toFixed(1) : '0'
  }))

  return (
    <div className="space-y-8">
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={120}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip content={<UniversalTooltip valueFormatter={numberFormatter} />} />
            <Bar dataKey="value" name="Registrations" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData.slice(0, 8)}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => {
                if (!name || percent === undefined) return ''
                return `${name}: ${(percent * 100).toFixed(0)}%`
              }}
              outerRadius={130}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
              style={{
                fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<UniversalTooltip valueFormatter={numberFormatter} showTotal />} />
            <Legend 
              wrapperStyle={{
                fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
                fontSize: '13px',
                fontWeight: 500,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
