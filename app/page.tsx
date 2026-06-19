"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  Mail, 
  Users, 
  TrendingUp, 
  Zap, 
  Clock,
  ArrowRight,
  Sparkles,
  LineChart,
  Target,
  Moon,
  Sun,
  MousePointerClick,
  Send,
  Eye,
  Activity,
  DollarSign,
  Globe,
  Calendar,
  Share2,
  ChevronRight
} from "lucide-react"
import { useTheme } from "next-themes"
import { LineChart as RechartsLine, Line, BarChart as RechartsBar, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend } from 'recharts'

// Generate more realistic, animated data
const generateRealisticData = () => {
  const now = Date.now()
  return Array.from({ length: 30 }, (_, i) => {
    const baseValue = 3000
    const trend = i * 50
    const variance = Math.sin(i / 3) * 500
    const random = (Math.random() - 0.5) * 300
    return {
      day: i + 1,
      visits: Math.round(baseValue + trend + variance + random),
      openRate: 28 + Math.sin(i / 2) * 8 + (Math.random() - 0.5) * 4,
      clickRate: 6 + Math.sin(i / 3) * 3 + (Math.random() - 0.5) * 2,
      revenue: Math.round((45000 + i * 1200 + Math.random() * 2000)),
      conversions: Math.round(80 + i * 2 + Math.random() * 20),
      engagement: Math.round(15 + Math.sin(i / 4) * 8 + Math.random() * 5)
    }
  })
}

const socialChannelData = [
  { channel: 'LinkedIn', followers: 24500, engagement: 8.2, posts: 42 },
  { channel: 'Instagram', followers: 18300, engagement: 12.5, posts: 58 },
  { channel: 'Facebook', followers: 32100, engagement: 6.8, posts: 38 },
  { channel: 'Twitter/X', followers: 15600, engagement: 9.3, posts: 67 },
]

const campaignChannels = [
  { name: 'Organic Search', value: 42, color: '#10b981', spend: 0 },
  { name: 'Paid Search', value: 28, color: '#3b82f6', spend: 15400 },
  { name: 'Social Media', value: 18, color: '#8b5cf6', spend: 8200 },
  { name: 'Email', value: 12, color: '#f59e0b', spend: 2100 },
]

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'email' | 'social' | 'traffic'>('overview')
  const [chartData] = useState(generateRealisticData())
  const [animatedMetrics, setAnimatedMetrics] = useState({
    openRate: 0,
    clickRate: 0,
    visits: 0,
    revenue: 0
  })

  useEffect(() => {
    setMounted(true)
    
    // Animate metrics on load
    const timer = setTimeout(() => {
      setAnimatedMetrics({
        openRate: 48.5,
        clickRate: 15.2,
        visits: 32500,
        revenue: 75000
      })
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (session) {
      router.push("/dashboard")
    }
  }, [session, router])

  if (session) {
    return null
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'email', label: 'Email Marketing', icon: Mail },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'traffic', label: 'Web Traffic', icon: Globe },
  ] as const

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -right-40 w-80 h-80 bg-[#2E8741]/10 dark:bg-[#2E8741]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -left-40 w-96 h-96 bg-[#84BE41]/10 dark:bg-[#84BE41]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <header className="glass-card border-0 border-b dark:border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image 
              src="/Logos/Info=Basic, Color=Green.png" 
              alt="360 Live Media Logo" 
              width={140}
              height={48}
              className="object-contain"
            />
          </div>
          <div className="flex items-center gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>
            )}
            <Link href="/auth/signin">
              <Button className="bg-gradient-to-r from-[#2E8741] to-[#3AA052] hover:from-[#236933] hover:to-[#2E8741] text-white">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero + Interactive Dashboard Section */}
      <section className="relative container mx-auto px-6 pt-20 pb-16">
        <div className="text-center max-w-5xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2E8741]/10 dark:bg-[#2E8741]/20 border border-[#2E8741]/20 dark:border-[#2E8741]/30 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-[#2E8741]" />
            <span className="text-sm font-medium text-[#2E8741] dark:text-[#84BE41]">Interactive Dashboard Preview</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight" style={{ lineHeight: '1.2' }}>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white mb-3 pb-1">
              Do MORE with
            </span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[#2E8741] via-[#3AA052] to-[#84BE41] pb-2">
              Your Marketing Data
            </span>
          </h1>

          <div className="mt-10 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800 dark:text-gray-200">
              360 Live Media
            </h2>
            
            <h3 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300">
              Marketing Command Center
            </h3>
          </div>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
            Gain a 360-degree view of your marketing performance and the impact of your efforts on business goals. Registration, email, social, paid, and website data, all at your fingertips.
          </p>
        </div>

        {/* Live Interactive Dashboard */}
        <div className="max-w-[1400px] mx-auto">
          {/* Dashboard Tabs */}
          <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#2E8741] to-[#3AA052] text-white shadow-lg shadow-[#2E8741]/30'
                    : 'glass-card text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dashboard Content */}
          <div className="glass-card border border-gray-200 dark:border-gray-800 p-8 md:p-10 rounded-2xl backdrop-blur-xl animate-in">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  {[
                    { 
                      label: 'Avg Open Rate', 
                      value: `${animatedMetrics.openRate.toFixed(1)}%`, 
                      icon: Eye, 
                      trend: '+12%',
                      color: 'from-green-500 to-emerald-600'
                    },
                    { 
                      label: 'Click Rate', 
                      value: `${animatedMetrics.clickRate.toFixed(1)}%`, 
                      icon: MousePointerClick, 
                      trend: '+8%',
                      color: 'from-blue-500 to-cyan-600'
                    },
                    { 
                      label: 'Website Visits', 
                      value: animatedMetrics.visits.toLocaleString(), 
                      icon: Activity, 
                      trend: '+23%',
                      color: 'from-purple-500 to-indigo-600'
                    },
                    { 
                      label: 'Revenue', 
                      value: `$${(animatedMetrics.revenue / 1000).toFixed(0)}K`, 
                      icon: DollarSign, 
                      trend: '+15%',
                      color: 'from-orange-500 to-amber-600'
                    },
                  ].map((metric, i) => (
                    <div 
                      key={i}
                      className="glass-card p-6 hover-glass-shine border border-gray-200 dark:border-gray-800 group hover:border-[#2E8741] dark:hover:border-[#2E8741] transition-all duration-300"
                      style={{ 
                        animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both`,
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <metric.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                          {metric.trend}
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {metric.value}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</div>
                    </div>
                  ))}
                </div>

                {/* Main Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Website Traffic */}
                  <div className="glass-card p-6 border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Website Traffic</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">30-day visitor trends</p>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="visits" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          fill="url(#trafficGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Revenue Trend */}
                  <div className="glass-card p-6 border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Growth</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">30-day trend analysis</p>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsLine data={chartData}>
                        <defs>
                          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                          formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          dot={false}
                          fill="url(#revenueGradient)"
                        />
                      </RechartsLine>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Email Tab */}
            {activeTab === 'email' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="glass-card p-6 border border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Email Performance Trends</h3>
                    <ResponsiveContainer width="100%" height={350}>
                      <RechartsLine data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                          formatter={(value: any, name: any) => [
                            `${typeof value === 'number' ? value.toFixed(1) : value}%`,
                            name === 'openRate' ? 'Open Rate' : 'Click Rate'
                          ]}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="openRate" stroke="#10b981" strokeWidth={3} name="Open Rate" dot={false} />
                        <Line type="monotone" dataKey="clickRate" stroke="#3b82f6" strokeWidth={3} name="Click Rate" dot={false} />
                      </RechartsLine>
                    </ResponsiveContainer>
                  </div>

                  <div className="glass-card p-6 border border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Campaign Distribution</h3>
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={campaignChannels}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {campaignChannels.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                          formatter={(value: any, name: any) => [`${value}%`, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {campaignChannels.map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Social Tab */}
            {activeTab === 'social' && (
              <div className="space-y-8">
                <div className="glass-card p-6 border border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Social Media Performance</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <RechartsBar data={socialChannelData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                      <XAxis dataKey="channel" stroke="#6b7280" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="followers" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Followers" />
                      <Bar dataKey="posts" fill="#10b981" radius={[8, 8, 0, 0]} name="Posts" />
                    </RechartsBar>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  {socialChannelData.map((channel, i) => (
                    <div key={i} className="glass-card p-6 border border-gray-200 dark:border-gray-800">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{channel.channel}</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {(channel.followers / 1000).toFixed(1)}K
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                        {channel.engagement}% engagement
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Traffic Tab */}
            {activeTab === 'traffic' && (
              <div className="space-y-8">
                <div className="glass-card p-6 border border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Engagement & Conversions</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <RechartsBar data={chartData}>
                      <defs>
                        <linearGradient id="conversionsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={1}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                      <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="conversions" fill="url(#conversionsGradient)" radius={[8, 8, 0, 0]} name="Conversions" />
                      <Bar dataKey="engagement" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Engagement %" />
                    </RechartsBar>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* CTA Below Dashboard */}
          <div className="text-center mt-16">
            <Link href="/auth/signin">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-[#2E8741] to-[#3AA052] hover:from-[#236933] hover:to-[#2E8741] text-white shadow-2xl shadow-[#2E8741]/30 px-8 py-6 text-lg group"
              >
                Log In
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              No credit card required • Full access after log in
            </p>
          </div>
        </div>
      </section>

      {/* Features Section - More Compact */}
      <section className="relative container mx-auto px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Built for Marketing Teams
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Everything you need in one powerful platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Real-Time Updates", desc: "Visitor data, SEO health scores, UTM campaign tracking" },
              { icon: Target, title: "Advanced Analytics", desc: "Deep insights into campaign performance" },
              { icon: Users, title: "Team Collaboration", desc: "Share insights with your entire team" },
              { icon: Clock, title: "Automated Reports", desc: "Schedule and share beautiful reports with stakeholders automatically" },
              { icon: BarChart3, title: "Multi-Channel Tracking", desc: "Email, social, paid, web, and event data unified" },
              { icon: Activity, title: "Custom Dashboards", desc: "Build views tailored to your needs" },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass-card p-6 border border-gray-200 dark:border-gray-800 hover-glass-shine group hover:border-[#2E8741] dark:hover:border-[#2E8741] transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2E8741] to-[#84BE41] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t dark:border-gray-800 py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <Image 
              src="/Logos/Info=Basic, Color=Green.png" 
              alt="360 Live Media Logo" 
              width={120}
              height={42}
              className="object-contain"
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            A Smithbucklin Company
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            © 2026 360 Live Media. All rights reserved.
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
