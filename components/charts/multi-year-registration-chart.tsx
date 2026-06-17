'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { UniversalTooltip } from './universal-tooltip'
import { useState } from 'react'
import { Badge } from "@/components/ui/badge"

interface MultiYearRegistrationChartProps {
  data: {
    week: string
    year2023?: number
    year2024?: number
    year2026?: number
  }[]
  passTypePercentages?: Record<number, { paidPercent: number, compPercent: number }>
}

type AttendeeFilter = 'total' | 'paid' | 'comp'

export function MultiYearRegistrationChart({ data, passTypePercentages }: MultiYearRegistrationChartProps) {
  const [filter, setFilter] = useState<AttendeeFilter>('total')

  if (!data || data.length === 0) {
    return (
      <Card className="glass-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle>2023 - 2026 Paid Registration</CardTitle>
          <CardDescription>Multi-year registration comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400">No registration data available</p>
        </CardContent>
      </Card>
    )
  }

  // Apply filter to data using real percentages from PassType data
  const filteredData = data.map(item => {
    const getMultiplier = (year: number) => {
      if (filter === 'total') return 1
      
      const percentages = passTypePercentages?.[year]
      if (!percentages) {
        // Fallback to default if no data available
        return filter === 'paid' ? 0.83 : 0.17
      }
      
      return filter === 'paid' ? percentages.paidPercent : percentages.compPercent
    }

    return {
      week: item.week,
      year2023: item.year2023 ? Math.round(item.year2023 * getMultiplier(2023)) : undefined,
      year2024: item.year2024 ? Math.round(item.year2024 * getMultiplier(2024)) : undefined,
      year2026: item.year2026 ? Math.round(item.year2026 * getMultiplier(2026)) : undefined
    }
  })

  return (
    <Card className="glass-card border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-50/10 dark:from-green-900/20 to-transparent border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
          <div>
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
              2023 - 2026 Registration Progress
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Weekly registration comparison across years (2023, 2024, 2026)
            </CardDescription>
          </div>
          
          {/* Filter Badges */}
          <div className="flex gap-2 flex-wrap">
            <Badge
              variant={filter === 'total' ? 'default' : 'outline'}
              className={`cursor-pointer transition-all ${
                filter === 'total' 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => setFilter('total')}
            >
              Total
            </Badge>
            <Badge
              variant={filter === 'paid' ? 'default' : 'outline'}
              className={`cursor-pointer transition-all ${
                filter === 'paid' 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => setFilter('paid')}
            >
              Paid Attendees
            </Badge>
            <Badge
              variant={filter === 'comp' ? 'default' : 'outline'}
              className={`cursor-pointer transition-all ${
                filter === 'comp' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={() => setFilter('comp')}
            >
              Complimentary
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="week" 
                stroke="#6b7280"
                style={{ fontSize: '12px', fontFamily: 'var(--font-geist-sans)' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px', fontFamily: 'var(--font-geist-sans)' }}
              />
              <Tooltip content={<UniversalTooltip />} />
              <Legend 
                wrapperStyle={{ 
                  fontSize: '13px', 
                  fontFamily: 'var(--font-geist-sans)',
                  paddingTop: '20px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="year2023" 
                name="2023"
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={800}
              />
              <Line 
                type="monotone" 
                dataKey="year2024" 
                name="2024"
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={800}
              />
              <Line 
                type="monotone" 
                dataKey="year2026" 
                name="2026"
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
