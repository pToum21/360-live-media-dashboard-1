'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { EmailFormDialog } from '@/components/forms/email-form-dialog'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface EmailManagementProps {
  campaigns: any[]
}

export function EmailManagement({ campaigns }: EmailManagementProps) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editData, setEditData] = useState<any>(null)
  const [mode, setMode] = useState<'create' | 'edit'>('create')

  const handleAdd = () => {
    setMode('create')
    setEditData(null)
    setDialogOpen(true)
  }

  const handleEdit = (campaign: any) => {
    setMode('edit')
    setEditData(campaign)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return

    const toastId = toast.loading('Deleting campaign...')

    try {
      const response = await fetch(`/api/email/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')

      toast.success('Campaign deleted successfully!', { id: toastId })
      router.refresh()
    } catch (error) {
      console.error('Error deleting campaign:', error)
      toast.error('Failed to delete campaign. Please try again.', { id: toastId })
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Campaigns</h3>
        <Button 
          onClick={handleAdd}
          className="bg-[#2E8741] hover:bg-[#236933]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Campaign
        </Button>
      </div>

      <div className="space-y-3">
        {campaigns.slice(0, 10).map((campaign) => (
          <div
            key={campaign.id}
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{campaign.name}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(campaign.deploymentDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(campaign)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(campaign.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Open Rate</p>
                <p className="font-semibold">{((campaign.openRate || 0) * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-500">Click Rate</p>
                <p className="font-semibold">{((campaign.clickRate || 0) * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-500">Delivery Rate</p>
                <p className="font-semibold">{((campaign.deliveryRate || 0) * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-500">Unsubscribe Rate</p>
                <p className="font-semibold">{((campaign.unsubscribeRate || 0) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <EmailFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        data={editData}
        mode={mode}
      />
    </>
  )
}
