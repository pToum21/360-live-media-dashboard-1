'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts'
import { Target, TrendingUp, TrendingDown } from 'lucide-react'

interface BenchmarkData {
  metric: string
  actual: number
  benchmark: number
  difference: number
  differencePercent: number
}

interface BenchmarkComparisonChartProps {
  openRate: number
  openRateBenchmark: number
  clickRate: number
  clickRateBenchmark: number
  deliveryRate: number
  deliveryRateBenchmark: number
  unsubscribeRate: number
  unsubscribeRateBenchmark: number
}

export function BenchmarkComparisonChart(props: BenchmarkComparisonChartProps) {
  const {
    openRate,
    openRateBenchmark,
    clickRate,
    clickRateBenchmark,
    deliveryRate,
    deliveryRateBenchmark,
    unsubscribeRate,
    unsubscribeRateBenchmark,
  } = props

  const benchmarkData: BenchmarkData[] = [
    {
      metric: 'Open Rate',
      actual: openRate * 100,
      benchmark: openRateBenchmark * 100,
      difference: (openRate - openRateBenchmark) * 100,
      differencePercent: ((openRate - openRateBenchmark) / openRateBenchmark) * 100,
    },
    {
      metric: 'Click Rate',
      actual: clickRate * 100,
      benchmark: clickRateBenchmark * 100,
      difference: (clickRate - clickRateBenchmark) * 100,
      differencePercent: ((clickRate - clickRateBenchmark) / clickRateBenchmark) * 100,
    },
    {
      metric: 'Delivery Rate',
      actual: deliveryRate * 100,
      benchmark: deliveryRateBenchmark * 100,
      difference: (deliveryRate - deliveryRateBenchmark) * 100,
      differencePercent: ((deliveryRate - deliveryRateBenchmark) / deliveryRateBenchmark) * 100,
    },
    {
      metric: 'Unsubscribe Rate',
      actual: unsubscribeRate * 100,
      benchmark: unsubscribeRateBenchmark * 100,
      difference: (unsubscribeRate - unsubscribeRateBenchmark) * 100,
      differencePercent: ((unsubscribeRate - unsubscribeRateBenchmark) / unsubscribeRateBenchmark) * 100,
    },
  ]

  // Calculate how many metrics beat benchmark
  const beatingBenchmark = benchmarkData.filter(d => 
    d.metric === 'Unsubscribe Rate' ? d.actual < d.benchmark : d.actual > d.benchmark
  ).length

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = benchmarkData.find(d => d.metric === label)
      if (!data) return null

      const isBeating = data.metric === 'Unsubscribe Rate' 
        ? data.actual < data.benchmark 
        : data.actual > data.benchmark

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
                {entry.value.toFixed(2)}%
              </span>
            </div>
          ))}
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className={`flex items-center gap-2 ${isBeating ? 'text-green-600' : 'text-red-600'}`}>
              {isBeating ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-semibold text-sm">
                {isBeating ? 'Beating' : 'Below'} benchmark by {Math.abs(data.difference).toFixed(2)}%
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({Math.abs(data.differencePercent).toFixed(1)}% {isBeating ? 'above' : 'below'})
            </span>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      {/* Summary Card */}
      <div className="glass-card p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Performance vs. Industry</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {beatingBenchmark} of 4 metrics beating benchmark
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          {benchmarkData.map((item) => {
            const isBeating = item.metric === 'Unsubscribe Rate' 
              ? item.actual < item.benchmark 
              : item.actual > item.benchmark
            return (
              <div 
                key={item.metric}
                className={`flex-1 h-2 rounded-full ${isBeating ? 'bg-green-500' : 'bg-red-500'}`}
              ></div>
            )
          })}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {benchmarkData.map((item) => {
          const isBeating = item.metric === 'Unsubscribe Rate' 
            ? item.actual < item.benchmark 
            : item.actual > item.benchmark
          
          return (
            <div key={item.metric} className="glass-card p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{item.metric}</span>
                {isBeating ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div className={`text-2xl font-bold ${isBeating ? 'text-green-600' : 'text-red-600'}`}>
                {item.actual.toFixed(1)}%
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                vs. {item.benchmark.toFixed(1)}% benchmark
              </p>
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className={`text-xs font-semibold ${isBeating ? 'text-green-600' : 'text-red-600'}`}>
                  {isBeating ? '+' : ''}{item.difference.toFixed(2)}% pts
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Comparison Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Actual vs. Industry Benchmark
        </h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={benchmarkData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.9}/>
                </linearGradient>
                <linearGradient id="benchmarkGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0.9}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="metric" />
              <YAxis tickFormatter={(value) => `${value.toFixed(0)}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="actual" name="Your Performance" fill="url(#actualGradient)" radius={[10, 10, 0, 0]} />
              <Bar dataKey="benchmark" name="Industry Benchmark" fill="url(#benchmarkGradient)" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="glass-card p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">📈 Performance Insights</h4>
        <div className="space-y-3 text-sm">
          {benchmarkData.map((item) => {
            const isBeating = item.metric === 'Unsubscribe Rate' 
              ? item.actual < item.benchmark 
              : item.actual > item.benchmark
            
            if (!isBeating) {
              return (
                <div key={item.metric} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>{item.metric}:</strong> {Math.abs(item.differencePercent).toFixed(1)}% below industry standard - 
                    focus on {item.metric === 'Open Rate' ? 'subject line optimization' : 
                              item.metric === 'Click Rate' ? 'CTA placement and messaging' :
                              item.metric === 'Delivery Rate' ? 'list hygiene and sender reputation' :
                              'content relevance and frequency'}
                  </p>
                </div>
              )
            }
            return null
          })}
          {beatingBenchmark === 4 && (
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Excellent performance!</strong> All metrics exceed industry benchmarks - maintain current strategy
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
