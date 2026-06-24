'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RevenueFormDialog } from '@/components/forms/revenue-form-dialog'
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
import { format } from 'date-fns'
import { useReadOnly } from '@/contexts/readonly-context'
import { ExportButtons } from '@/components/ui/export-buttons'
import { formatDateForExport, formatCurrencyForExport, formatNumberForExport } from '@/lib/export-utils'

interface RevenueProjection {
  id: string
  date: Date
  projectedRevenue: number | null
  actualRevenue: number | null
  projectedRegistrations: number | null
  actualRegistrations: number | null
  category: string | null
}

interface RevenueManagementProps {
  projections: RevenueProjection[]
  clientId: string
}

export function RevenueManagement({ projections, clientId }: RevenueManagementProps) {
  const { isReadOnly } = useReadOnly()
  const [editingProjection, setEditingProjection] = useState<RevenueProjection | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this revenue record?')) return

    const res = await fetch(`/api/revenue/${id}`, { method: 'DELETE' })
    if (res.ok) {
      router.refresh()
    }
  }

  return (
    <div className="space-y-4">
      {!isReadOnly && (
        <div className="flex justify-end gap-2">
          <ExportButtons
            exportOptions={{
              filename: 'revenue-projections',
              title: 'Revenue Projections',
              columns: [
                { header: 'Date', key: 'date', formatter: formatDateForExport },
                { header: 'Category', key: 'category' },
                { header: 'Projected Revenue', key: 'projectedRevenue', formatter: formatCurrencyForExport },
                { header: 'Actual Revenue', key: 'actualRevenue', formatter: formatCurrencyForExport },
                { header: 'Projected Registrations', key: 'projectedRegistrations', formatter: formatNumberForExport },
                { header: 'Actual Registrations', key: 'actualRegistrations', formatter: formatNumberForExport },
              ]
            }}
            getData={() => projections}
          />
          <Button
            onClick={() => {
              setEditingProjection(null)
              setIsFormOpen(true)
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Revenue Record
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Projected Revenue</TableHead>
              <TableHead className="text-right">Actual Revenue</TableHead>
              <TableHead className="text-right">Variance</TableHead>
              {!isReadOnly && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {projections.map((projection) => {
              const variance = projection.projectedRevenue && projection.actualRevenue
                ? ((projection.actualRevenue - projection.projectedRevenue) / projection.projectedRevenue) * 100
                : null

              return (
                <TableRow key={projection.id}>
                  <TableCell>{format(new Date(projection.date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell className="font-medium">{projection.category || '-'}</TableCell>
                  <TableCell className="text-right">
                    {projection.projectedRevenue ? `$${projection.projectedRevenue.toLocaleString()}` : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {projection.actualRevenue ? `$${projection.actualRevenue.toLocaleString()}` : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {variance !== null ? (
                      <span className={variance > 0 ? 'text-green-500' : 'text-red-500'}>
                        {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
                      </span>
                    ) : '-'}
                  </TableCell>
                  {!isReadOnly && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingProjection(projection)
                            setIsFormOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(projection.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <RevenueFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        projection={editingProjection}
        clientId={clientId}
      />
    </div>
  )
}
