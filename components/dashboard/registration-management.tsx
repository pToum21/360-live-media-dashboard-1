'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RegistrationFormDialog } from '@/components/forms/registration-form-dialog'
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

interface EventRegistration {
  id: string
  date: Date
  totalRegistrations: number
  compRegistrations: number | null
  paidRegistrations: number | null
  revenue: number | null
  memberCount: number | null
  nonMemberCount: number | null
  studentCount: number | null
  sponsorCount: number | null
  registrationGoal: number | null
  percentOfGoal: number | null
}

interface RegistrationManagementProps {
  registrations: EventRegistration[]
  clientId: string
}

export function RegistrationManagement({ registrations, clientId }: RegistrationManagementProps) {
  const [editingRegistration, setEditingRegistration] = useState<EventRegistration | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this registration record?')) return

    const res = await fetch(`/api/registrations/${id}`, { method: 'DELETE' })
    if (res.ok) {
      router.refresh()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditingRegistration(null)
            setIsFormOpen(true)
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Registration Record
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Paid</TableHead>
              <TableHead className="text-right">Comp</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Goal %</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((registration) => (
              <TableRow key={registration.id}>
                <TableCell className="font-medium">{format(new Date(registration.date), 'MMM dd, yyyy')}</TableCell>
                <TableCell className="text-right">{registration.totalRegistrations.toLocaleString()}</TableCell>
                <TableCell className="text-right">{registration.paidRegistrations?.toLocaleString() || '-'}</TableCell>
                <TableCell className="text-right">{registration.compRegistrations?.toLocaleString() || '-'}</TableCell>
                <TableCell className="text-right">
                  {registration.revenue ? `$${registration.revenue.toLocaleString()}` : '-'}
                </TableCell>
                <TableCell className="text-right">
                  {registration.percentOfGoal ? `${(registration.percentOfGoal * 100).toFixed(0)}%` : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingRegistration(registration)
                        setIsFormOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(registration.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <RegistrationFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        registration={editingRegistration}
        clientId={clientId}
      />
    </div>
  )
}
