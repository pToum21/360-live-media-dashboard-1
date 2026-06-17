'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { TestFormDialog } from '@/components/forms/test-form-dialog'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface TestManagementProps {
  tests: any[]
}

export function TestManagement({ tests }: TestManagementProps) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editData, setEditData] = useState<any>(null)
  const [mode, setMode] = useState<'create' | 'edit'>('create')

  const handleAdd = () => {
    setMode('create')
    setEditData(null)
    setDialogOpen(true)
  }

  const handleEdit = (test: any) => {
    setMode('edit')
    setEditData(test)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this test?')) return

    const toastId = toast.loading('Deleting test...')

    try {
      const response = await fetch(`/api/optimizations/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')

      toast.success('Test deleted successfully!', { id: toastId })
      router.refresh()
    } catch (error) {
      console.error('Error deleting test:', error)
      toast.error('Failed to delete test. Please try again.', { id: toastId })
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">All Tests</h3>
        <Button 
          onClick={handleAdd}
          className="bg-[#2E8741] hover:bg-[#236933]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Test
        </Button>
      </div>

      <div className="space-y-3">
        {tests.map((test) => (
          <div
            key={test.id}
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-gray-900">
                    {test.month || 'Unknown Date'}
                  </h4>
                  {test.channel && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      {test.channel}
                    </span>
                  )}
                </div>

                {test.testDescription && (
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-medium">Test:</span> {test.testDescription}
                  </p>
                )}

                {test.results && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Results:</span> {test.results}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(test)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(test.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <TestFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        data={editData}
        mode={mode}
      />
    </>
  )
}
