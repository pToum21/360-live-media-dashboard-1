'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ClientFormDialog } from '@/components/forms/client-form-dialog'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface ClientManagementProps {
  clients: any[]
}

export function ClientManagement({ clients }: ClientManagementProps) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editData, setEditData] = useState<any>(null)
  const [mode, setMode] = useState<'create' | 'edit'>('create')

  const handleAdd = () => {
    setMode('create')
    setEditData(null)
    setDialogOpen(true)
  }

  const handleEdit = (client: any) => {
    setMode('edit')
    setEditData(client)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return

    const toastId = toast.loading('Deleting client...')

    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')

      toast.success('Client deleted successfully!', { id: toastId })
      router.refresh()
    } catch (error) {
      console.error('Error deleting client:', error)
      toast.error('Failed to delete client. Please try again.', { id: toastId })
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">All Clients</h3>
        <Button 
          onClick={handleAdd}
          className="bg-[#2E8741] hover:bg-[#236933] dark:bg-[#2E8741] dark:hover:bg-[#3a9d54]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      <div className="space-y-3">
        {clients.map((client) => (
          <div
            key={client.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{client.name}</h4>
                {client.eventName && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{client.eventName}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {client.utmTracking && (
                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                      UTM Tracking
                    </Badge>
                  )}
                  {client.conversionTracking && (
                    <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                      Conversion Tracking
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(client)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Pencil className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(client.id)}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ClientFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        data={editData}
        mode={mode}
      />
    </>
  )
}
