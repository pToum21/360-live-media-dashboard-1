'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Settings, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'

interface ApiConnection {
  id: string
  name: string
  description: string
  connected: boolean
  lastSync: Date | null
}

interface ApiConnectionCardProps {
  connection: ApiConnection
}

export function ApiConnectionCard({ connection }: ApiConnectionCardProps) {
  const [syncing, setSyncing] = useState(false)

  const handleSync = async () => {
    setSyncing(true)
    const toastId = toast.loading(`Syncing ${connection.name} data...`)

    try {
      const response = await fetch(`/api/integrations/${connection.id}/sync`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Sync failed')

      const data = await response.json()
      toast.success(`${connection.name} synced successfully! ${data.recordsImported || 0} records imported.`, { id: toastId })
    } catch (error) {
      console.error('Sync error:', error)
      toast.error(`Failed to sync ${connection.name}`, { id: toastId })
    } finally {
      setSyncing(false)
    }
  }

  const handleConfigure = () => {
    toast.info(`Opening ${connection.name} configuration...`)
    // Will open configuration modal
  }

  return (
    <Card className="chart-card hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {connection.name}
              {connection.connected ? (
                <Badge className="bg-green-100 text-green-700">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                  <XCircle className="h-3 w-3 mr-1" />
                  Not Connected
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-1">{connection.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {connection.lastSync ? (
              <p>Last synced: {new Date(connection.lastSync).toLocaleString()}</p>
            ) : (
              <p>Never synced</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleConfigure}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Configure
            </Button>
            <Button
              size="sm"
              onClick={handleSync}
              disabled={!connection.connected || syncing}
              className="bg-[#2E8741] hover:bg-[#236933] gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
