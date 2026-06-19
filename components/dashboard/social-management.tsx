'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { SocialFormDialog } from '@/components/forms/social-form-dialog'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useReadOnly } from '@/contexts/readonly-context'

interface SocialManagementProps {
  metrics: any[]
}

export function SocialManagement({ metrics }: SocialManagementProps) {
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
      const response = await fetch(`/api/social/${id}`, {
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
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Weeks</h3>
        {!isReadOnly && (
          <Button 
            onClick={handleAdd}
            className="bg-[#2E8741] hover:bg-[#236933]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Week
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {metrics.slice(0, 10).map((metric) => (
          <div
            key={metric.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover-glass-shine transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {new Date(metric.weekStarting).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
              {!isReadOnly && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(metric)}
                    className="dark:hover:bg-gray-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(metric.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">LinkedIn</h5>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Followers</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{metric.liFollowers?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Impressions</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{metric.liImpressions?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Engagement</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {metric.liEngagementRate ? (metric.liEngagementRate * 100).toFixed(1) : '0.0'}%
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-pink-600 dark:text-pink-400 mb-2">Instagram</h5>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Followers</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{metric.igFollowers?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Impressions</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{metric.igImpressions?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Engagement</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {metric.igEngagementRate ? (metric.igEngagementRate * 100).toFixed(1) : '0.0'}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <SocialFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        data={editData}
        mode={mode}
      />
    </>
  )
}
