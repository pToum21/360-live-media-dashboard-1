'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts'
import { MousePointerClick, TrendingUp } from 'lucide-react'

interface EmailHeatmapData {
  name: string
  totalClicks: number
  topButtonClicks: number
  topButtonClickPct: number
  topLogoClicks: number
  topLogoClickPct: number
  headerImageClicks: number
  headerImageClickPct: number
  bodyContentClicks: number
  bodyContentClickPct: number
  footerClicks: number
  footerClickPct: number
}

interface EmailHeatmapChartProps {
  data: EmailHeatmapData[]
}

const CLICK_ZONE_COLORS = {
  topButton: '#10b981',    // Green
  topLogo: '#3b82f6',      // Blue
  headerImage: '#f59e0b',  // Amber
  bodyContent: '#8b5cf6',  // Purple
  footer: '#ec4899',       // Pink
}

export function EmailHeatmapChart({ data }: EmailHeatmapChartProps) {
  if (!data || data.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No email heatmap data available</div>
  }

  // Calculate overall averages across all emails
  const avgTopButton = data.reduce((sum, d) => sum + (d.topButtonClickPct || 0), 0) / data.length
  const avgTopLogo = data.reduce((sum, d) => sum + (d.topLogoClickPct || 0), 0) / data.length
  const avgHeader = data.reduce((sum, d) => sum + (d.headerImageClickPct || 0), 0) / data.length
  const avgBody = data.reduce((sum, d) => sum + (d.bodyContentClickPct || 0), 0) / data.length
  const avgFooter = data.reduce((sum, d) => sum + (d.footerClickPct || 0), 0) / data.length
  const totalClicks = data.reduce((sum, d) => sum + (d.totalClicks || 0), 0)

  // Format data for stacked bar chart - top 10 emails with most clicks
  const sortedData = [...data]
    .filter(d => d.totalClicks > 0)
    .sort((a, b) => b.totalClicks - a.totalClicks)
    .slice(0, 10)
    .map(d => ({
      name: d.name.replace('Call for Proposals Email', 'CFP').substring(0, 30),
      'Top Button': d.topButtonClicks || 0,
      'Top Logo': d.topLogoClicks || 0,
      'Header Image': d.headerImageClicks || 0,
      'Body Content': d.bodyContentClicks || 0,
      'Footer': d.footerClicks || 0,
    }))
    .reverse() // Show highest at top

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0)
      return (
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-5 rounded-xl shadow-2xl border border-blue-100/50 dark:border-blue-900/50">
          <p className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-sm">{label}</p>
          <div className="mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400">Total Clicks: <strong>{total.toLocaleString()}</strong></span>
          </div>
          {payload.map((entry: any, index: number) => (
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
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Top Button', value: avgTopButton, color: 'text-green-600', bgColor: 'bg-green-100', iconColor: 'bg-green-600' },
          { label: 'Top Logo', value: avgTopLogo, color: 'text-blue-600', bgColor: 'bg-blue-100', iconColor: 'bg-blue-600' },
          { label: 'Header', value: avgHeader, color: 'text-amber-600', bgColor: 'bg-amber-100', iconColor: 'bg-amber-600' },
          { label: 'Body', value: avgBody, color: 'text-purple-600', bgColor: 'bg-purple-100', iconColor: 'bg-purple-600' },
          { label: 'Footer', value: avgFooter, color: 'text-pink-600', bgColor: 'bg-pink-100', iconColor: 'bg-pink-600' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{stat.label}</span>
              <div className={`w-8 h-8 ${stat.iconColor} rounded-lg flex items-center justify-center`}>
                <MousePointerClick className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {(stat.value * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Avg click share</p>
          </div>
        ))}
      </div>

      {/* Total Clicks Summary */}
      <div className="glass-card p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Clicks Across All Emails</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalClicks.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Stacked Bar Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Click Distribution by Email (Top 10)
        </h3>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedData} layout="vertical" margin={{ top: 20, right: 30, left: 150, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={140}
                tick={{ fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={50}
                iconType="rect"
                iconSize={14}
                wrapperStyle={{ paddingBottom: '15px', fontSize: '13px' }}
              />
              <Bar dataKey="Top Button" stackId="a" fill={CLICK_ZONE_COLORS.topButton} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Top Logo" stackId="a" fill={CLICK_ZONE_COLORS.topLogo} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Header Image" stackId="a" fill={CLICK_ZONE_COLORS.headerImage} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Body Content" stackId="a" fill={CLICK_ZONE_COLORS.bodyContent} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Footer" stackId="a" fill={CLICK_ZONE_COLORS.footer} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Insights */}
      <div className="glass-card p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">📊 Key Insights</h4>
        <div className="space-y-3 text-sm">
          {avgTopButton > 0.2 && (
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Primary CTA performs well:</strong> {(avgTopButton * 100).toFixed(1)}% of clicks go to the top button
              </p>
            </div>
          )}
          {avgHeader > avgTopButton && (
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5"></div>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Header image draws attention:</strong> {(avgHeader * 100).toFixed(1)}% click rate suggests strong visual engagement
              </p>
            </div>
          )}
          {avgFooter < 0.15 && (
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-pink-500 mt-1.5"></div>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Footer links underutilized:</strong> Only {(avgFooter * 100).toFixed(1)}% of clicks - consider relocating important CTAs
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
