'use client'

import { useState, useMemo } from 'react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts'
import { ChartFilters, FilterGroup } from './chart-filters'
import { Users, MousePointerClick, Clock, TrendingUp } from 'lucide-react'

interface WebsiteMetricData {
  weekStarting: Date
  totalUsers: number
  newUsers: number
  avgEngagementTimeSec?: number | null
  healthScore?: number | null
  referral?: number | null
  organicSearch?: number | null
  direct?: number | null
  organicSocial?: number | null
  email?: number | null
}

interface FilterableWebsiteChartProps {
  data: WebsiteMetricData[]
}

const TRAFFIC_SOURCE_COLORS: Record<string, string> = {
  organicSearch: '#10b981',
  direct: '#3b82f6',
  referral: '#f59e0b',
  organicSocial: '#8b5cf6',
  email: '#ec4899',
}

export function FilterableWebsiteChart({ data }: FilterableWebsiteChartProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    metric: ['totalUsers', 'newUsers', 'engagement', 'healthScore'],
    view: ['trend'],
    timeRange: ['all'],
  })
  const [chartType, setChartType] = useState<'line' | 'area'>('line')

  const filterGroups: FilterGroup[] = [
    {
      id: 'metric',
      label: 'Metrics',
      multiSelect: true,
      options: [
        { id: 'totalUsers', label: 'Total Users', value: 'totalUsers' },
        { id: 'newUsers', label: 'New Users', value: 'newUsers' },
        { id: 'engagement', label: 'Engagement Time', value: 'engagement' },
        { id: 'healthScore', label: 'Health Score', value: 'healthScore' },
      ],
    },
    {
      id: 'view',
      label: 'View',
      multiSelect: false,
      options: [
        { id: 'trend', label: 'Trend Over Time', value: 'trend' },
        { id: 'traffic', label: 'Traffic Sources', value: 'traffic' },
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

  // Calculate current stats
  const currentStats = useMemo(() => {
    if (timeFilteredData.length === 0) return null

    const latest = timeFilteredData[timeFilteredData.length - 1]
    const avgEngagement = timeFilteredData
      .filter(d => d.avgEngagementTimeSec !== null)
      .reduce((sum, d) => sum + (d.avgEngagementTimeSec || 0), 0) / timeFilteredData.filter(d => d.avgEngagementTimeSec !== null).length

    const avgHealthScore = timeFilteredData
      .filter(d => d.healthScore !== null)
      .reduce((sum, d) => sum + (d.healthScore || 0), 0) / timeFilteredData.filter(d => d.healthScore !== null).length

    return {
      totalUsers: latest.totalUsers || 0,
      newUsers: latest.newUsers || 0,
      avgEngagement: avgEngagement || 0,
      avgHealthScore: avgHealthScore || 0,
    }
  }, [timeFilteredData])

  // Format trend chart data
  const trendChartData = useMemo(() => {
    const selectedMetrics = selectedFilters.metric || []

    return timeFilteredData.map(d => {
      const point: any = {
        name: new Date(d.weekStarting).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      }

      if (selectedMetrics.includes('totalUsers')) point.totalUsers = d.totalUsers
      if (selectedMetrics.includes('newUsers')) point.newUsers = d.newUsers
      if (selectedMetrics.includes('engagement') && d.avgEngagementTimeSec) {
        point.engagement = Math.round(d.avgEngagementTimeSec / 60) // Convert to minutes
      }
      if (selectedMetrics.includes('healthScore') && d.healthScore) {
        point.healthScore = d.healthScore * 100 // Convert to percentage
      }

      return point
    })
  }, [timeFilteredData, selectedFilters])

  // Format traffic source data
  const trafficSourceData = useMemo(() => {
    const latest = timeFilteredData[timeFilteredData.length - 1]
    if (!latest) return []

    return [
      { name: 'Organic Search', value: latest.organicSearch || 0, color: TRAFFIC_SOURCE_COLORS.organicSearch },
      { name: 'Direct', value: latest.direct || 0, color: TRAFFIC_SOURCE_COLORS.direct },
      { name: 'Referral', value: latest.referral || 0, color: TRAFFIC_SOURCE_COLORS.referral },
      { name: 'Organic Social', value: latest.organicSocial || 0, color: TRAFFIC_SOURCE_COLORS.organicSocial },
      { name: 'Email', value: latest.email || 0, color: TRAFFIC_SOURCE_COLORS.email },
    ].filter(item => item.value > 0)
  }, [timeFilteredData])

  const handleFilterChange = (groupId: string, selectedValues: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      [groupId]: selectedValues,
    }))
  }

  const handleClearAll = () => {
    setSelectedFilters({
      metric: ['totalUsers', 'newUsers', 'engagement', 'healthScore'],
      view: ['trend'],
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
                {entry.name.includes('Score') ? `${entry.value.toFixed(1)}%` : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  const selectedView = selectedFilters.view?.[0] || 'trend'

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

        {selectedView === 'trend' && (
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
              onClick={() => setChartType('area')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                chartType === 'area'
                  ? 'bg-[#2E8741] text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Area Chart
            </button>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {currentStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Users</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {currentStats.totalUsers.toLocaleString()}
            </div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">New Users</span>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {currentStats.newUsers.toLocaleString()}
            </div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Avg Engagement</span>
              <Clock className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(currentStats.avgEngagement / 60)}m
            </div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Health Score</span>
              <MousePointerClick className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {(currentStats.avgHealthScore * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        {selectedView === 'trend' ? (
          chartType === 'line' ? (
            <LineChart data={trendChartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
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
              {selectedFilters.metric?.includes('totalUsers') && (
                <Line type="monotone" dataKey="totalUsers" name="Total Users" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              )}
              {selectedFilters.metric?.includes('newUsers') && (
                <Line type="monotone" dataKey="newUsers" name="New Users" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              )}
              {selectedFilters.metric?.includes('engagement') && (
                <Line type="monotone" dataKey="engagement" name="Engagement (min)" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
              )}
              {selectedFilters.metric?.includes('healthScore') && (
                <Line type="monotone" dataKey="healthScore" name="Health Score (%)" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
              )}
            </LineChart>
          ) : (
            <AreaChart data={trendChartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="totalUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="newUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
              {selectedFilters.metric?.includes('totalUsers') && (
                <Area type="monotone" dataKey="totalUsers" name="Total Users" stroke="#3b82f6" fillOpacity={1} fill="url(#totalUsers)" strokeWidth={2} />
              )}
              {selectedFilters.metric?.includes('newUsers') && (
                <Area type="monotone" dataKey="newUsers" name="New Users" stroke="#10b981" fillOpacity={1} fill="url(#newUsers)" strokeWidth={2} />
              )}
            </AreaChart>
          )
        ) : (
          <PieChart>
            <Pie
              data={trafficSourceData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {trafficSourceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        )}
      </ResponsiveContainer>

      {trendChartData.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No data matches the selected filters
        </div>
      )}
    </div>
  )
}
