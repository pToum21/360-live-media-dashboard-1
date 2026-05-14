'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ClientFormDialog } from '@/components/forms/client-form-dialog'
import { useRouter } from 'next/navigation'

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

    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')

      router.refresh()
    } catch (error) {
      console.error('Error deleting client:', error)
      alert('Failed to delete. Please try again.')
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">All Clients</h3>
        <Button 
          onClick={handleAdd}
          className="bg-[#2E8741] hover:bg-[#236933]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      <div className="space-y-3">
        {clients.map((client) => (
          <div
            key={client.id}
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{client.name}</h4>
                {client.eventName && (
                  <p className="text-sm text-gray-500 mt-1">{client.eventName}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {client.utmTracking && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      UTM Tracking
                    </Badge>
                  )}
                  {client.conversionTracking && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
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
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(client.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
