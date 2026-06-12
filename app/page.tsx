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
  Sun
} from "lucide-react"
import { useTheme } from "next-themes"

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (session) {
      router.push("/dashboard")
    }
  }, [session, router])

  if (session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -right-40 w-80 h-80 bg-[#2E8741]/10 dark:bg-[#2E8741]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -left-40 w-96 h-96 bg-[#84BE41]/10 dark:bg-[#84BE41]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#2E8741]/5 dark:bg-[#2E8741]/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
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
              <Button variant="ghost" className="font-medium">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-6 pt-24 pb-20">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2E8741]/10 dark:bg-[#2E8741]/20 border border-[#2E8741]/20 dark:border-[#2E8741]/30 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-[#2E8741]" />
            <span className="text-sm font-medium text-[#2E8741] dark:text-[#84BE41]">The Future of Marketing Intelligence</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white">
              Your Marketing
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2E8741] via-[#3AA052] to-[#84BE41]">
              Command Center
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
            Transform scattered data into actionable insights. Real-time analytics, automated reporting, and intelligent recommendations—all in one beautiful dashboard.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth/signin">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-[#2E8741] to-[#3AA052] hover:from-[#236933] hover:to-[#2E8741] text-white shadow-2xl shadow-[#2E8741]/30 px-8 py-6 text-lg group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { value: "120hrs", label: "Saved per year", icon: Clock },
              { value: "5+", label: "Data sources unified", icon: LineChart },
              { value: "Real-time", label: "Auto-sync updates", icon: Zap }
            ].map((stat, i) => (
              <div key={i} className="glass-card p-6 hover-glass-shine border border-gray-200 dark:border-gray-800">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-[#2E8741]" />
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2E8741] to-[#84BE41] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Powerful features designed for modern marketing teams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: "Website Analytics",
                description: "Real-time traffic, engagement, and conversion tracking from Google Analytics and SEMrush.",
                features: ["Live visitor data", "SEO health scores", "UTM campaign tracking"]
              },
              {
                icon: Mail,
                title: "Email Campaigns",
                description: "Monitor newsletter performance and campaign effectiveness across all channels.",
                features: ["MailChimp integration", "Open & click tracking", "Deliverability insights"]
              },
              {
                icon: Users,
                title: "Social Media",
                description: "Track LinkedIn and Instagram performance with advanced engagement analytics.",
                features: ["Multi-platform sync", "Content tagging", "Engagement analytics"]
              },
              {
                icon: TrendingUp,
                title: "Performance Insights",
                description: "AI-powered recommendations to optimize your marketing strategy.",
                features: ["Trend analysis", "Predictive insights", "Goal tracking"]
              },
              {
                icon: Target,
                title: "Campaign Management",
                description: "Plan, execute, and measure all your marketing campaigns in one place.",
                features: ["Campaign calendar", "Budget tracking", "ROI analysis"]
              },
              {
                icon: Zap,
                title: "Automated Reports",
                description: "Schedule and share beautiful reports with stakeholders automatically.",
                features: ["Custom templates", "Auto-scheduling", "Export options"]
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="glass-card p-8 hover-glass-shine border border-gray-200 dark:border-gray-800 group hover:border-[#2E8741] dark:hover:border-[#2E8741] transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2E8741] to-[#84BE41] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#2E8741] mt-1.5 flex-shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative container mx-auto px-6 py-20">
        <div className="glass-card max-w-4xl mx-auto p-12 md:p-16 text-center border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-[#2E8741]/5 to-[#84BE41]/5 dark:from-[#2E8741]/10 dark:to-[#84BE41]/10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Ready to transform your marketing?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join your team in the modern era of data-driven marketing. Sign in to get started.
          </p>
          <Link href="/auth/signin">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-[#2E8741] to-[#3AA052] hover:from-[#236933] hover:to-[#2E8741] text-white shadow-2xl shadow-[#2E8741]/30 px-8 py-6 text-lg group"
            >
              Sign In Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t dark:border-gray-800 py-12">
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
    </div>
  )
}
