'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { UniversalTooltip } from './universal-tooltip'

interface RegistrationActualsVsGoalProps {
  compActual: number
  compGoal: number
  paidActual: number
  paidGoal: number
  year?: string
}

export function RegistrationActualsVsGoalChart({ 
  compActual, 
  compGoal, 
  paidActual, 
  paidGoal,
  year = '2025'
}: RegistrationActualsVsGoalProps) {
  const data = [
    {
      category: 'Comp',
      Actual: compActual,
      Goal: compGoal
    },
    {
      category: 'Paid',
      Actual: paidActual,
      Goal: paidGoal
    }
  ]

  return (
    <Card className="glass-card border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-50/10 dark:from-green-900/20 to-transparent border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
          Registrations: {year} Actuals vs. Goal
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Comp and Paid registration comparison
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="category" 
                stroke="#6b7280"
                style={{ fontSize: '13px', fontFamily: 'var(--font-geist-sans)', fontWeight: 600 }}
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
              <Bar 
                dataKey="Actual" 
                name="Actual"
                fill="#10b981" 
                radius={[8, 8, 0, 0]} 
                animationDuration={800}
                maxBarSize={80}
              />
              <Bar 
                dataKey="Goal" 
                name="Goal"
                fill="#6b7280" 
                radius={[8, 8, 0, 0]} 
                animationDuration={800}
                opacity={0.6}
                maxBarSize={80}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Actual</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {(compActual + paidActual).toLocaleString()}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Goal</p>
            <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              {(compGoal + paidGoal).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
