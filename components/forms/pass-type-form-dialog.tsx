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

interface PassType {
  id: string
  passTypeName: string
  year: number
  registrationCount: number
  percentOfTotal: number | null
  revenue: number | null
}

interface PassTypeFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  passType?: PassType | null
  clientId: string
}

export function PassTypeFormDialog({
  open,
  onOpenChange,
  passType,
  clientId,
}: PassTypeFormDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    passTypeName: '',
    year: new Date().getFullYear(),
    registrationCount: 0,
    percentOfTotal: 0,
    revenue: 0,
  })

  useEffect(() => {
    if (passType) {
      setFormData({
        passTypeName: passType.passTypeName,
        year: passType.year,
        registrationCount: passType.registrationCount,
        percentOfTotal: passType.percentOfTotal ? passType.percentOfTotal * 100 : 0,
        revenue: passType.revenue || 0,
      })
    } else {
      setFormData({
        passTypeName: '',
        year: new Date().getFullYear(),
        registrationCount: 0,
        percentOfTotal: 0,
        revenue: 0,
      })
    }
  }, [passType, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      passTypeName: formData.passTypeName,
      year: formData.year,
      registrationCount: formData.registrationCount,
      percentOfTotal: formData.percentOfTotal / 100,
      revenue: formData.revenue || null,
      clientId,
    }

    const url = passType ? `/api/pass-types/${passType.id}` : '/api/pass-types'
    const method = passType ? 'PUT' : 'POST'

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
          <DialogTitle>{passType ? 'Edit Pass Type' : 'Add Pass Type'}</DialogTitle>
          <DialogDescription>
            {passType ? 'Update pass type details' : 'Create a new pass type entry'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="passTypeName">Pass Type Name</Label>
              <Input
                id="passTypeName"
                value={formData.passTypeName}
                onChange={(e) =>
                  setFormData({ ...formData, passTypeName: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: parseInt(e.target.value) })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="registrationCount">Registrations</Label>
                <Input
                  id="registrationCount"
                  type="number"
                  value={formData.registrationCount}
                  onChange={(e) =>
                    setFormData({ ...formData, registrationCount: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="percentOfTotal">% of Total</Label>
                <Input
                  id="percentOfTotal"
                  type="number"
                  step="0.1"
                  value={formData.percentOfTotal}
                  onChange={(e) =>
                    setFormData({ ...formData, percentOfTotal: parseFloat(e.target.value) })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="revenue">Revenue ($)</Label>
                <Input
                  id="revenue"
                  type="number"
                  step="0.01"
                  value={formData.revenue}
                  onChange={(e) =>
                    setFormData({ ...formData, revenue: parseFloat(e.target.value) })
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
              {loading ? 'Saving...' : passType ? 'Save Changes' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
