import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PassTypeManagement } from '@/components/dashboard/pass-type-management'
import { PassTypeChart } from '@/components/charts/pass-type-chart'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function PassTypesPage() {
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

  const passTypes = await prisma.passType.findMany({
    where: { clientId: client.id },
    orderBy: { registrationCount: 'desc' },
  })

  const totalRegistrations = passTypes.reduce((sum, pt) => sum + pt.registrationCount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
          Pass Types & Tickets
        </h1>
        <p className="text-muted-foreground mt-1">
          Registration breakdown by ticket type
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pass Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passTypes.length}</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRegistrations.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Pass Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate">
              {passTypes[0]?.passTypeName || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {passTypes[0]?.registrationCount.toLocaleString()} registrations
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Year</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passTypes[0]?.year || client.year || 'N/A'}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Pass Type Distribution</CardTitle>
          <CardDescription>
            Visual breakdown of registrations by ticket type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PassTypeChart data={passTypes} />
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Manage Pass Types</CardTitle>
          <CardDescription>
            Add, edit, or delete pass types for {client.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <PassTypeManagement passTypes={passTypes} clientId={client.id} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
