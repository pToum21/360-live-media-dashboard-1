'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { format } from 'date-fns'

interface RevenueProjection {
  id: string
  date: Date
  projectedRevenue: number | null
  actualRevenue: number | null
  projectedRegistrations: number | null
  actualRegistrations: number | null
  category: string | null
}

interface RevenueFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projection?: RevenueProjection | null
  clientId: string
}

export function RevenueFormDialog({
  open,
  onOpenChange,
  projection,
  clientId,
}: RevenueFormDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    category: '',
    projectedRevenue: 0,
    actualRevenue: 0,
    projectedRegistrations: 0,
    actualRegistrations: 0,
  })

  useEffect(() => {
    if (projection) {
      setFormData({
        date: format(new Date(projection.date), 'yyyy-MM-dd'),
        category: projection.category || '',
        projectedRevenue: projection.projectedRevenue || 0,
        actualRevenue: projection.actualRevenue || 0,
        projectedRegistrations: projection.projectedRegistrations || 0,
        actualRegistrations: projection.actualRegistrations || 0,
      })
    } else {
      setFormData({
        date: format(new Date(), 'yyyy-MM-dd'),
        category: '',
        projectedRevenue: 0,
        actualRevenue: 0,
        projectedRegistrations: 0,
        actualRegistrations: 0,
      })
    }
  }, [projection, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      date: new Date(formData.date),
      category: formData.category || null,
      projectedRevenue: formData.projectedRevenue || null,
      actualRevenue: formData.actualRevenue || null,
      projectedRegistrations: formData.projectedRegistrations || null,
      actualRegistrations: formData.actualRegistrations || null,
      clientId,
    }

    const url = projection ? `/api/revenue/${projection.id}` : '/api/revenue'
    const method = projection ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setLoading(false)

    if (res.ok) {
      onOpenChange(false)
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{projection ? 'Edit Revenue Record' : 'Add Revenue Record'}</DialogTitle>
          <DialogDescription>
            {projection ? 'Update revenue projection/actual data' : 'Create a new revenue record'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g., Members, Sponsors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="projectedRevenue">Projected Revenue ($)</Label>
                <Input
                  id="projectedRevenue"
                  type="number"
                  step="0.01"
                  value={formData.projectedRevenue}
                  onChange={(e) =>
                    setFormData({ ...formData, projectedRevenue: parseFloat(e.target.value) })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="actualRevenue">Actual Revenue ($)</Label>
                <Input
                  id="actualRevenue"
                  type="number"
                  step="0.01"
                  value={formData.actualRevenue}
                  onChange={(e) =>
                    setFormData({ ...formData, actualRevenue: parseFloat(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="projectedRegistrations">Projected Registrations</Label>
                <Input
                  id="projectedRegistrations"
                  type="number"
                  value={formData.projectedRegistrations}
                  onChange={(e) =>
                    setFormData({ ...formData, projectedRegistrations: parseInt(e.target.value) })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="actualRegistrations">Actual Registrations</Label>
                <Input
                  id="actualRegistrations"
                  type="number"
                  value={formData.actualRegistrations}
                  onChange={(e) =>
                    setFormData({ ...formData, actualRegistrations: parseInt(e.target.value) })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? 'Saving...' : projection ? 'Save Changes' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
