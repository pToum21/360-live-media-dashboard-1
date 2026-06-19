'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PassTypeFormDialog } from '@/components/forms/pass-type-form-dialog'
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

interface PassType {
  id: string
  passTypeName: string
  year: number
  registrationCount: number
  percentOfTotal: number | null
  revenue: number | null
}

interface PassTypeManagementProps {
  passTypes: PassType[]
  clientId: string
}

export function PassTypeManagement({ passTypes, clientId }: PassTypeManagementProps) {
  const { isReadOnly } = useReadOnly()
  const [editingPassType, setEditingPassType] = useState<PassType | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pass type?')) return

    const res = await fetch(`/api/pass-types/${id}`, { method: 'DELETE' })
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
              setEditingPassType(null)
              setIsFormOpen(true)
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Pass Type
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pass Type</TableHead>
              <TableHead>Year</TableHead>
              <TableHead className="text-right">Registrations</TableHead>
              <TableHead className="text-right">% of Total</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              {!isReadOnly && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {passTypes.map((passType) => (
              <TableRow key={passType.id}>
                <TableCell className="font-medium">{passType.passTypeName}</TableCell>
                <TableCell>{passType.year}</TableCell>
                <TableCell className="text-right">{passType.registrationCount.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  {passType.percentOfTotal ? `${(passType.percentOfTotal * 100).toFixed(1)}%` : '-'}
                </TableCell>
                <TableCell className="text-right">
                  {passType.revenue ? `$${passType.revenue.toLocaleString()}` : '-'}
                </TableCell>
                {!isReadOnly && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingPassType(passType)
                          setIsFormOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(passType.id)}
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

      <PassTypeFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        passType={editingPassType}
        clientId={clientId}
      />
    </div>
  )
}
