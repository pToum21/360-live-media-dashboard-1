'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AbstractFormDialog } from '@/components/forms/abstract-form-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useReadOnly } from '@/contexts/readonly-context'

interface AbstractSubmission {
  id: string
  year: number
  submissionCount: number
  submissionType: string | null
}

interface AbstractManagementProps {
  abstracts: AbstractSubmission[]
  clientId: string
}

export function AbstractManagement({ abstracts, clientId }: AbstractManagementProps) {
  const { isReadOnly } = useReadOnly()
  const [editingAbstract, setEditingAbstract] = useState<AbstractSubmission | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this abstract record?')) return

    const res = await fetch(`/api/abstracts/${id}`, { method: 'DELETE' })
    if (res.ok) {
      router.refresh()
    }
  }

  return (
    <div className="space-y-4">
      {!isReadOnly && (
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setEditingAbstract(null)
              setIsFormOpen(true)
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Abstract Record
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Year</TableHead>
              <TableHead>Submission Type</TableHead>
              <TableHead className="text-right">Submissions</TableHead>
              {!isReadOnly && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {abstracts.map((abstract) => (
              <TableRow key={abstract.id}>
                <TableCell className="font-medium">{abstract.year}</TableCell>
                <TableCell>{abstract.submissionType || 'General'}</TableCell>
                <TableCell className="text-right">{abstract.submissionCount.toLocaleString()}</TableCell>
                {!isReadOnly && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingAbstract(abstract)
                          setIsFormOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(abstract.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AbstractFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        abstract={editingAbstract}
        clientId={clientId}
      />
    </div>
  )
}
