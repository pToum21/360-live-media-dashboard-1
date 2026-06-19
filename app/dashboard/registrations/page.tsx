import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RegistrationManagement } from '@/components/dashboard/registration-management'
import { RegistrationChart } from '@/components/charts/registration-chart'
import { MultiYearRegistrationChart } from '@/components/charts/multi-year-registration-chart'
import { RegistrationActualsVsGoalChart } from '@/components/charts/registration-actuals-vs-goal-chart'
import { PassTypeChart } from '@/components/charts/pass-type-chart'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-check'
import { getSelectedClientId } from '@/lib/get-selected-client'

export default async function RegistrationsPage() {
  await requireAuth()

  const clientId = await getSelectedClientId()

  const client = await prisma.client.findUnique({
    where: { id: clientId },
  })

  if (!client) {
    return <div>Client not found</div>
  }

  const registrations = await prisma.eventRegistration.findMany({
    where: { clientId: client.id },
    orderBy: { date: 'desc' },
  })

  const totalRegistrations = registrations.reduce((sum, r) => sum + r.totalRegistrations, 0)
  const totalRevenue = registrations.reduce((sum, r) => sum + (r.revenue || 0), 0)
  const latestRegistration = registrations[0]

  // ATC-SPECIFIC: Fetch additional data for enhanced registration visualizations
  let atcRegistrationData = null
  if (client.slug === 'atc-2026') {
    const [allRegistrations, allPassTypes] = await Promise.all([
      prisma.eventRegistration.findMany({
        where: { clientId: client.id },
        orderBy: { date: 'asc' }
      }),
      prisma.passType.findMany({
        where: { clientId: client.id },
        orderBy: { registrationCount: 'desc' }
      })
    ])

    // Group registrations by year
    const registrationsByYear: Record<number, any[]> = {}
    allRegistrations.forEach(reg => {
      const year = reg.date.getFullYear()
      if (!registrationsByYear[year]) registrationsByYear[year] = []
      registrationsByYear[year].push(reg)
    })

    // Calculate ACTUAL paid/comp totals from the EventRegistration records
    // This ensures charts update when users enter data in the CRUD table
    const currentYearRegistrations = registrationsByYear[2026] || []
    const latestReg = currentYearRegistrations[currentYearRegistrations.length - 1]
    
    const compRegistrations = latestReg?.compRegistrations || 0
    const paidRegistrations = latestReg?.paidRegistrations || 0

    // Calculate paid/comp percentages per year from ACTUAL EventRegistration data
    const passTypesByYear: Record<number, { paidPercent: number, compPercent: number }> = {}
    
    for (const year of [2023, 2024, 2026]) {
      const yearRegs = registrationsByYear[year] || []
      const latestYearReg = yearRegs[yearRegs.length - 1]
      
      if (latestYearReg && latestYearReg.paidRegistrations && latestYearReg.compRegistrations) {
        const total = latestYearReg.totalRegistrations
        passTypesByYear[year] = {
          paidPercent: total > 0 ? latestYearReg.paidRegistrations / total : 0,
          compPercent: total > 0 ? latestYearReg.compRegistrations / total : 0
        }
      } else {
        // Fallback: calculate from totalRegistrations if paid/comp not entered
        passTypesByYear[year] = {
          paidPercent: 0.83,
          compPercent: 0.17
        }
      }
    }

    // Format multi-year chart data
    const maxWeeks = Math.max(
      registrationsByYear[2023]?.length || 0,
      registrationsByYear[2024]?.length || 0,
      registrationsByYear[2026]?.length || 0
    )

    const multiYearChartData = []
    for (let i = 0; i < maxWeeks; i++) {
      multiYearChartData.push({
        week: `Week ${i + 1}`,
        year2023: registrationsByYear[2023]?.[i]?.totalRegistrations,
        year2024: registrationsByYear[2024]?.[i]?.totalRegistrations,
        year2026: registrationsByYear[2026]?.[i]?.totalRegistrations
      })
    }

    // Get pass types for current year (2024 data for visualization)
    const currentYearPassTypes = allPassTypes.filter(pt => pt.year === 2024)

    atcRegistrationData = {
      multiYearChartData,
      passTypePercentages: passTypesByYear,
      compRegistrations,
      paidRegistrations,
      passTypes: currentYearPassTypes
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
          Event Registrations
        </h1>
        <p className="text-muted-foreground mt-1">
          Track daily event registration metrics and goals
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRegistrations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalRevenue / 1000000).toFixed(2)}M</div>
            <p className="text-xs text-muted-foreground">From registrations</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestRegistration?.totalRegistrations.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">Most recent</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestRegistration?.percentOfGoal 
                ? `${(latestRegistration.percentOfGoal * 100).toFixed(0)}%`
                : '-'}
            </div>
            <p className="text-xs text-muted-foreground">Of target</p>
          </CardContent>
        </Card>
      </div>

      {/* ATC-SPECIFIC: Multi-Year Registration Comparison */}
      {atcRegistrationData && (
        <MultiYearRegistrationChart 
          data={atcRegistrationData.multiYearChartData}
          passTypePercentages={atcRegistrationData.passTypePercentages}
        />
      )}

      {/* ATC-SPECIFIC: Registration Actuals vs Goal */}
      {atcRegistrationData && (
        <RegistrationActualsVsGoalChart 
          compActual={atcRegistrationData.compRegistrations}
          compGoal={1725}
          paidActual={atcRegistrationData.paidRegistrations}
          paidGoal={6275}
        />
      )}

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Weekly Registration Trends</CardTitle>
          <CardDescription>
            Registration growth over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegistrationChart data={registrations} />
        </CardContent>
      </Card>

      {/* ATC-SPECIFIC: Pass Types Distribution */}
      {atcRegistrationData && atcRegistrationData.passTypes.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>2024 Registrations by Pass Types</CardTitle>
            <CardDescription>
              Breakdown of registrations by ticket type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PassTypeChart data={atcRegistrationData.passTypes} />
          </CardContent>
        </Card>
      )}

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Manage Registration Data</CardTitle>
          <CardDescription>
            Add, edit, or delete event registration records for {client.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <RegistrationManagement registrations={registrations} clientId={client.id} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
