'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { WebsiteFormDialog } from '@/components/forms/website-form-dialog'
import { ExportButton } from '@/components/ui/export-button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useReadOnly } from '@/contexts/readonly-context'

interface WebsiteManagementProps {
  metrics: any[]
}

export function WebsiteManagement({ metrics }: WebsiteManagementProps) {
  const router = useRouter()
  const { isReadOnly } = useReadOnly()
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Weeks</h3>
        <div className="flex gap-2">
          <ExportButton data={metrics} filename="website-analytics" type="website" />
          {!isReadOnly && (
            <Button 
              onClick={handleAdd}
              className="bg-[#2E8741] hover:bg-[#236933] dark:bg-[#2E8741] dark:hover:bg-[#3a9d54]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Week
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {metrics.slice(0, 10).map((metric) => (
          <div
            key={metric.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-between relative overflow-hidden group"
          >
            <div className="flex-1 grid grid-cols-5 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {new Date(metric.weekStarting).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Total Users</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{metric.totalUsers?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">New Users</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{metric.newUsers?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Engagement (sec)</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{metric.avgEngagementTimeSec || '-'}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Health Score</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{metric.healthScore?.toFixed(1) || '-'}</p>
              </div>
            </div>

            {!isReadOnly && (
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(metric)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Pencil className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(metric.id)}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
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
