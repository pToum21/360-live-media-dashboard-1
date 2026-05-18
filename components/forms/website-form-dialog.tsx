'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface WebsiteFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data?: any
  mode: 'create' | 'edit'
}

export function WebsiteFormDialog({ open, onOpenChange, data, mode }: WebsiteFormDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    weekStarting: data?.weekStarting ? new Date(data.weekStarting).toISOString().split('T')[0] : '',
    totalUsers: data?.totalUsers || '',
    newUsers: data?.newUsers || '',
    avgEngagementTimeSec: data?.avgEngagementTimeSec || '',
    healthScore: data?.healthScore || '',
    referral: data?.referral || '',
    organicSearch: data?.organicSearch || '',
    direct: data?.direct || '',
    organicSocial: data?.organicSocial || '',
    email: data?.email || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = mode === 'create' ? '/api/website' : `/api/website/${data.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekStarting: formData.weekStarting,
          totalUsers: parseInt(formData.totalUsers) || 0,
          newUsers: parseInt(formData.newUsers) || 0,
          avgEngagementTimeSec: formData.avgEngagementTimeSec ? parseInt(formData.avgEngagementTimeSec) : null,
          healthScore: formData.healthScore ? parseFloat(formData.healthScore) : null,
          referral: formData.referral ? parseInt(formData.referral) : null,
          organicSearch: formData.organicSearch ? parseInt(formData.organicSearch) : null,
          direct: formData.direct ? parseInt(formData.direct) : null,
          organicSocial: formData.organicSocial ? parseInt(formData.organicSocial) : null,
          email: formData.email ? parseInt(formData.email) : null,
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      toast.success(mode === 'create' ? 'Metric created successfully!' : 'Metric updated successfully!')
      router.refresh()
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving website metric:', error)
      toast.error('Failed to save metric. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add Website Metric' : 'Edit Website Metric'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Enter website analytics data for a new week.' : 'Update website analytics data.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="weekStarting">Week Starting</Label>
              <Input
                id="weekStarting"
                type="date"
                value={formData.weekStarting}
                onChange={(e) => setFormData({ ...formData, weekStarting: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalUsers">Total Users</Label>
                <Input
                  id="totalUsers"
                  type="number"
                  value={formData.totalUsers}
                  onChange={(e) => setFormData({ ...formData, totalUsers: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newUsers">New Users</Label>
                <Input
                  id="newUsers"
                  type="number"
                  value={formData.newUsers}
                  onChange={(e) => setFormData({ ...formData, newUsers: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="avgEngagementTimeSec">Avg Engagement Time (seconds)</Label>
                <Input
                  id="avgEngagementTimeSec"
                  type="number"
                  value={formData.avgEngagementTimeSec}
                  onChange={(e) => setFormData({ ...formData, avgEngagementTimeSec: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="healthScore">Health Score (0-1)</Label>
                <Input
                  id="healthScore"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={formData.healthScore}
                  onChange={(e) => setFormData({ ...formData, healthScore: e.target.value })}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Traffic Sources</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="direct">Direct</Label>
                  <Input
                    id="direct"
                    type="number"
                    value={formData.direct}
                    onChange={(e) => setFormData({ ...formData, direct: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organicSearch">Organic Search</Label>
                  <Input
                    id="organicSearch"
                    type="number"
                    value={formData.organicSearch}
                    onChange={(e) => setFormData({ ...formData, organicSearch: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referral">Referral</Label>
                  <Input
                    id="referral"
                    type="number"
                    value={formData.referral}
                    onChange={(e) => setFormData({ ...formData, referral: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organicSocial">Organic Social</Label>
                  <Input
                    id="organicSocial"
                    type="number"
                    value={formData.organicSocial}
                    onChange={(e) => setFormData({ ...formData, organicSocial: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="number"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#2E8741] hover:bg-[#236933]">
              {loading ? 'Saving...' : mode === 'create' ? 'Create' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
