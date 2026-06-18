'use client'

import { useState, useMemo, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend, LineChart, Line } from 'recharts'
import { ChartFilters, FilterGroup } from './chart-filters'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface EmailCampaignData {
  name: string
  openRate: number
  clickRate: number
  deliveryRate: number
  unsubscribeRate: number
  audience?: string | null
  campaignType?: string | null
  deploymentDate: Date
}

interface FilterableEmailChartProps {
  data: EmailCampaignData[]
}

export function FilterableEmailChart({ data }: FilterableEmailChartProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Extract unique audiences and campaign types from data
  const filterGroups: FilterGroup[] = useMemo(() => {
    const audiencesRaw = data.map(d => d.audience ?? '(No Audience)')
    const audiences = [...new Set(audiencesRaw)]
    const campaignTypesRaw = data.map(d => d.campaignType ?? '(No Type)')
    const campaignTypes = [...new Set(campaignTypesRaw)]

    const groups: FilterGroup[] = []

    if (audiences.length > 0) {
      groups.push({
        id: 'audience',
        label: 'Audience',
        multiSelect: true,
        options: audiences.map(a => ({
          id: a,
          label: a,
          value: a,
          color: getAudienceColor(a),
        })),
      })
    }

    if (campaignTypes.length > 0) {
      groups.push({
        id: 'campaignType',
        label: 'Campaign Type',
        multiSelect: true,
        options: campaignTypes.map(c => ({
          id: c,
          label: c,
          value: c,
        })),
      })
    }

    groups.push({
      id: 'metric',
      label: 'Metrics',
      multiSelect: true,
      options: [
        { id: 'openRate', label: 'Open Rate', value: 'openRate' },
        { id: 'clickRate', label: 'Click Rate', value: 'clickRate' },
        { id: 'deliveryRate', label: 'Delivery Rate', value: 'deliveryRate' },
      ],
    })

    return groups
  }, [data])

  // Initialize with all options selected by default
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(() => {
    const audiencesRaw = data.map(d => d.audience ?? '(No Audience)')
    const audiences = [...new Set(audiencesRaw)]
    const campaignTypesRaw = data.map(d => d.campaignType ?? '(No Type)')
    const campaignTypes = [...new Set(campaignTypesRaw)]
    
    return {
      audience: audiences,
      campaignType: campaignTypes,
      metric: ['openRate', 'clickRate', 'deliveryRate'],
    }
  })
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar')
  
  // Reset filters when data changes (e.g., when switching campaign type filter at page level)
  useEffect(() => {
    const audiencesRaw = data.map(d => d.audience ?? '(No Audience)')
    const audiences = [...new Set(audiencesRaw)]
    const campaignTypesRaw = data.map(d => d.campaignType ?? '(No Type)')
    const campaignTypes = [...new Set(campaignTypesRaw)]
    
    setSelectedFilters(prev => ({
      audience: audiences.length > 0 ? audiences : prev.audience || [],
      campaignType: campaignTypes.length > 0 ? campaignTypes : prev.campaignType || [],
      metric: ['openRate', 'clickRate', 'deliveryRate'],
    }))
  }, [data])

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    let filtered = [...data]

    // Get all available options from the actual data
    const allAudiencesRaw = data.map(d => d.audience ?? '(No Audience)')
    const allAudiences = [...new Set(allAudiencesRaw)]
    const allCampaignTypesRaw = data.map(d => d.campaignType ?? '(No Type)')
    const allCampaignTypes = [...new Set(allCampaignTypesRaw)]

    // Only apply audience filter if:
    // 1. There are filter selections
    // 2. Not all options are selected (partial filter)
    if (selectedFilters.audience && selectedFilters.audience.length > 0 && 
        selectedFilters.audience.length < allAudiences.length && allAudiences.length > 0) {
      filtered = filtered.filter(d => {
        const normalizedAudience = d.audience ?? '(No Audience)'
        return selectedFilters.audience.includes(normalizedAudience)
      })
    }

    // Only apply campaign type filter if:
    // 1. There are filter selections
    // 2. Not all options are selected (partial filter)
    if (selectedFilters.campaignType && selectedFilters.campaignType.length > 0 && 
        selectedFilters.campaignType.length < allCampaignTypes.length && allCampaignTypes.length > 0) {
      filtered = filtered.filter(d => {
        const normalizedType = d.campaignType ?? '(No Type)'
        return selectedFilters.campaignType.includes(normalizedType)
      })
    }

    return filtered
  }, [data, selectedFilters])

  // Calculate averages for filtered data
  const averages = useMemo(() => {
    if (filteredData.length === 0) return null

    return {
      openRate: filteredData.reduce((sum, d) => sum + d.openRate, 0) / filteredData.length,
      clickRate: filteredData.reduce((sum, d) => sum + d.clickRate, 0) / filteredData.length,
      deliveryRate: filteredData.reduce((sum, d) => sum + d.deliveryRate, 0) / filteredData.length,
      unsubscribeRate: filteredData.reduce((sum, d) => sum + d.unsubscribeRate, 0) / filteredData.length,
    }
  }, [filteredData])

  // Group by audience only if specific audiences are selected (not all)
  const chartData = useMemo(() => {
    const selectedMetrics = selectedFilters.metric || ['openRate', 'clickRate']
    
    // Get all available audiences
    const allAudiencesRaw = data.map(d => d.audience ?? '(No Audience)')
    const allAudiences = [...new Set(allAudiencesRaw)]
    
    // Only group by audience if a subset is selected (not all audiences)
    const shouldGroupByAudience = selectedFilters.audience && 
                                   selectedFilters.audience.length > 0 && 
                                   selectedFilters.audience.length < allAudiences.length &&
                                   allAudiences.length > 1
    
    if (shouldGroupByAudience) {
      // Show data grouped by selected audiences
      return selectedFilters.audience.map(audience => {
        const audienceData = filteredData.filter(d => {
          const normalizedAudience = d.audience ?? '(No Audience)'
          return normalizedAudience === audience
        })
        return {
          name: audience,
          openRate: audienceData.length > 0 ? audienceData.reduce((sum, d) => sum + d.openRate, 0) / audienceData.length : 0,
          clickRate: audienceData.length > 0 ? audienceData.reduce((sum, d) => sum + d.clickRate, 0) / audienceData.length : 0,
          deliveryRate: audienceData.length > 0 ? audienceData.reduce((sum, d) => sum + d.deliveryRate, 0) / audienceData.length : 0,
        }
      })
    } else {
      // Show individual campaigns (take most recent 50 for performance)
      return filteredData.slice(0, 50).map(d => ({
        name: d.name.replace('360 - ', '').replace(' Mission Brief', '').substring(0, 20),
        openRate: d.openRate,
        clickRate: d.clickRate,
        deliveryRate: d.deliveryRate,
      }))
    }
  }, [filteredData, selectedFilters, data])

  const handleFilterChange = (groupId: string, selectedValues: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      [groupId]: selectedValues,
    }))
  }

  const handleClearAll = () => {
    const audiencesRaw = data.map(d => d.audience ?? '(No Audience)')
    const audiences = [...new Set(audiencesRaw)]
    const campaignTypesRaw = data.map(d => d.campaignType ?? '(No Type)')
    const campaignTypes = [...new Set(campaignTypesRaw)]
    
    setSelectedFilters({
      audience: audiences,
      campaignType: campaignTypes,
      metric: ['openRate', 'clickRate', 'deliveryRate'],
    })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-5 rounded-xl shadow-2xl border border-blue-100/50 dark:border-blue-900/50">
          <p className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-sm tracking-wide uppercase">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6 py-1.5">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-3.5 h-3.5 rounded shadow-lg" 
                  style={{ 
                    backgroundColor: entry.color,
                    boxShadow: `0 0 10px ${entry.color}40`
                  }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{entry.name}:</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-gray-100 text-base">
                {(entry.value * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'openRate': return { gradient: 'url(#barGradientGreen)', base: '#10b981' }
      case 'clickRate': return { gradient: 'url(#barGradientBlue)', base: '#3b82f6' }
      case 'deliveryRate': return { gradient: 'url(#barGradientPurple)', base: '#8b5cf6' }
      default: return { gradient: 'url(#barGradientGreen)', base: '#10b981' }
    }
  }

  const selectedMetrics = selectedFilters.metric && selectedFilters.metric.length > 0 
    ? selectedFilters.metric 
    : ['openRate', 'clickRate']

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
            onClick={() => setChartType('bar')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              chartType === 'bar'
                ? 'bg-[#2E8741] text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Bar Chart
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

      {/* Summary Stats */}
      {averages && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Avg Open Rate', value: averages.openRate, icon: TrendingUp, color: 'text-green-600' },
            { label: 'Avg Click Rate', value: averages.clickRate, icon: TrendingUp, color: 'text-blue-600' },
            { label: 'Avg Delivery', value: averages.deliveryRate, icon: TrendingUp, color: 'text-purple-600' },
            { label: 'Avg Unsub', value: averages.unsubscribeRate, icon: TrendingDown, color: 'text-red-600' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{stat.label}</span>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {(stat.value * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        {chartType === 'bar' ? (
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 70 }}>
            <defs>
              <linearGradient id="barGradientGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                <stop offset="100%" stopColor="#059669" stopOpacity={0.9}/>
              </linearGradient>
              <linearGradient id="barGradientBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.9}/>
              </linearGradient>
              <linearGradient id="barGradientPurple" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.9}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} opacity={0.5} />
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(46, 135, 65, 0.05)' }} />
            <Legend 
              verticalAlign="top" 
              height={50}
              iconType="rect"
              iconSize={14}
              wrapperStyle={{ paddingBottom: '15px', fontSize: '13px' }}
              formatter={(value) => <span className="text-gray-700 dark:text-gray-300 font-semibold">{value}</span>}
            />
            {selectedMetrics.includes('openRate') && (
              <Bar dataKey="openRate" fill={getMetricColor('openRate').gradient} name="Open Rate" radius={[10, 10, 0, 0]} maxBarSize={60} />
            )}
            {selectedMetrics.includes('clickRate') && (
              <Bar dataKey="clickRate" fill={getMetricColor('clickRate').gradient} name="Click Rate" radius={[10, 10, 0, 0]} maxBarSize={60} />
            )}
            {selectedMetrics.includes('deliveryRate') && (
              <Bar dataKey="deliveryRate" fill={getMetricColor('deliveryRate').gradient} name="Delivery Rate" radius={[10, 10, 0, 0]} maxBarSize={60} />
            )}
          </BarChart>
        ) : (
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 70 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} opacity={0.5} />
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={50}
              iconType="line"
              iconSize={14}
              wrapperStyle={{ paddingBottom: '15px', fontSize: '13px' }}
              formatter={(value) => <span className="text-gray-700 dark:text-gray-300 font-semibold">{value}</span>}
            />
            {selectedMetrics.includes('openRate') && (
              <Line type="monotone" dataKey="openRate" stroke="#10b981" strokeWidth={3} name="Open Rate" dot={{ r: 4 }} />
            )}
            {selectedMetrics.includes('clickRate') && (
              <Line type="monotone" dataKey="clickRate" stroke="#3b82f6" strokeWidth={3} name="Click Rate" dot={{ r: 4 }} />
            )}
            {selectedMetrics.includes('deliveryRate') && (
              <Line type="monotone" dataKey="deliveryRate" stroke="#8b5cf6" strokeWidth={3} name="Delivery Rate" dot={{ r: 4 }} />
            )}
          </LineChart>
        )}
      </ResponsiveContainer>

      {filteredData.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No data matches the selected filters
        </div>
      )}
    </div>
  )
}

function getAudienceColor(audience: string): string {
  const colors: Record<string, string> = {
    'Members': '#10b981',
    'Sponsors': '#3b82f6',
    'Attendees': '#f59e0b',
    'All': '#8b5cf6',
  }
  return colors[audience] || '#6b7280'
}
