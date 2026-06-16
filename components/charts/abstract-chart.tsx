'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'

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
              dataKey="submissions" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 6 }}
              activeDot={{ r: 8 }}
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
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: 'none',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="submissions" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
