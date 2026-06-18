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

interface RegistrationFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  registration?: EventRegistration | null
  clientId: string
}

export function RegistrationFormDialog({
  open,
  onOpenChange,
  registration,
  clientId,
}: RegistrationFormDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    totalRegistrations: 0,
    compRegistrations: 0,
    paidRegistrations: 0,
    revenue: 0,
    memberCount: 0,
    nonMemberCount: 0,
    studentCount: 0,
    sponsorCount: 0,
    registrationGoal: 0,
    percentOfGoal: 0,
  })

  useEffect(() => {
    if (registration) {
      setFormData({
        date: format(new Date(registration.date), 'yyyy-MM-dd'),
        totalRegistrations: registration.totalRegistrations,
        compRegistrations: registration.compRegistrations || 0,
        paidRegistrations: registration.paidRegistrations || 0,
        revenue: registration.revenue || 0,
        memberCount: registration.memberCount || 0,
        nonMemberCount: registration.nonMemberCount || 0,
        studentCount: registration.studentCount || 0,
        sponsorCount: registration.sponsorCount || 0,
        registrationGoal: registration.registrationGoal || 0,
        percentOfGoal: registration.percentOfGoal ? registration.percentOfGoal * 100 : 0,
      })
    } else {
      setFormData({
        date: format(new Date(), 'yyyy-MM-dd'),
        totalRegistrations: 0,
        compRegistrations: 0,
        paidRegistrations: 0,
        revenue: 0,
        memberCount: 0,
        nonMemberCount: 0,
        studentCount: 0,
        sponsorCount: 0,
        registrationGoal: 0,
        percentOfGoal: 0,
      })
    }
  }, [registration, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      date: new Date(formData.date),
      totalRegistrations: formData.totalRegistrations,
      compRegistrations: formData.compRegistrations || null,
      paidRegistrations: formData.paidRegistrations || null,
      revenue: formData.revenue || null,
      memberCount: formData.memberCount || null,
      nonMemberCount: formData.nonMemberCount || null,
      studentCount: formData.studentCount || null,
      sponsorCount: formData.sponsorCount || null,
      registrationGoal: formData.registrationGoal || null,
      percentOfGoal: formData.percentOfGoal ? formData.percentOfGoal / 100 : null,
      clientId,
    }

    const url = registration ? `/api/registrations/${registration.id}` : '/api/registrations'
    const method = registration ? 'PUT' : 'POST'

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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{registration ? 'Edit Registration' : 'Add Registration'}</DialogTitle>
          <DialogDescription>
            {registration ? 'Update event registration data' : 'Create a new registration record'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="totalRegistrations">Total Registrations</Label>
                <Input
                  id="totalRegistrations"
                  type="number"
                  value={formData.totalRegistrations}
                  onChange={(e) =>
                    setFormData({ ...formData, totalRegistrations: parseInt(e.target.value) })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="paidRegistrations">
                  Paid <span className="text-xs text-muted-foreground">(updates charts)</span>
                </Label>
                <Input
                  id="paidRegistrations"
                  type="number"
                  value={formData.paidRegistrations}
                  onChange={(e) =>
                    setFormData({ ...formData, paidRegistrations: parseInt(e.target.value) })
                  }
                  placeholder="0"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="compRegistrations">
                  Comp <span className="text-xs text-muted-foreground">(updates charts)</span>
                </Label>
                <Input
                  id="compRegistrations"
                  type="number"
                  value={formData.compRegistrations}
                  onChange={(e) =>
                    setFormData({ ...formData, compRegistrations: parseInt(e.target.value) })
                  }
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="revenue">
                  Revenue ($) <span className="text-xs text-muted-foreground">(updates charts)</span>
                </Label>
                <Input
                  id="revenue"
                  type="number"
                  step="0.01"
                  value={formData.revenue}
                  onChange={(e) =>
                    setFormData({ ...formData, revenue: parseFloat(e.target.value) })
                  }
                  placeholder="0"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="registrationGoal">
                  Goal <span className="text-xs text-muted-foreground">(updates charts)</span>
                </Label>
                <Input
                  id="registrationGoal"
                  type="number"
                  value={formData.registrationGoal}
                  onChange={(e) =>
                    setFormData({ ...formData, registrationGoal: parseInt(e.target.value) })
                  }
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="memberCount">Members</Label>
                <Input
                  id="memberCount"
                  type="number"
                  value={formData.memberCount}
                  onChange={(e) =>
                    setFormData({ ...formData, memberCount: parseInt(e.target.value) })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="nonMemberCount">Non-Members</Label>
                <Input
                  id="nonMemberCount"
                  type="number"
                  value={formData.nonMemberCount}
                  onChange={(e) =>
                    setFormData({ ...formData, nonMemberCount: parseInt(e.target.value) })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="studentCount">Students</Label>
                <Input
                  id="studentCount"
                  type="number"
                  value={formData.studentCount}
                  onChange={(e) =>
                    setFormData({ ...formData, studentCount: parseInt(e.target.value) })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sponsorCount">Sponsors</Label>
                <Input
                  id="sponsorCount"
                  type="number"
                  value={formData.sponsorCount}
                  onChange={(e) =>
                    setFormData({ ...formData, sponsorCount: parseInt(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="percentOfGoal">% of Goal</Label>
              <Input
                id="percentOfGoal"
                type="number"
                step="0.1"
                value={formData.percentOfGoal}
                onChange={(e) =>
                  setFormData({ ...formData, percentOfGoal: parseFloat(e.target.value) })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? 'Saving...' : registration ? 'Save Changes' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
