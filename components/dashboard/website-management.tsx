'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { WebsiteFormDialog } from '@/components/forms/website-form-dialog'
import { ExportButton } from '@/components/ui/export-button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface WebsiteManagementProps {
  metrics: any[]
}

export function WebsiteManagement({ metrics }: WebsiteManagementProps) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editData, setEditData] = useState<any>(null)
  const [mode, setMode] = useState<'create' | 'edit'>('create')

  const handleAdd = () => {
    setMode('create')
    setEditData(null)
    setDialogOpen(true)
  }

  const handleEdit = (metric: any) => {
    setMode('edit')
    setEditData(metric)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this metric?')) return

    const toastId = toast.loading('Deleting metric...')

    try {
      const response = await fetch(`/api/website/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')

      toast.success('Metric deleted successfully!', { id: toastId })
      router.refresh()
    } catch (error) {
      console.error('Error deleting metric:', error)
      toast.error('Failed to delete metric. Please try again.', { id: toastId })
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h3 className="text-lg font-semibold text-gray-900">Recent Weeks</h3>
        <div className="flex gap-2">
          <ExportButton data={metrics} filename="website-analytics" type="website" />
          <Button 
            onClick={handleAdd}
            className="bg-[#2E8741] hover:bg-[#236933]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Week
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {metrics.slice(0, 10).map((metric) => (
          <div
            key={metric.id}
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <div className="flex-1 grid grid-cols-5 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-900">
                  {new Date(metric.weekStarting).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Total Users</p>
                <p className="font-semibold">{metric.totalUsers?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-gray-500">New Users</p>
                <p className="font-semibold">{metric.newUsers?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-gray-500">Engagement (sec)</p>
                <p className="font-semibold">{metric.avgEngagementTimeSec || '-'}</p>
              </div>
              <div>
                <p className="text-gray-500">Health Score</p>
                <p className="font-semibold">{metric.healthScore?.toFixed(1) || '-'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(metric)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(metric.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <WebsiteFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        data={editData}
        mode={mode}
      />
    </>
  )
}
