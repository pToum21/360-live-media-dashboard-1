'use client'

import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useState } from 'react'

interface GA4RegistrationData {
  weekLabel: string
  weeksOut: number
  organicSearch: number
  email: number
  direct: number
  paidSocial: number
  paidSearch: number
  referral: number
  organicSocial: number
  totalRegistrations: number
}

interface GA4RegistrationChartProps {
  data: GA4RegistrationData[]
}

const TRAFFIC_SOURCE_COLORS = {
  organicSearch: '#10b981',   // Green
  email: '#3b82f6',          // Blue
  direct: '#8b5cf6',         // Purple
  paidSocial: '#f59e0b',     // Amber
  paidSearch: '#06b6d4',     // Cyan
  referral: '#ec4899',       // Pink
  organicSocial: '#14b8a6',  // Teal
}

export function GA4RegistrationChart({ data }: GA4RegistrationChartProps) {
  const [chartType, setChartType] = useState<'area' | 'line'>('area')

  if (!data || data.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No GA4 registration data available</div>
  }

  // Sort by weeksOut descending (oldest to newest)
  const sortedData = [...data].sort((a, b) => b.weeksOut - a.weeksOut)

  // Format for chart
  const chartData = sortedData.map(d => ({
    week: d.weekLabel,
    'Organic Search': d.organicSearch || 0,
    'Email': d.email || 0,
    'Direct': d.direct || 0,
    'Paid Social': d.paidSocial || 0,
    'Paid Search': d.paidSearch || 0,
    'Referral': d.referral || 0,
    'Organic Social': d.organicSocial || 0,
  }))

  // Calculate totals and percentages for each source
  const sourceTotals = {
    organicSearch: sortedData.reduce((sum, d) => sum + (d.organicSearch || 0), 0),
    email: sortedData.reduce((sum, d) => sum + (d.email || 0), 0),
    direct: sortedData.reduce((sum, d) => sum + (d.direct || 0), 0),
    paidSocial: sortedData.reduce((sum, d) => sum + (d.paidSocial || 0), 0),
    paidSearch: sortedData.reduce((sum, d) => sum + (d.paidSearch || 0), 0),
    referral: sortedData.reduce((sum, d) => sum + (d.referral || 0), 0),
    organicSocial: sortedData.reduce((sum, d) => sum + (d.organicSocial || 0), 0),
  }
  const totalRegs = Object.values(sourceTotals).reduce((sum, val) => sum + val, 0)

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0)
      return (
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-5 rounded-xl shadow-2xl border border-blue-100/50 dark:border-blue-900/50">
          <p className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-sm">{label}</p>
          <div className="mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400">Total: <strong>{total.toLocaleString()}</strong> registrations</span>
          </div>
          {payload.map((entry: any, index: number) => (
            entry.value > 0 && (
              <div key={index} className="flex items-center justify-between gap-6 py-1.5">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-3.5 h-3.5 rounded shadow-lg" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{entry.name}:</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    {entry.value.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {((entry.value / total) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            )
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Organic Search', value: sourceTotals.organicSearch, color: 'text-green-600', bgColor: 'bg-green-600' },
          { label: 'Email', value: sourceTotals.email, color: 'text-blue-600', bgColor: 'bg-blue-600' },
          { label: 'Direct', value: sourceTotals.direct, color: 'text-purple-600', bgColor: 'bg-purple-600' },
          { label: 'Paid Social', value: sourceTotals.paidSocial, color: 'text-amber-600', bgColor: 'bg-amber-600' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{stat.label}</span>
              <div className={`w-2 h-8 ${stat.bgColor} rounded`}></div>
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {((stat.value / totalRegs) * 100).toFixed(1)}% of total
            </p>
          </div>
        ))}
      </div>

      {/* Chart Type Toggle */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Registrations by Traffic Source Over Time
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              chartType === 'area'
                ? 'bg-[#2E8741] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Area Chart
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              chartType === 'line'
                ? 'bg-[#2E8741] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Line Chart
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
              <defs>
                {Object.entries(TRAFFIC_SOURCE_COLORS).map(([key, color]) => (
                  <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.8}/>
                    <stop offset="100%" stopColor={color} stopOpacity={0.1}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="week" 
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 10 }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={50}
                iconType="rect"
                iconSize={14}
                wrapperStyle={{ paddingBottom: '15px', fontSize: '13px' }}
              />
              <Area type="monotone" dataKey="Organic Search" stackId="1" stroke={TRAFFIC_SOURCE_COLORS.organicSearch} fill="url(#gradient-organicSearch)" />
              <Area type="monotone" dataKey="Email" stackId="1" stroke={TRAFFIC_SOURCE_COLORS.email} fill="url(#gradient-email)" />
              <Area type="monotone" dataKey="Direct" stackId="1" stroke={TRAFFIC_SOURCE_COLORS.direct} fill="url(#gradient-direct)" />
              <Area type="monotone" dataKey="Paid Social" stackId="1" stroke={TRAFFIC_SOURCE_COLORS.paidSocial} fill="url(#gradient-paidSocial)" />
              <Area type="monotone" dataKey="Paid Search" stackId="1" stroke={TRAFFIC_SOURCE_COLORS.paidSearch} fill="url(#gradient-paidSearch)" />
              <Area type="monotone" dataKey="Referral" stackId="1" stroke={TRAFFIC_SOURCE_COLORS.referral} fill="url(#gradient-referral)" />
              <Area type="monotone" dataKey="Organic Social" stackId="1" stroke={TRAFFIC_SOURCE_COLORS.organicSocial} fill="url(#gradient-organicSocial)" />
            </AreaChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="week" 
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 10 }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={50}
                iconType="line"
                iconSize={14}
                wrapperStyle={{ paddingBottom: '15px', fontSize: '13px' }}
              />
              <Line type="monotone" dataKey="Organic Search" stroke={TRAFFIC_SOURCE_COLORS.organicSearch} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Email" stroke={TRAFFIC_SOURCE_COLORS.email} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Direct" stroke={TRAFFIC_SOURCE_COLORS.direct} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Paid Social" stroke={TRAFFIC_SOURCE_COLORS.paidSocial} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Paid Search" stroke={TRAFFIC_SOURCE_COLORS.paidSearch} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Referral" stroke={TRAFFIC_SOURCE_COLORS.referral} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Organic Social" stroke={TRAFFIC_SOURCE_COLORS.organicSocial} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Attribution Insights */}
      <div className="glass-card p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">🎯 Attribution Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">Top Performing Channels:</p>
            <ol className="space-y-1">
              {Object.entries(sourceTotals)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([source, value], idx) => (
                  <li key={source} className="flex items-center gap-2">
                    <span className="font-bold text-[#2E8741]">{idx + 1}.</span>
                    <span className="text-gray-700 dark:text-gray-300 capitalize">
                      {source.replace(/([A-Z])/g, ' $1').trim()}: {value} ({((value / totalRegs) * 100).toFixed(1)}%)
                    </span>
                  </li>
                ))}
            </ol>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">Total Registrations Tracked:</p>
            <p className="text-3xl font-bold text-[#2E8741]">{totalRegs.toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Across {sortedData.length} weeks</p>
          </div>
        </div>
      </div>
    </div>
  )
}
