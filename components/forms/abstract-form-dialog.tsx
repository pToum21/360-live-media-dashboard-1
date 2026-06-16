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

interface AbstractSubmission {
  id: string
  year: number
  submissionCount: number
  submissionType: string | null
}

interface AbstractFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  abstract?: AbstractSubmission | null
  clientId: string
}

export function AbstractFormDialog({
  open,
  onOpenChange,
  abstract,
  clientId,
}: AbstractFormDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    submissionCount: 0,
    submissionType: 'Late-Breaking',
  })

  useEffect(() => {
    if (abstract) {
      setFormData({
        year: abstract.year,
        submissionCount: abstract.submissionCount,
        submissionType: abstract.submissionType || 'Late-Breaking',
      })
    } else {
      setFormData({
        year: new Date().getFullYear(),
        submissionCount: 0,
        submissionType: 'Late-Breaking',
      })
    }
  }, [abstract, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      year: formData.year,
      submissionCount: formData.submissionCount,
      submissionType: formData.submissionType,
      clientId,
    }

    const url = abstract ? `/api/abstracts/${abstract.id}` : '/api/abstracts'
    const method = abstract ? 'PUT' : 'POST'

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{abstract ? 'Edit Abstract Record' : 'Add Abstract Record'}</DialogTitle>
          <DialogDescription>
            {abstract ? 'Update abstract submission data' : 'Create a new abstract submission record'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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
              <Label htmlFor="submissionType">Submission Type</Label>
              <Input
                id="submissionType"
                value={formData.submissionType}
                onChange={(e) =>
                  setFormData({ ...formData, submissionType: e.target.value })
                }
                placeholder="e.g., Late-Breaking, Regular, Poster"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="submissionCount">Submission Count</Label>
              <Input
                id="submissionCount"
                type="number"
                value={formData.submissionCount}
                onChange={(e) =>
                  setFormData({ ...formData, submissionCount: parseInt(e.target.value) })
                }
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? 'Saving...' : abstract ? 'Save Changes' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
