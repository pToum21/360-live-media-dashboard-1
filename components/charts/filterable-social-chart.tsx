'use client'

import { useState, useMemo, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { ChartFilters, FilterGroup } from './chart-filters'
import { TrendingUp, Users as UsersIcon, Eye } from 'lucide-react'

interface SocialMetricData {
  weekStarting: Date
  // LinkedIn
  liFollowers?: number | null
  liImpressions?: number | null
  liEngagementRate?: number | null
  // Instagram
  igFollowers?: number | null
  igImpressions?: number | null
  igEngagementRate?: number | null
  // Facebook
  fbFollowers?: number | null
  fbImpressions?: number | null
  fbEngagements?: number | null
  fbFollowerGrowthRate?: number | null
  // X/Twitter
  xFollowers?: number | null
  xImpressions?: number | null
  xEngagements?: number | null
  xFollowerGrowthRate?: number | null
}

interface FilterableSocialChartProps {
  data: SocialMetricData[]
}

export function FilterableSocialChart({ data }: FilterableSocialChartProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Dynamically detect which platforms have data
  const availablePlatforms = useMemo(() => {
    const platforms: { id: string; label: string; value: string; color: string }[] = []
    
    const hasLinkedIn = data.some(d => d.liFollowers || d.liImpressions || d.liEngagementRate)
    const hasInstagram = data.some(d => d.igFollowers || d.igImpressions || d.igEngagementRate)
    const hasFacebook = data.some(d => d.fbFollowers || d.fbImpressions || d.fbEngagements)
    const hasX = data.some(d => d.xFollowers || d.xImpressions || d.xEngagements)
    
    if (hasLinkedIn) platforms.push({ id: 'linkedin', label: 'LinkedIn', value: 'LinkedIn', color: '#0077b5' })
    if (hasInstagram) platforms.push({ id: 'instagram', label: 'Instagram', value: 'Instagram', color: '#E4405F' })
    if (hasFacebook) platforms.push({ id: 'facebook', label: 'Facebook', value: 'Facebook', color: '#1877F2' })
    if (hasX) platforms.push({ id: 'x', label: 'X (Twitter)', value: 'X', color: '#000000' })
    
    return platforms
  }, [data])

  // Initialize with all available platforms
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(() => ({
    platform: availablePlatforms.map(p => p.value),
    metric: ['followers', 'impressions', 'engagement'],
    timeRange: ['all'],
  }))
  const [chartType, setChartType] = useState<'bar' | 'line'>('line')

  const filterGroups: FilterGroup[] = [
    {
      id: 'platform',
      label: 'Platform',
      multiSelect: true,
      options: availablePlatforms,
    },
    {
      id: 'metric',
      label: 'Metrics',
      multiSelect: true,
      options: [
        { id: 'followers', label: 'Followers', value: 'followers' },
        { id: 'impressions', label: 'Impressions', value: 'impressions' },
        { id: 'engagement', label: 'Engagement Rate', value: 'engagement' },
      ],
    },
    {
      id: 'timeRange',
      label: 'Time Range',
      multiSelect: false,
      options: [
        { id: 'all', label: 'All Time', value: 'all' },
        { id: '4weeks', label: 'Last 4 Weeks', value: '4weeks' },
        { id: '8weeks', label: 'Last 8 Weeks', value: '8weeks' },
        { id: '12weeks', label: 'Last 12 Weeks', value: '12weeks' },
      ],
    },
  ]

  // Filter data by time range
  const timeFilteredData = useMemo(() => {
    const timeRange = selectedFilters.timeRange?.[0] || 'all'
    if (timeRange === 'all') return data

    const weeks = parseInt(timeRange)
    return data.slice(-weeks)
  }, [data, selectedFilters.timeRange])

  // Calculate current averages for ALL platforms
  const currentStats = useMemo(() => {
    if (timeFilteredData.length === 0) return null

    const latest = timeFilteredData[timeFilteredData.length - 1]
    
    const calcAvgEngagement = (field: keyof SocialMetricData) => {
      const validData = timeFilteredData.filter(d => d[field] !== null && d[field] !== undefined)
      if (validData.length === 0) return 0
      return validData.reduce((sum, d) => sum + (Number(d[field]) || 0), 0) / validData.length
    }

    return {
      // LinkedIn
      liFollowers: latest.liFollowers || 0,
      avgLiEngagement: calcAvgEngagement('liEngagementRate'),
      // Instagram
      igFollowers: latest.igFollowers || 0,
      avgIgEngagement: calcAvgEngagement('igEngagementRate'),
      // Facebook
      fbFollowers: latest.fbFollowers || 0,
      avgFbEngagement: latest.fbEngagements && latest.fbImpressions 
        ? (latest.fbEngagements / latest.fbImpressions) * 100 
        : 0,
      // X/Twitter
      xFollowers: latest.xFollowers || 0,
      avgXEngagement: latest.xEngagements && latest.xImpressions 
        ? (latest.xEngagements / latest.xImpressions) * 100 
        : 0,
    }
  }, [timeFilteredData])

  // Format chart data based on selected platforms and metrics
  const chartData = useMemo(() => {
    const selectedPlatforms = selectedFilters.platform || []
    const selectedMetrics = selectedFilters.metric || []

    return timeFilteredData.map(d => {
      const point: any = {
        name: new Date(d.weekStarting).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      }

      // LinkedIn
      if (selectedPlatforms.includes('LinkedIn')) {
        if (selectedMetrics.includes('followers') && d.liFollowers) point.liFollowers = d.liFollowers
        if (selectedMetrics.includes('impressions') && d.liImpressions) point.liImpressions = d.liImpressions
        if (selectedMetrics.includes('engagement') && d.liEngagementRate) point.liEngagement = d.liEngagementRate * 100
      }

      // Instagram
      if (selectedPlatforms.includes('Instagram')) {
        if (selectedMetrics.includes('followers') && d.igFollowers) point.igFollowers = d.igFollowers
        if (selectedMetrics.includes('impressions') && d.igImpressions) point.igImpressions = d.igImpressions
        if (selectedMetrics.includes('engagement') && d.igEngagementRate) point.igEngagement = d.igEngagementRate * 100
      }

      // Facebook
      if (selectedPlatforms.includes('Facebook')) {
        if (selectedMetrics.includes('followers') && d.fbFollowers) point.fbFollowers = d.fbFollowers
        if (selectedMetrics.includes('impressions') && d.fbImpressions) point.fbImpressions = d.fbImpressions
        if (selectedMetrics.includes('engagement') && d.fbEngagements && d.fbImpressions) {
          point.fbEngagement = (d.fbEngagements / d.fbImpressions) * 100
        }
      }

      // X/Twitter
      if (selectedPlatforms.includes('X')) {
        if (selectedMetrics.includes('followers') && d.xFollowers) point.xFollowers = d.xFollowers
        if (selectedMetrics.includes('impressions') && d.xImpressions) point.xImpressions = d.xImpressions
        if (selectedMetrics.includes('engagement') && d.xEngagements && d.xImpressions) {
          point.xEngagement = (d.xEngagements / d.xImpressions) * 100
        }
      }

      return point
    })
  }, [timeFilteredData, selectedFilters])

  const handleFilterChange = (groupId: string, selectedValues: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      [groupId]: selectedValues,
    }))
  }

  const handleClearAll = () => {
    setSelectedFilters({
      platform: availablePlatforms.map(p => p.value),
      metric: ['followers', 'impressions', 'engagement'],
      timeRange: ['all'],
    })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-5 rounded-xl shadow-2xl border border-blue-100/50 dark:border-blue-900/50">
          <p className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6 py-1.5">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-3.5 h-3.5 rounded shadow-lg" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{entry.name}:</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-gray-100">
                {entry.name.includes('Engagement') ? `${entry.value.toFixed(1)}%` : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  const getChartLines = () => {
    const lines = []
    const selectedPlatforms = selectedFilters.platform || []
    const selectedMetrics = selectedFilters.metric || []

    // LinkedIn
    if (selectedPlatforms.includes('LinkedIn')) {
      if (selectedMetrics.includes('followers')) {
        lines.push({ dataKey: 'liFollowers', name: 'LinkedIn Followers', stroke: '#0077b5', strokeWidth: 3 })
      }
      if (selectedMetrics.includes('impressions')) {
        lines.push({ dataKey: 'liImpressions', name: 'LinkedIn Impressions', stroke: '#0095d9', strokeWidth: 3 })
      }
      if (selectedMetrics.includes('engagement')) {
        lines.push({ dataKey: 'liEngagement', name: 'LinkedIn Engagement (%)', stroke: '#00a0e0', strokeWidth: 3 })
      }
    }

    // Instagram
    if (selectedPlatforms.includes('Instagram')) {
      if (selectedMetrics.includes('followers')) {
        lines.push({ dataKey: 'igFollowers', name: 'Instagram Followers', stroke: '#E4405F', strokeWidth: 3 })
      }
      if (selectedMetrics.includes('impressions')) {
        lines.push({ dataKey: 'igImpressions', name: 'Instagram Impressions', stroke: '#F56040', strokeWidth: 3 })
      }
      if (selectedMetrics.includes('engagement')) {
        lines.push({ dataKey: 'igEngagement', name: 'Instagram Engagement (%)', stroke: '#F77737', strokeWidth: 3 })
      }
    }

    // Facebook
    if (selectedPlatforms.includes('Facebook')) {
      if (selectedMetrics.includes('followers')) {
        lines.push({ dataKey: 'fbFollowers', name: 'Facebook Followers', stroke: '#1877F2', strokeWidth: 3 })
      }
      if (selectedMetrics.includes('impressions')) {
        lines.push({ dataKey: 'fbImpressions', name: 'Facebook Impressions', stroke: '#4267B2', strokeWidth: 3 })
      }
      if (selectedMetrics.includes('engagement')) {
        lines.push({ dataKey: 'fbEngagement', name: 'Facebook Engagement (%)', stroke: '#3b5998', strokeWidth: 3 })
      }
    }

    // X/Twitter
    if (selectedPlatforms.includes('X')) {
      if (selectedMetrics.includes('followers')) {
        lines.push({ dataKey: 'xFollowers', name: 'X Followers', stroke: '#000000', strokeWidth: 3 })
      }
      if (selectedMetrics.includes('impressions')) {
        lines.push({ dataKey: 'xImpressions', name: 'X Impressions', stroke: '#333333', strokeWidth: 3 })
      }
      if (selectedMetrics.includes('engagement')) {
        lines.push({ dataKey: 'xEngagement', name: 'X Engagement (%)', stroke: '#666666', strokeWidth: 3 })
      }
    }

    return lines
  }

  if (!isClient) {
    return <div className="h-[400px] flex items-center justify-center text-muted-foreground">Loading chart...</div>
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <ChartFilters
          filterGroups={filterGroups}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAll}
        />

        <div className="flex gap-2">
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
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              chartType === 'bar'
                ? 'bg-[#2E8741] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Bar Chart
          </button>
        </div>
      </div>

      {/* Summary Stats - Dynamic for all platforms */}
      {currentStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* LinkedIn */}
          {selectedFilters.platform?.includes('LinkedIn') && currentStats.liFollowers > 0 && (
            <>
              <div className="glass-card p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">LinkedIn Followers</span>
                  <UsersIcon className="w-4 h-4 text-[#0077b5]" />
                </div>
                <div className="text-2xl font-bold text-[#0077b5]">
                  {currentStats.liFollowers.toLocaleString()}
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">LinkedIn Engagement</span>
                  <TrendingUp className="w-4 h-4 text-[#0077b5]" />
                </div>
                <div className="text-2xl font-bold text-[#0077b5]">
                  {(currentStats.avgLiEngagement * 100).toFixed(1)}%
                </div>
              </div>
            </>
          )}
          
          {/* Instagram */}
          {selectedFilters.platform?.includes('Instagram') && currentStats.igFollowers > 0 && (
            <>
              <div className="glass-card p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Instagram Followers</span>
                  <UsersIcon className="w-4 h-4 text-[#E4405F]" />
                </div>
                <div className="text-2xl font-bold text-[#E4405F]">
                  {currentStats.igFollowers.toLocaleString()}
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Instagram Engagement</span>
                  <TrendingUp className="w-4 h-4 text-[#E4405F]" />
                </div>
                <div className="text-2xl font-bold text-[#E4405F]">
                  {(currentStats.avgIgEngagement * 100).toFixed(1)}%
                </div>
              </div>
            </>
          )}

          {/* Facebook */}
          {selectedFilters.platform?.includes('Facebook') && currentStats.fbFollowers > 0 && (
            <>
              <div className="glass-card p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Facebook Followers</span>
                  <UsersIcon className="w-4 h-4 text-[#1877F2]" />
                </div>
                <div className="text-2xl font-bold text-[#1877F2]">
                  {currentStats.fbFollowers.toLocaleString()}
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Facebook Engagement</span>
                  <TrendingUp className="w-4 h-4 text-[#1877F2]" />
                </div>
                <div className="text-2xl font-bold text-[#1877F2]">
                  {currentStats.avgFbEngagement.toFixed(1)}%
                </div>
              </div>
            </>
          )}

          {/* X/Twitter */}
          {selectedFilters.platform?.includes('X') && currentStats.xFollowers > 0 && (
            <>
              <div className="glass-card p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">X Followers</span>
                  <UsersIcon className="w-4 h-4 text-black dark:text-white" />
                </div>
                <div className="text-2xl font-bold text-black dark:text-white">
                  {currentStats.xFollowers.toLocaleString()}
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">X Engagement</span>
                  <TrendingUp className="w-4 h-4 text-black dark:text-white" />
                </div>
                <div className="text-2xl font-bold text-black dark:text-white">
                  {currentStats.avgXEngagement.toFixed(1)}%
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        {chartType === 'line' ? (
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} opacity={0.5} />
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={50}
              iconType="line"
              iconSize={14}
              wrapperStyle={{ paddingBottom: '15px', fontSize: '13px' }}
            />
            {getChartLines().map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={line.stroke}
                strokeWidth={line.strokeWidth}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        ) : (
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} opacity={0.5} />
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={50}
              iconType="rect"
              iconSize={14}
              wrapperStyle={{ paddingBottom: '15px', fontSize: '13px' }}
            />
            {getChartLines().map((line) => (
              <Bar
                key={line.dataKey}
                dataKey={line.dataKey}
                name={line.name}
                fill={line.stroke}
                radius={[10, 10, 0, 0]}
                maxBarSize={60}
              />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>

      {chartData.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No data matches the selected filters
        </div>
      )}
    </div>
  )
}
