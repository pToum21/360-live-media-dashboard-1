'use client'

// Universal Tooltip Component for ALL Charts
// Consistent styling, always readable, matches Apple Liquid Glass aesthetic

interface UniversalTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
  valueFormatter?: (value: number) => string
  showTotal?: boolean
}

export function UniversalTooltip({ 
  active, 
  payload, 
  label,
  valueFormatter = (value) => value.toLocaleString(),
  showTotal = false
}: UniversalTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const total = showTotal 
    ? payload.reduce((sum, entry) => sum + (Number(entry.value) || 0), 0)
    : 0

  return (
    <div className="bg-white dark:bg-gray-900 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 min-w-[200px] animate-in fade-in-0 zoom-in-95 duration-200">
      {/* Label/Title */}
      {label && (
        <p className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-sm pb-2 border-b border-gray-200 dark:border-gray-700">
          {label}
        </p>
      )}
      
      {/* Total (if showing) */}
      {showTotal && total > 0 && (
        <div className="mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            Total: <strong className="text-gray-900 dark:text-gray-100">{valueFormatter(total)}</strong>
          </span>
        </div>
      )}

      {/* Payload Items */}
      <div className="space-y-2">
        {payload.map((entry, index) => {
          if (!entry.value && entry.value !== 0) return null
          
          const percentage = showTotal && total > 0 
            ? ((Number(entry.value) / total) * 100).toFixed(1)
            : null

          // Get the color from various possible properties
          const color = entry.color || entry.stroke || entry.fill || entry.payload?.fill || '#10b981'
          
          return (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {/* Color Indicator */}
                <div 
                  className="w-3 h-3 rounded-sm flex-shrink-0 shadow-sm border border-gray-300 dark:border-gray-600" 
                  style={{ backgroundColor: color }}
                />
                
                {/* Name */}
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate">
                  {entry.name}:
                </span>
              </div>
              
              {/* Value */}
              <div className="flex flex-col items-end flex-shrink-0">
                <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                  {valueFormatter(Number(entry.value))}
                </span>
                {percentage && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {percentage}%
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Specialized tooltip formatters
export const currencyFormatter = (value: number) => `$${value.toLocaleString()}`
export const percentFormatter = (value: number) => `${value.toFixed(1)}%`
export const numberFormatter = (value: number) => value.toLocaleString()
