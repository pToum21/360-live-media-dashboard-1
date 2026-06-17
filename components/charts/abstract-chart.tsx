'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'
import { UniversalTooltip, numberFormatter } from './universal-tooltip'

interface AbstractChartProps {
  data: {
    year: number
    submissionCount: number
    submissionType: string | null
  }[]
}

export function AbstractChart({ data }: AbstractChartProps) {
  if (!data || data.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No abstract data available</div>
  }

  // Group by year and sum submissions
  const yearlyData = data.reduce((acc, item) => {
    const existingYear = acc.find(y => y.year === item.year)
    if (existingYear) {
      existingYear.submissions += item.submissionCount
    } else {
      acc.push({ year: item.year, submissions: item.submissionCount })
    }
    return acc
  }, [] as { year: number, submissions: number }[])

  yearlyData.sort((a, b) => a.year - b.year)

  return (
    <div className="space-y-8">
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={yearlyData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip content={<UniversalTooltip valueFormatter={numberFormatter} />} />
            <Legend 
              wrapperStyle={{
                fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
                fontSize: '13px',
                fontWeight: 500,
              }}
            />
            <Line 
              type="monotone" 
              dataKey="submissions"
              name="Submissions" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 6 }}
              activeDot={{ r: 8 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={yearlyData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip content={<UniversalTooltip valueFormatter={numberFormatter} />} />
            <Bar dataKey="submissions" name="Submissions" fill="#10b981" radius={[8, 8, 0, 0]} animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
