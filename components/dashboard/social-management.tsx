'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { SocialFormDialog } from '@/components/forms/social-form-dialog'
import { useRouter } from 'next/navigation'

interface SocialManagementProps {
  metrics: any[]
}

export function SocialManagement({ metrics }: SocialManagementProps) {
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

    try {
      const response = await fetch(`/api/social/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')

      router.refresh()
    } catch (error) {
      console.error('Error deleting metric:', error)
      alert('Failed to delete. Please try again.')
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Weeks</h3>
        <Button 
          onClick={handleAdd}
          className="bg-[#2E8741] hover:bg-[#236933]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Week
        </Button>
      </div>

      <div className="space-y-3">
        {metrics.slice(0, 10).map((metric) => (
          <div
            key={metric.id}
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium text-gray-900">
                {new Date(metric.weekStarting).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
              <div className="flex items-center gap-2">
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

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-blue-600 mb-2">LinkedIn</h5>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Followers</p>
                    <p className="font-semibold">{metric.liFollowers?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Impressions</p>
                    <p className="font-semibold">{metric.liImpressions?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Engagement</p>
                    <p className="font-semibold">
                      {metric.liEngagementRate ? (metric.liEngagementRate * 100).toFixed(1) : '0.0'}%
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-pink-600 mb-2">Instagram</h5>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Followers</p>
                    <p className="font-semibold">{metric.igFollowers?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Impressions</p>
                    <p className="font-semibold">{metric.igImpressions?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Engagement</p>
                    <p className="font-semibold">
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
