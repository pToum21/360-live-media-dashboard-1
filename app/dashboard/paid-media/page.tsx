import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PaidMediaManagement } from '@/components/dashboard/paid-media-management'
import { PaidMediaChart } from '@/components/charts/paid-media-chart'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function PaidMediaPage() {
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

  const paidMedia = await prisma.paidMedia.findMany({
    where: { clientId: client.id },
    orderBy: { weekStarting: 'desc' },
    select: {
      id: true,
      weekStarting: true,
      liSpend: true,
      liConversions: true,
      liImpressions: true,
      metaSpend: true,
      metaConversions: true,
      metaImpressions: true,
      googleSearchSpend: true,
      googleSearchConversions: true,
      googleSearchImpressions: true,
      googleDisplaySpend: true,
      googleDisplayConversions: true,
      googleDisplayImpressions: true,
      clientId: true,
    }
  })

  const totalSpend = paidMedia.reduce((sum, pm) => 
    sum + (pm.liSpend || 0) + (pm.metaSpend || 0) + (pm.googleSearchSpend || 0) + (pm.googleDisplaySpend || 0), 0
  )
  
  const totalConversions = paidMedia.reduce((sum, pm) => 
    sum + (pm.liConversions || 0) + (pm.metaConversions || 0) + (pm.googleSearchConversions || 0) + (pm.googleDisplayConversions || 0), 0
  )

  const totalImpressions = paidMedia.reduce((sum, pm) => 
    sum + (pm.liImpressions || 0) + (pm.metaImpressions || 0) + (pm.googleSearchImpressions || 0) + (pm.googleDisplayImpressions || 0), 0
  )

  const avgCPA = totalConversions > 0 ? totalSpend / totalConversions : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
          Paid Media Performance
        </h1>
        <p className="text-muted-foreground mt-1">
          LinkedIn, Meta, Google Search & Display ad performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalSpend / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground">All platforms</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All platforms</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalImpressions / 1000000).toFixed(2)}M</div>
            <p className="text-xs text-muted-foreground">All platforms</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg CPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgCPA.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Cost per acquisition</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
          <CardDescription>
            Weekly ad performance across all paid channels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaidMediaChart data={paidMedia} />
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Manage Paid Media Data</CardTitle>
          <CardDescription>
            Add, edit, or delete paid advertising records for {client.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <PaidMediaManagement paidMedia={paidMedia} clientId={client.id} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
