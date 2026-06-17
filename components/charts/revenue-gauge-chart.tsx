'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { DollarSign } from "lucide-react"

interface RevenueGaugeChartProps {
  actual: number
  target: number
  title?: string
  subtitle?: string
}

export function RevenueGaugeChart({ 
  actual, 
  target, 
  title = "Revenue Progress",
  subtitle
}: RevenueGaugeChartProps) {
  const percentage = Math.min((actual / target) * 100, 100)
  const remaining = Math.max(target - actual, 0)
  
  const data = [
    { name: 'Achieved', value: actual },
    { name: 'Remaining', value: remaining }
  ]

  // Color based on progress
  const getColor = () => {
    if (percentage >= 100) return '#10b981' // green
    if (percentage >= 75) return '#06b6d4' // cyan
    if (percentage >= 50) return '#3b82f6' // blue
    return '#6b7280' // gray
  }

  const COLORS = [getColor(), '#e5e7eb']

  return (
    <Card className="glass-card border-0 shadow-lg h-full">
      <CardHeader className="bg-gradient-to-r from-green-50/10 dark:from-green-900/20 to-transparent border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-md">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="relative h-[280px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={80}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center text overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center" style={{ marginTop: '40px' }}>
              <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                ${(actual / 1000).toFixed(0)}K
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                of ${(target / 1000).toFixed(0)}K
              </div>
              <div className="text-xs font-semibold mt-2" style={{ color: getColor() }}>
                {percentage.toFixed(1)}% Complete
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Actual</p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
              ${actual.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Target</p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
              ${target.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
