import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RegistrationManagement } from '@/components/dashboard/registration-management'
import { RegistrationChart } from '@/components/charts/registration-chart'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function RegistrationsPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/auth/signin')
  }

  const cookieStore = await cookies()
  const selectedClientSlug = cookieStore.get('selectedClient')?.value || '360-live-media'

  const client = await prisma.client.findUnique({
    where: { slug: selectedClientSlug },
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

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Registration Trends</CardTitle>
          <CardDescription>
            Daily registration growth over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegistrationChart data={registrations} />
        </CardContent>
      </Card>

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
