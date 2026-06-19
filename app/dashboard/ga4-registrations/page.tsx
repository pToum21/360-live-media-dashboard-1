import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { GA4RegistrationChart } from "@/components/charts/ga4-registration-chart"
import { GA4RegistrationManagement } from "@/components/dashboard/ga4-registration-management"
import { requireAuth } from "@/lib/auth-check"
import { getSelectedClientId } from "@/lib/get-selected-client"
import { LineChart as LineChartIcon, TrendingUp, Users, Target } from "lucide-react"
import { Suspense } from "react"

export default async function GA4RegistrationsPage() {
  await requireAuth()

  const clientId = await getSelectedClientId()

  const client = await prisma.client.findUnique({
    where: { id: clientId },
  })

  if (!client) {
    return <div>Client not found</div>
  }

  // Fetch GA4 registration data
  const ga4Data = await prisma.gA4Registration.findMany({
    where: {
      clientId: client.id,
    },
    orderBy: { weekStarting: 'asc' },
  })

  if (ga4Data.length === 0) {
    return (
      <div className="space-y-8 animate-in">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <LineChartIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">GA4 Registration Attribution</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track which traffic sources drive event registrations
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <LineChartIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No GA4 registration data available for this client.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate summary stats
  const totalRegistrations = ga4Data.reduce((sum, d) => sum + (d.totalRegistrations || 0), 0)
  const avgWeeklyRegistrations = totalRegistrations / ga4Data.length
  
  // Calculate source totals
  const organicSearchTotal = ga4Data.reduce((sum, d) => sum + (d.organicSearch || 0), 0)
  const emailTotal = ga4Data.reduce((sum, d) => sum + (d.email || 0), 0)
  const directTotal = ga4Data.reduce((sum, d) => sum + (d.direct || 0), 0)
  const paidSocialTotal = ga4Data.reduce((sum, d) => sum + (d.paidSocial || 0), 0)
  
  // Find top performing source
  const sources = [
    { name: 'Organic Search', value: organicSearchTotal },
    { name: 'Email', value: emailTotal },
    { name: 'Direct', value: directTotal },
    { name: 'Paid Social', value: paidSocialTotal },
  ]
  const topSource = sources.reduce((max, source) => source.value > max.value ? source : max, sources[0])

  // Calculate week-over-week growth
  const latestWeek = ga4Data[ga4Data.length - 1]
  const previousWeek = ga4Data[ga4Data.length - 2]
  const weekOverWeekGrowth = previousWeek 
    ? ((latestWeek.totalRegistrations || 0) - (previousWeek.totalRegistrations || 0)) / (previousWeek.totalRegistrations || 1) * 100 
    : 0

  return (
    <div className="space-y-8 animate-in">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
          <LineChartIcon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">GA4 Registration Attribution</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track which traffic sources drive event registrations week-over-week
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Registrations</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
              {totalRegistrations.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Across {ga4Data.length} weeks
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Weekly Average</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 dark:from-green-400 dark:to-green-500 bg-clip-text text-transparent">
              {avgWeeklyRegistrations.toFixed(0)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Registrations per week
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">Top Source</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
              <Target className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent">
              {topSource.name}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {topSource.value} registrations ({((topSource.value / totalRegistrations) * 100).toFixed(1)}%)
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card border-0 overflow-hidden relative group">
          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${weekOverWeekGrowth >= 0 ? 'from-green-400/10' : 'from-red-400/10'} to-transparent rounded-bl-full`}></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">WoW Growth</CardTitle>
            <div className={`w-10 h-10 bg-gradient-to-br ${weekOverWeekGrowth >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} rounded-xl flex items-center justify-center shadow-lg ${weekOverWeekGrowth >= 0 ? 'shadow-green-500/30' : 'shadow-red-500/30'} group-hover:scale-110 transition-transform`}>
              <TrendingUp className={`h-5 w-5 text-white ${weekOverWeekGrowth < 0 ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className={`text-3xl font-bold bg-gradient-to-r ${weekOverWeekGrowth >= 0 ? 'from-green-600 to-green-700 dark:from-green-400 dark:to-green-500' : 'from-red-600 to-red-700 dark:from-red-400 dark:to-red-500'} bg-clip-text text-transparent`}>
              {weekOverWeekGrowth >= 0 ? '+' : ''}{weekOverWeekGrowth.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              vs. previous week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* GA4 Registration Chart */}
      <Card className="chart-card border-0 overflow-hidden shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50/10 dark:from-blue-900/20 to-transparent border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <LineChartIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Registration Attribution Over Time</CardTitle>
              <CardDescription className="dark:text-gray-400">Weekly registrations broken down by traffic source</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <GA4RegistrationChart data={ga4Data.map(d => ({
            weekLabel: d.weekLabel || '',
            weeksOut: d.weeksOut || 0,
            organicSearch: d.organicSearch || 0,
            email: d.email || 0,
            direct: d.direct || 0,
            paidSocial: d.paidSocial || 0,
            paidSearch: d.paidSearch || 0,
            referral: d.referral || 0,
            organicSocial: d.organicSocial || 0,
            totalRegistrations: d.totalRegistrations || 0,
          }))} />
        </CardContent>
      </Card>

      {/* Data Management Section */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Manage GA4 Registration Data</CardTitle>
          <CardDescription>
            Add, edit, or delete GA4 registration attribution records for {client.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <GA4RegistrationManagement registrations={ga4Data} clientId={client.id} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
