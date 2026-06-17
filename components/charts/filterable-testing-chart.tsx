'use client'

import { useState, useMemo, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts'
import { ChartFilters, FilterGroup } from './chart-filters'
import { FlaskConical, Target, TrendingUp } from 'lucide-react'

interface TestData {
  id: string
  month: string
  channel: string | null
  controlTest: string | null
  testVariant: string | null
  results: string | null
  conclusions: string | null
}

interface FilterableTestingChartProps {
  data: TestData[]
}

const CHANNEL_COLORS: Record<string, string> = {
  'Email': '#10b981',
  'Website': '#3b82f6',
  'Social': '#8b5cf6',
  'Paid Media': '#f59e0b',
  'Content': '#ec4899',
  'Other': '#6b7280',
}

export function FilterableTestingChart({ data }: FilterableTestingChartProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Get all unique channels
  const allChannels = useMemo(() => {
    const channels = new Set(data.map(t => t.channel || 'Unknown').filter(Boolean))
    return Array.from(channels).sort()
  }, [data])

  // Initialize with all options selected by default
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(() => {
    const channels = Array.from(new Set(data.map(t => t.channel || 'Unknown').filter(Boolean)))
    return {
      view: ['timeline'],
      channel: channels,
      timeRange: ['all'],
    }
  })

  const filterGroups: FilterGroup[] = [
    {
      id: 'view',
      label: 'View',
      multiSelect: false,
      options: [
        { id: 'timeline', label: 'Tests Over Time', value: 'timeline' },
        { id: 'channel', label: 'By Channel', value: 'channel' },
        { id: 'trend', label: 'Testing Trend', value: 'trend' },
      ],
    },
    {
      id: 'channel',
      label: 'Filter by Channel',
      multiSelect: true,
      options: allChannels.map(ch => ({
        id: ch.toLowerCase(),
        label: ch,
        value: ch,
        color: CHANNEL_COLORS[ch] || CHANNEL_COLORS['Other'],
      })),
    },
    {
      id: 'timeRange',
      label: 'Time Range',
      multiSelect: false,
      options: [
        { id: 'all', label: 'All Time', value: 'all' },
        { id: '6months', label: 'Last 6 Months', value: '6' },
        { id: '12months', label: 'Last 12 Months', value: '12' },
        { id: '24months', label: 'Last 24 Months', value: '24' },
      ],
    },
  ]

  // Filter data by channel and time range
  const filteredData = useMemo(() => {
    let filtered = data

    // Filter by channel
    const selectedChannels = selectedFilters.channel
    if (selectedChannels && selectedChannels.length > 0) {
      filtered = filtered.filter(t => selectedChannels.includes(t.channel || 'Unknown'))
    }

    // Filter by time range (assuming month format like "Jan 2024")
    const timeRange = selectedFilters.timeRange?.[0]
    if (timeRange && timeRange !== 'all') {
      const months = parseInt(timeRange)
      filtered = filtered.slice(0, months)
    }

    return filtered
  }, [data, selectedFilters])

  // Calculate current stats
  const currentStats = useMemo(() => {
    const totalTests = filteredData.length
    const channelCount = new Set(filteredData.map(t => t.channel).filter(Boolean)).size
    const avgPerMonth = totalTests / 12

    return {
      totalTests,
      channelCount,
      avgPerMonth,
    }
  }, [filteredData])

  // Format timeline data (tests per month)
  const timelineData = useMemo(() => {
    const monthCounts: Record<string, number> = {}
    filteredData.forEach(test => {
      monthCounts[test.month] = (monthCounts[test.month] || 0) + 1
    })

    return Object.entries(monthCounts).map(([month, count]) => ({
      name: month,
      tests: count,
    }))
  }, [filteredData])

  // Format channel distribution data
  const channelData = useMemo(() => {
    const channelCounts: Record<string, number> = {}
    filteredData.forEach(test => {
      const channel = test.channel || 'Unknown'
      channelCounts[channel] = (channelCounts[channel] || 0) + 1
    })

    return Object.entries(channelCounts)
      .map(([channel, count]) => ({
        name: channel,
        value: count,
        color: CHANNEL_COLORS[channel] || CHANNEL_COLORS['Other'],
      }))
      .sort((a, b) => b.value - a.value)
  }, [filteredData])

  // Format cumulative trend data
  const trendData = useMemo(() => {
    let cumulative = 0
    const sorted = [...filteredData].reverse()
    const months = new Set<string>()
    
    return sorted.map(test => {
      if (!months.has(test.month)) {
        months.add(test.month)
        cumulative++
      }
      return {
        name: test.month,
        cumulative,
      }
    }).filter((item, index, arr) => {
      // Only keep unique months
      return index === arr.findIndex(t => t.name === item.name)
    })
  }, [filteredData])

  const handleFilterChange = (groupId: string, selectedValues: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      [groupId]: selectedValues,
    }))
  }

  const handleClearAll = () => {
    setSelectedFilters({
      view: ['timeline'],
      channel: allChannels,
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
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  const selectedView = selectedFilters.view?.[0] || 'timeline'

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
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Tests</span>
            <FlaskConical className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-teal-600">
            {currentStats.totalTests}
          </div>
        </div>
        <div className="glass-card p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Channels</span>
            <Target className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {currentStats.channelCount}
          </div>
        </div>
        <div className="glass-card p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Avg/Month</span>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">
            {currentStats.avgPerMonth.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        {selectedView === 'timeline' ? (
          <BarChart data={timelineData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} opacity={0.5} />
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dx={-10}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="tests" 
              name="Tests"
              fill="#14b8a6" 
              radius={[10, 10, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        ) : selectedView === 'channel' ? (
          <PieChart>
            <Pie
              data={channelData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {channelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        ) : (
          <LineChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} opacity={0.5} />
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dx={-10}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={50}
              iconType="line"
              iconSize={14}
              wrapperStyle={{ paddingBottom: '15px', fontSize: '13px' }}
            />
            <Line 
              type="monotone" 
              dataKey="cumulative" 
              name="Cumulative Tests"
              stroke="#14b8a6" 
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>

      {filteredData.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No tests match the selected filters
        </div>
      )}
    </div>
  )
}
