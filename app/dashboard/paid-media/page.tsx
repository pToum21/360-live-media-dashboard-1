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
      liClicks: true,
      metaSpend: true,
      metaConversions: true,
      metaImpressions: true,
      metaClicks: true,
      googleSearchSpend: true,
      googleSearchConversions: true,
      googleSearchImpressions: true,
      googleSearchClicks: true,
      googleDisplaySpend: true,
      googleDisplayConversions: true,
      googleDisplayImpressions: true,
      googleDisplayClicks: true,
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

  // Calculate aggregate metrics across all data
  const totalClicks = paidMedia.reduce((sum, pm) => 
    sum + (pm.liClicks || 0) + (pm.metaClicks || 0) + (pm.googleSearchClicks || 0) + (pm.googleDisplayClicks || 0), 0
  )

  // Platform-specific aggregates
  const liClicks = paidMedia.reduce((sum, pm) => sum + (pm.liClicks || 0), 0)
  const liImpressions = paidMedia.reduce((sum, pm) => sum + (pm.liImpressions || 0), 0)
  const liSpend = paidMedia.reduce((sum, pm) => sum + (pm.liSpend || 0), 0)

  const metaClicks = paidMedia.reduce((sum, pm) => sum + (pm.metaClicks || 0), 0)
  const metaImpressions = paidMedia.reduce((sum, pm) => sum + (pm.metaImpressions || 0), 0)
  const metaSpend = paidMedia.reduce((sum, pm) => sum + (pm.metaSpend || 0), 0)

  const gsClicks = paidMedia.reduce((sum, pm) => sum + (pm.googleSearchClicks || 0), 0)
  const gsImpressions = paidMedia.reduce((sum, pm) => sum + (pm.googleSearchImpressions || 0), 0)
  const gsSpend = paidMedia.reduce((sum, pm) => sum + (pm.googleSearchSpend || 0), 0)

  const gdClicks = paidMedia.reduce((sum, pm) => sum + (pm.googleDisplayClicks || 0), 0)
  const gdImpressions = paidMedia.reduce((sum, pm) => sum + (pm.googleDisplayImpressions || 0), 0)
  const gdSpend = paidMedia.reduce((sum, pm) => sum + (pm.googleDisplaySpend || 0), 0)

  // Calculate CTR, CPC, CPM per platform
  const liCTR = liImpressions > 0 ? (liClicks / liImpressions) * 100 : 0
  const liCPC = liClicks > 0 ? liSpend / liClicks : 0
  const liCPM = liImpressions > 0 ? (liSpend / liImpressions) * 1000 : 0

  const metaCTR = metaImpressions > 0 ? (metaClicks / metaImpressions) * 100 : 0
  const metaCPC = metaClicks > 0 ? metaSpend / metaClicks : 0
  const metaCPM = metaImpressions > 0 ? (metaSpend / metaImpressions) * 1000 : 0

  const gsCTR = gsImpressions > 0 ? (gsClicks / gsImpressions) * 100 : 0
  const gsCPC = gsClicks > 0 ? gsSpend / gsClicks : 0
  const gsCPM = gsImpressions > 0 ? (gsSpend / gsImpressions) * 1000 : 0

  const gdCTR = gdImpressions > 0 ? (gdClicks / gdImpressions) * 100 : 0
  const gdCPC = gdClicks > 0 ? gdSpend / gdClicks : 0
  const gdCPM = gdImpressions > 0 ? (gdSpend / gdImpressions) * 1000 : 0

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

      {/* Platform-Specific Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        {/* LinkedIn */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center mb-3">Paid LinkedIn</h3>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{liCTR.toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground">Overall average</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cost Per Click</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${liCPC.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Overall average</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cost Per 1K Impressions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${liCPM.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Overall average</p>
            </CardContent>
          </Card>
        </div>

        {/* Meta */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center mb-3">Paid Meta</h3>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metaCTR.toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground">Overall average</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cost Per Click</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metaCPC.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Overall average</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cost Per 1K Impressions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metaCPM.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Overall average</p>
            </CardContent>
          </Card>
        </div>

        {/* Google Search */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center mb-3">Paid Google Search</h3>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gsCTR.toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground">Overall average</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cost Per Click</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${gsCPC.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Overall average</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cost Per 1K Impressions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${gsCPM.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Overall average</p>
            </CardContent>
          </Card>
        </div>

        {/* Google Display */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center mb-3">Paid Google Display</h3>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Click-Through Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gdCTR.toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground">Overall average</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cost Per Click</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${gdCPC.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Overall average</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cost Per 1K Impressions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${gdCPM.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Overall average</p>
            </CardContent>
          </Card>
        </div>
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
