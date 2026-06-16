import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RevenueManagement } from '@/components/dashboard/revenue-management'
import { RevenueChart } from '@/components/charts/revenue-chart'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function RevenuePage() {
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

  const projections = await prisma.revenueProjection.findMany({
    where: { clientId: client.id },
    orderBy: { date: 'desc' },
  })

  const totalProjected = projections.reduce((sum, p) => sum + (p.projectedRevenue || 0), 0)
  const totalActual = projections.reduce((sum, p) => sum + (p.actualRevenue || 0), 0)
  const variance = totalActual > 0 ? ((totalActual - totalProjected) / totalProjected) * 100 : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
          Revenue Projections & Actuals
        </h1>
        <p className="text-muted-foreground mt-1">
          Track projected vs actual revenue by category
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalProjected / 1000000).toFixed(2)}M</div>
            <p className="text-xs text-muted-foreground">Forecasted revenue</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalActual / 1000000).toFixed(2)}M</div>
            <p className="text-xs text-muted-foreground">Realized revenue</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${variance > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">vs projection</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(projections.map(p => p.category)).size}</div>
            <p className="text-xs text-muted-foreground">Tracked categories</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>
            Projected vs actual revenue by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RevenueChart data={projections} />
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Manage Revenue Data</CardTitle>
          <CardDescription>
            Add, edit, or delete revenue projections and actuals for {client.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <RevenueManagement projections={projections} clientId={client.id} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
