'use client'

// Custom Pie Chart Label Component
// Modern, clean typography that matches the dashboard aesthetic

interface CustomPieLabelProps {
  cx?: number
  cy?: number
  midAngle?: number
  innerRadius?: number
  outerRadius?: number
  percent?: number
  name?: string
  value?: number
  [key: string]: any // Allow additional props from Recharts
}

export function CustomPieLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: CustomPieLabelProps) {
  // Guard against undefined values
  if (!cx || !cy || !midAngle || !outerRadius || !percent || !name) {
    return null
  }
  const RADIAN = Math.PI / 180
  const radius = outerRadius + 30
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  // Only show label if slice is big enough (>3%)
  if (percent < 0.03) return null

  return (
    <text
      x={x}
      y={y}
      fill="currentColor"
      className="text-sm font-semibold fill-gray-700 dark:fill-gray-300"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      style={{
        fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
        fontWeight: 600,
        letterSpacing: '-0.01em',
      }}
    >
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

// Alternative: Inner label for larger pies
export function CustomPieInnerLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: CustomPieLabelProps) {
  // Guard against undefined values
  if (!cx || !cy || !midAngle || !innerRadius || !outerRadius || !percent) {
    return null
  }
  
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  // Only show label if slice is big enough (>5%)
  if (percent < 0.05) return null

  return (
    <text
      x={x}
      y={y}
      fill="white"
      className="text-xs font-bold"
      textAnchor="middle"
      dominantBaseline="central"
      style={{
        fontFamily: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
        fontWeight: 700,
        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
      }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}
