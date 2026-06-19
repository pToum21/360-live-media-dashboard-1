import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AbstractManagement } from '@/components/dashboard/abstract-management'
import { AbstractChart } from '@/components/charts/abstract-chart'
import { prisma } from '@/lib/prisma'
import { requireAuth} from '@/lib/auth-check'
import { getSelectedClientId } from '@/lib/get-selected-client'

export default async function AbstractsPage() {
  await requireAuth()

  const clientId = await getSelectedClientId()

  const client = await prisma.client.findUnique({
    where: { id: clientId },
  })

  if (!client) {
    return <div>Client not found</div>
  }

  const abstracts = await prisma.abstractSubmission.findMany({
    where: { clientId: client.id },
    orderBy: { year: 'desc' },
  })

  const totalSubmissions = abstracts.reduce((sum, a) => sum + a.submissionCount, 0)
  const latestYear = abstracts.length > 0 ? Math.max(...abstracts.map(a => a.year)) : new Date().getFullYear()
  const latestYearData = abstracts.filter(a => a.year === latestYear)
  const latestCount = latestYearData.reduce((sum, a) => sum + a.submissionCount, 0)

  // Calculate YoY growth
  const previousYearData = abstracts.filter(a => a.year === latestYear - 1)
  const previousCount = previousYearData.reduce((sum, a) => sum + a.submissionCount, 0)
  const yoyGrowth = previousCount > 0 ? ((latestCount - previousCount) / previousCount) * 100 : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
          Abstract Submissions
        </h1>
        <p className="text-muted-foreground mt-1">
          Track and manage abstract submissions by year
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubmissions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{latestYear} Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Latest year</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YoY Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {yoyGrowth > 0 ? '+' : ''}{yoyGrowth.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">vs {latestYear - 1}</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Years Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(abstracts.map(a => a.year)).size}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Submission Trends</CardTitle>
          <CardDescription>
            Year-over-year abstract submission trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AbstractChart data={abstracts} />
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Manage Abstract Data</CardTitle>
          <CardDescription>
            Add, edit, or delete abstract submission records for {client.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <AbstractManagement abstracts={abstracts} clientId={client.id} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
