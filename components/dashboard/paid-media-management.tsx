'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PaidMediaFormDialog } from '@/components/forms/paid-media-form-dialog'
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

interface PaidMedia {
  id: string
  weekStarting: Date
  liImpressions: number | null
  liClicks: number | null
  liSpend: number | null
  liCPC: number | null
  liCTR: number | null
  liConversions: number | null
  liCVR: number | null
  liCPA: number | null
  metaImpressions: number | null
  metaClicks: number | null
  metaSpend: number | null
  metaCPC: number | null
  metaCTR: number | null
  metaConversions: number | null
  metaCVR: number | null
  metaCPA: number | null
  googleSearchImpressions: number | null
  googleSearchClicks: number | null
  googleSearchSpend: number | null
  googleSearchCPC: number | null
  googleSearchCTR: number | null
  googleSearchConversions: number | null
  googleSearchCVR: number | null
  googleSearchCPA: number | null
  googleDisplayImpressions: number | null
  googleDisplayClicks: number | null
  googleDisplaySpend: number | null
  googleDisplayCPC: number | null
  googleDisplayCTR: number | null
  googleDisplayConversions: number | null
  googleDisplayCVR: number | null
  googleDisplayCPA: number | null
}

interface PaidMediaManagementProps {
  paidMedia: PaidMedia[]
  clientId: string
}

export function PaidMediaManagement({ paidMedia, clientId }: PaidMediaManagementProps) {
  const [editingMedia, setEditingMedia] = useState<PaidMedia | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this paid media record?')) return

    const res = await fetch(`/api/paid-media/${id}`, { method: 'DELETE' })
    if (res.ok) {
      router.refresh()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditingMedia(null)
            setIsFormOpen(true)
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Paid Media Record
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Week Starting</TableHead>
              <TableHead className="text-right">LinkedIn Spend</TableHead>
              <TableHead className="text-right">Meta Spend</TableHead>
              <TableHead className="text-right">Google Search</TableHead>
              <TableHead className="text-right">Google Display</TableHead>
              <TableHead className="text-right">Total Conversions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paidMedia.map((media) => {
              const totalConversions = (media.liConversions || 0) + (media.metaConversions || 0) + 
                                      (media.googleSearchConversions || 0) + (media.googleDisplayConversions || 0)
              
              return (
                <TableRow key={media.id}>
                  <TableCell className="font-medium">{format(new Date(media.weekStarting), 'MMM dd, yyyy')}</TableCell>
                  <TableCell className="text-right">{media.liSpend ? `$${media.liSpend.toLocaleString()}` : '-'}</TableCell>
                  <TableCell className="text-right">{media.metaSpend ? `$${media.metaSpend.toLocaleString()}` : '-'}</TableCell>
                  <TableCell className="text-right">{media.googleSearchSpend ? `$${media.googleSearchSpend.toLocaleString()}` : '-'}</TableCell>
                  <TableCell className="text-right">{media.googleDisplaySpend ? `$${media.googleDisplaySpend.toLocaleString()}` : '-'}</TableCell>
                  <TableCell className="text-right">{totalConversions}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingMedia(media)
                          setIsFormOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(media.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <PaidMediaFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        paidMedia={editingMedia}
        clientId={clientId}
      />
    </div>
  )
}
